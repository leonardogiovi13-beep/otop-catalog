import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // เปิดใช้งาน CORS เพื่อให้ Angular (localhost:4200 หรือ Vercel) ดึงข้อมูลได้
  app.enableCors();

  // Render กำหนดพอร์ตผ่าน process.env.PORT และต้องฟังที่ 0.0.0.0
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
