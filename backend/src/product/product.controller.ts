import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdminGuard } from '../auth.guard'; // 👈 นำเข้าด่านตรวจที่เราเพิ่งสร้าง

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AdminGuard) // 🔒 ล็อก: ต้องมี Token เท่านั้นถึงเพิ่มสินค้าได้
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get() // 🔓 สาธารณะ: ใครก็เข้าเว็บมาดูรายการสินค้าได้
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id') // 🔓 สาธารณะ
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @UseGuards(AdminGuard) // 🔒 ล็อก
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @UseGuards(AdminGuard) // 🔒 ล็อก: ต้องมี Token ถึงลบได้
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}