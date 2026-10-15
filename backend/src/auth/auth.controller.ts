import { Controller, Post, Body, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 📝 API สำหรับสมัครสมาชิกทั่วไป
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // 🔑 API สำหรับเข้าสู่ระบบ (ทั้ง User ทั่วไป และ Admin)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // 👤 API ดูข้อมูลโปรไฟล์ตนเอง
  @Get('me')
  getProfile(@Req() req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('กรุณาเข้าสู่ระบบก่อนดำเนินการ');
    }

    const token = authHeader.split(' ')[1];
    const payload = this.authService.verifyToken(token);
    if (!payload) {
      throw new UnauthorizedException('Token ไม่ถูกต้องหรือหมดอายุ');
    }

    return this.authService.getProfile(payload.sub);
  }
}
