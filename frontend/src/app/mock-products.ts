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
  phone?: string;
  price?: number;
  stock?: number;
  isFeatured: boolean;
  isLatest: boolean;
  createdAt?: string;
}  
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