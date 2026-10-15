import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

// ฟิลด์ที่อนุญาตให้บันทึก (กันฟิลด์แปลกปลอมที่ทำให้ Prisma error)
const ALLOWED_FIELDS = [
  'name', 'category', 'province', 'district', 'subDistrict', 'description', 'producerName',
  'phone', 'imageUrl', 'images', 'lots', 'price', 'stock', 'isFeatured', 'isLatest',
] as const;

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // แปลง images และ lots ให้เป็น array สำหรับ response
  private formatProduct(p: any) {
    if (!p) return p;
    let images = [];
    if (typeof p.images === 'string') {
      try { images = JSON.parse(p.images); } catch { images = p.images ? [p.images] : []; }
    } else if (Array.isArray(p.images)) {
      images = p.images;
    } else if (p.imageUrl) {
      images = [p.imageUrl];
    }

    let lots = [];
    if (typeof p.lots === 'string') {
      try { lots = JSON.parse(p.lots); } catch { lots = []; }
    } else if (Array.isArray(p.lots)) {
      lots = p.lots;
    }

    return {
      ...p,
      images,
      lots,
    };
  }

  // กรองฟิลด์ + ตรวจกฎธุรกิจ (price > 0, stock >= 0)
  private clean(dto: Partial<CreateProductDto>, isCreate: boolean) {
    const data: Record<string, any> = {};
    for (const key of ALLOWED_FIELDS) {
      if ((dto as any)[key] !== undefined) data[key] = (dto as any)[key];
    }

    if (isCreate && (typeof data.name !== 'string' || !data.name.trim())) {
      throw new BadRequestException('กรุณาระบุชื่อสินค้า');
    }

    if (data.images !== undefined) {
      data.images = typeof data.images === 'string' ? data.images : JSON.stringify(data.images);
    }
    if (data.lots !== undefined) {
      data.lots = typeof data.lots === 'string' ? data.lots : JSON.stringify(data.lots);
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
    const created = await this.prisma.product.create({ data: this.clean(createProductDto, true) as any });
    return this.formatProduct(created);
  }

  async findAll() {
    const list = await this.prisma.product.findMany({ orderBy: { id: 'asc' } });
    return list.map(item => this.formatProduct(item));
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`ไม่พบสินค้า id ${id}`);
    return this.formatProduct(product);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);
    const updated = await this.prisma.product.update({
      where: { id },
      data: this.clean(updateProductDto, false) as any,
    });
    return this.formatProduct(updated);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }
}
