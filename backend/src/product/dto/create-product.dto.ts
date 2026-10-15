export class CreateProductDto {
  name: string;
  category?: string;
  zone?: string;
  province?: string;
  description?: string;
  producerName?: string;
  phone?: string;
  imageUrl?: string;
  price?: number;
  stock?: number;
  isFeatured?: boolean;
  isLatest?: boolean;
}
