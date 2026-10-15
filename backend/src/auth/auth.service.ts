import { BadRequestException, Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'otop-jwt-secret-key-2026';

export interface UserJwtPayload {
  sub: number;
  username: string;
  role: string;
  fullName?: string | null;
}

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // สร้าง JWT Token
  generateToken(payload: UserJwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  // ถอดรหัสตรวจสอบ Token
  verifyToken(token: string): UserJwtPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as unknown as UserJwtPayload;
    } catch {
      return null;
    }
  }

  // ==========================================
  // สมัครสมาชิกสำหรับผู้ใช้งานทั่วไป (Register)
  // ==========================================
  async register(dto: RegisterDto) {
    const username = dto.username?.trim();
    const email = dto.email?.trim().toLowerCase();
    const password = dto.password;
    const fullName = dto.fullName?.trim() || null;
    const phone = dto.phone?.trim() || null;

    // 1. ตรวจสอบข้อมูลเบื้องต้น
    if (!username || username.length < 3) {
      throw new BadRequestException('ชื่อผู้ใช้ (Username) ต้องมีความยาวอย่างน้อย 3 ตัวอักษร');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException('รูปแบบอีเมลไม่ถูกต้อง');
    }

    if (!password || password.length < 6) {
      throw new BadRequestException('รหัสผ่าน (Password) ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    }

    // 2. ตรวจสอบว่าชื่อผู้ใช้ซ้ำหรือไม่
    const existingUser = await this.prisma.user.findUnique({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('ชื่อผู้ใช้นี้มีคนใช้งานแล้ว กรุณาเลือกชื่ออื่น');
    }

    // 3. ตรวจสอบว่าอีเมลซ้ำหรือไม่
    const existingEmail = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new BadRequestException('อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว');
    }

    // 4. เข้ารหัสรหัสผ่าน (Hash Password) ด้วย bcryptjs
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 5. บันทึกข้อมูลสมาชิกลงฐานข้อมูล โดยกำหนด role เป็น 'USER'
    const newUser = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        fullName,
        phone,
        role: 'USER',
      },
    });

    // 6. ออก Token ให้สามารถเข้าสู่ระบบได้ทันที
    const token = this.generateToken({
      sub: newUser.id,
      username: newUser.username,
      role: newUser.role,
      fullName: newUser.fullName,
    });

    return {
      message: 'สมัครสมาชิกสำเร็จ ยินดีต้อนรับสู่ระบบ OTOP Catalog',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        phone: newUser.phone,
        role: newUser.role,
      },
    };
  }

  // ==========================================
  // เข้าสู่ระบบ (Login)
  // ==========================================
  async login(dto: LoginDto) {
    const input = dto.username?.trim();
    const password = dto.password;

    if (!input || !password) {
      throw new BadRequestException('กรุณาระบุชื่อผู้ใช้และรหัสผ่าน');
    }

    // รองรับการเข้าสู่ระบบแบบ Admin ดั้งเดิม (Fallback เพื่อความสะดวกในการทดสอบ)
    if (input === 'admin' && password === '1234') {
      const adminToken = this.generateToken({
        sub: 0,
        username: 'admin',
        role: 'ADMIN',
        fullName: 'ผู้ดูแลระบบ (Admin)',
      });

      return {
        message: 'เข้าสู่ระบบสำเร็จ (Admin)',
        token: adminToken,
        user: {
          id: 0,
          username: 'admin',
          email: 'admin@otop.com',
          fullName: 'ผู้ดูแลระบบ',
          role: 'ADMIN',
        },
      };
    }

    // ค้นหาผู้ใช้จาก username หรือ email
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: input },
          { email: input.toLowerCase() },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    // ตรวจสอบรหัสผ่านที่เข้ารหัสไว้
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }

    // ออก JWT Token
    const token = this.generateToken({
      sub: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
    });

    return {
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    };
  }

  // ==========================================
  // ดึงข้อมูลโปรไฟล์ผู้ใช้ปัจจุบัน (Profile)
  // ==========================================
  async getProfile(userId: number) {
    if (userId === 0) {
      return {
        id: 0,
        username: 'admin',
        email: 'admin@otop.com',
        fullName: 'ผู้ดูแลระบบ',
        role: 'ADMIN',
      };
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('ไม่พบข้อมูลผู้ใช้งาน');
    }

    return user;
  }
}
