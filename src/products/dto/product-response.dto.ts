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
  name_ru: string;
  name_en: string;
  slug: string;
  category: {
    id: number;
    name_ru: string;
    name_en: string;
    slug: string;
  };
  brand: {
    id: number;
    name: string;
    slug: string;
  };
  base_price: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: Date;
  variants?: ProductVariantDto[];
  specifications?: ProductSpecificationDto[];

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
