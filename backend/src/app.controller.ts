import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { LoginDto } from './auth/dto/login.dto';
import { RegisterDto } from './auth/dto/register.dto';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello() {
    return 'OTOP Backend is Running!';
  }

  // รองรับ /login โดยตรงเพื่อความเข้ากันได้กับโค้ดเดิม
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // รองรับ /register โดยตรง
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
}