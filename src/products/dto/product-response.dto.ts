import { ApiProperty } from '@nestjs/swagger';
import { ProductVariantResponseDto } from './product-variant.dto';
import { ProductSpecificationResponseDto } from './product-specification.dto';
import { ProductImageResponseDto } from './product-image.dto';
import { ProductVariantCombinationDto } from './product-variant-combination.dto';

// Локализованные DTO для одного ответа
export class LocalizedContentDto {
  @ApiProperty({ description: 'Текст на русском' })
  ru: string;

  @ApiProperty({ description: 'Текст на английском' })
  en: string;

  constructor(partial: Partial<LocalizedContentDto>) {
    Object.assign(this, partial);
  }
}

export class LocalizedVariantDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => LocalizedContentDto })
  variantName: LocalizedContentDto;

  @ApiProperty({ enum: ['color', 'memory', 'storage', 'size', 'other'] })
  variantType: string;

  @ApiProperty({ type: () => LocalizedContentDto })
  variantValue: LocalizedContentDto;

  @ApiProperty({ required: false })
  colorCode?: string;

  @ApiProperty()
  priceModifier: number;

  @ApiProperty()
  stockQuantity: number;

  @ApiProperty({ required: false })
  skuSuffix?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<LocalizedVariantDto>) {
    Object.assign(this, partial);
  }
}

export class LocalizedSpecificationDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => LocalizedContentDto })
  specName: LocalizedContentDto;

  @ApiProperty({ type: () => LocalizedContentDto })
  specValue: LocalizedContentDto;

  @ApiProperty({ required: false })
  specGroup?: string;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<LocalizedSpecificationDto>) {
    Object.assign(this, partial);
  }
}

export class ProductResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => LocalizedContentDto })
  name: LocalizedContentDto;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  model?: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  category: {
    id: number;
    name: LocalizedContentDto;
    name_ru: string;
    name_en: string;
    slug: string;
  };

  @ApiProperty()
  brand: {
    id: number;
    name: string;
    slug: string;
  };

  @ApiProperty()
  base_price: number;

  @ApiProperty({ required: false })
  sale_price?: number;

  @ApiProperty()
  currency: string;

  @ApiProperty({ type: () => LocalizedContentDto, required: false })
  description?: LocalizedContentDto;

  @ApiProperty({ type: () => LocalizedContentDto, required: false })
  short_description?: LocalizedContentDto;

  @ApiProperty({ required: false })
  weight?: number;

  @ApiProperty({ required: false })
  dimensions?: string;

  @ApiProperty()
  warranty_months: number;

  @ApiProperty()
  stock_quantity: number;

  @ApiProperty()
  min_stock_level: number;

  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  is_featured: boolean;

  @ApiProperty({ required: false })
  meta_title_ru?: string;

  @ApiProperty({ required: false })
  meta_title_en?: string;

  @ApiProperty({ required: false })
  meta_description_ru?: string;

  @ApiProperty({ required: false })
  meta_description_en?: string;

  @ApiProperty({ type: () => [LocalizedVariantDto], required: false })
  variants?: LocalizedVariantDto[];

  @ApiProperty({ type: () => [ProductVariantCombinationDto], required: false })
  variantCombinations?: ProductVariantCombinationDto[];

  @ApiProperty({ type: () => [LocalizedSpecificationDto], required: false })
  specifications?: LocalizedSpecificationDto[];

  @ApiProperty({ type: [ProductImageResponseDto], required: false })
  images?: ProductImageResponseDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
