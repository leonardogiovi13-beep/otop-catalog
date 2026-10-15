import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

// ฟิลด์ที่อนุญาตให้บันทึก (กันฟิลด์แปลกปลอมที่ทำให้ Prisma error)
const ALLOWED_FIELDS = [
  'name', 'category', 'province', 'district', 'subDistrict', 'description', 'producerName',
  'phone', 'imageUrl', 'price', 'stock', 'isFeatured', 'isLatest',
] as const;

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // กรองฟิลด์ + ตรวจกฎธุรกิจ (price > 0, stock >= 0)
  private clean(dto: Partial<CreateProductDto>, isCreate: boolean) {
    const data: Record<string, any> = {};
    for (const key of ALLOWED_FIELDS) {
      if ((dto as any)[key] !== undefined) data[key] = (dto as any)[key];
    }

    if (isCreate && (typeof data.name !== 'string' || !data.name.trim())) {
      throw new BadRequestException('กรุณาระบุชื่อสินค้า');
    }
    if (data.price !== undefined && data.price !== null) {
      const price = Number(data.price);
      data.price = Number.isFinite(price) && price >= 0 ? Math.round(price) : 0;
    } else if (isCreate) {
      data.price = 0;
    }

    if (data.stock !== undefined && data.stock !== null) {
      const stock = Number(data.stock);
      data.stock = Number.isFinite(stock) && stock >= 0 ? Math.round(stock) : 0;
    } else if (isCreate) {
      data.stock = 0;
    }
    return data;
  }

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: this.clean(createProductDto, true) as any });
  }

  async findAll() {
    return this.prisma.product.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`ไม่พบสินค้า id ${id}`);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: this.clean(updateProductDto, false) as any,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
