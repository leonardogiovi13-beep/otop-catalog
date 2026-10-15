import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'otop-jwt-secret-key-2026';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('กรุณาระบุ Token ยืนยันตัวตน');
    }

    // 1. ตรวจสอบ Token ดั้งเดิม (Backward Compatibility)
    if (authHeader === 'Bearer otop-secret-token-2026') {
      return true;
    }

    // 2. ตรวจสอบ JWT Token
    if (authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload: any = jwt.verify(token, JWT_SECRET);
        request.user = payload;

        if (payload.role === 'ADMIN') {
          return true; // อนุญาตเฉพาะสิทธิ์ Admin
        }

        throw new ForbiddenException('คุณไม่มีสิทธิ์ดำเนินการนี้ (เฉพาะผู้ดูแลระบบ Admin เท่านั้น)');
      } catch (err: any) {
        if (err instanceof ForbiddenException) {
          throw err;
        }
        throw new UnauthorizedException('Token ไม่ถูกต้องหรือหมดอายุ');
      }
    }

    throw new UnauthorizedException('รูปแบบ Token ไม่ถูกต้อง');
  }
}

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('กรุณาเข้าสู่ระบบก่อนดำเนินการ');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload: any = jwt.verify(token, JWT_SECRET);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token ไม่ถูกต้องหรือหมดอายุ');
    }
  }
}