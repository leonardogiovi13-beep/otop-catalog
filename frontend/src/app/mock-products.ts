export interface ProductLot {
  id?: number;
  lotNumber: string; // เช่น ล็อตที่ 1, ล็อตที่ 2
  price: number;     // ราคา
  stock: number;     // จำนวนสินค้า
}

export interface Product {
  id: number;
  name: string;
  category: string;
  province: string;
  district?: string;
  subDistrict?: string;
  description?: string;
  producerName?: string;
  imageUrl?: string;
  images?: string[];
  lots?: ProductLot[];
  phone?: string;
  price?: number;
  stock?: number;
  isFeatured: boolean;
  isLatest: boolean;
  createdAt?: string;
}

export interface CommunityProducer {
  id: number;
  name: string;
  province: string;
  zone: string;
  highlight?: string;
  imageUrl?: string;
  contact?: string;
}

export const MOCK_PRODUCERS: CommunityProducer[] = [

];