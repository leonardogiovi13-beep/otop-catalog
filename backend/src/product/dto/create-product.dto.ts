export class CreateProductDto {
  name: string;
  category?: string;
  province?: string;
  district?: string;
  subDistrict?: string;
  description?: string;
  producerName?: string;
  phone?: string;
  imageUrl?: string;
  price?: number;
  stock?: number;
  isFeatured?: boolean;
  isLatest?: boolean;
}
