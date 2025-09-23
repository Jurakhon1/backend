export class ProductVariantDto {
  id: number;
  variantNameRu: string;
  variantNameEn: string;
  variantType: string;
  variantValueRu: string;
  variantValueEn: string;
  colorCode?: string;
  priceModifier: number;
  stockQuantity: number;
  skuSuffix?: string;
  isActive: boolean;
  sortOrder: number;
}

export class ProductSpecificationDto {
  id: number;
  specNameRu: string;
  specNameEn: string;
  specValueRu: string;
  specValueEn: string;
  specGroup?: string;
  sortOrder: number;
}

export class ProductResponseDto {
  id: number;
  nameRu: string; // Изменено для совместимости с Frontend
  nameEn: string; // Изменено для совместимости с Frontend
  slug: string;
  descriptionRu?: string;
  descriptionEn?: string;
  basePrice: number; // Изменено для совместимости с Frontend
  discountPrice?: number; // Изменено для совместимости с Frontend
  stockQuantity: number; // Изменено для совместимости с Frontend
  sku: string;
  barcode?: string;
  weight?: number;
  rating?: number; // Добавлено
  reviewCount: number; // Добавлено
  isActive: boolean; // Изменено для совместимости с Frontend
  isFeatured: boolean; // Добавлено
  categoryId: number; // Добавлено
  brandId?: number; // Добавлено
  category?: {
    id: number;
    nameRu: string;
    nameEn: string;
    slug: string;
  };
  brand?: {
    id: number;
    name: string;
    slug: string;
  };
  images?: {
    id: number;
    imageUrl: string;
    altText?: string;
    sortOrder: number;
    isPrimary: boolean;
  }[];
  createdAt: Date; // Изменено для совместимости с Frontend
  updatedAt: Date; // Добавлено
  variants?: ProductVariantDto[];
  specifications?: ProductSpecificationDto[];

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
