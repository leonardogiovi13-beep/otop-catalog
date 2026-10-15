import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <--- เพิ่มบรรทัดนี้เพื่อให้โมดูลอื่นหยิบไปใช้ได้
})
export class PrismaModule {}