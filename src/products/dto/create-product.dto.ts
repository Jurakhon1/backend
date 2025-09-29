import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDecimal,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';
import { CreateProductVariantDto } from './product-variant.dto';
import { CreateProductSpecificationDto } from './product-specification.dto';
import { CreateProductImageDto } from './product-image.dto';

export class CreateProductDto {
  @ApiProperty({ description: 'Название продукта на русском' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name_ru: string;

  @ApiProperty({ description: 'Название продукта на английском' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name_en: string;

  @ApiProperty({ description: 'Уникальный URL-слаг' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  slug: string;

  @ApiProperty({ description: 'ID категории' })
  @IsNumber()
  category_id: number;

  @ApiProperty({ description: 'ID бренда' })
  @IsNumber()
  brand_id: number;

  @ApiProperty({ description: 'Модель продукта', required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ description: 'Уникальный артикул (SKU)' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  sku: string;

  @ApiProperty({ description: 'Базовая цена' })
  @IsDecimal()
  base_price: number;

  @ApiProperty({ description: 'Цена со скидкой', required: false })
  @IsOptional()
  @IsDecimal()
  sale_price?: number;

  @ApiProperty({ description: 'Валюта', default: 'RUB' })
  @IsOptional()
  @IsString()
  currency?: string = 'RUB';

  @ApiProperty({ description: 'Описание на русском', required: false })
  @IsOptional()
  @IsString()
  description_ru?: string;

  @ApiProperty({ description: 'Описание на английском', required: false })
  @IsOptional()
  @IsString()
  description_en?: string;

  @ApiProperty({ description: 'Краткое описание на русском', required: false })
  @IsOptional()
  @IsString()
  short_description_ru?: string;

  @ApiProperty({
    description: 'Краткое описание на английском',
    required: false,
  })
  @IsOptional()
  @IsString()
  short_description_en?: string;

  @ApiProperty({ description: 'Вес в граммах', required: false })
  @IsOptional()
  @IsDecimal()
  weight?: number;

  @ApiProperty({ description: 'Размеры', required: false })
  @IsOptional()
  @IsString()
  dimensions?: string;

  @ApiProperty({ description: 'Гарантия в месяцах', default: 12 })
  @IsOptional()
  @IsInt()
  warranty_months?: number = 12;

  @ApiProperty({ description: 'Количество на складе', default: 0 })
  @IsOptional()
  @IsInt()
  stock_quantity?: number = 0;

  @ApiProperty({ description: 'Минимальный уровень запаса', default: 5 })
  @IsOptional()
  @IsInt()
  min_stock_level?: number = 5;

  @ApiProperty({ description: 'Активен ли продукт', default: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;

  @ApiProperty({ description: 'Рекомендуемый продукт', default: false })
  @IsOptional()
  @IsBoolean()
  is_featured?: boolean = false;

  @ApiProperty({ description: 'SEO заголовок на русском', required: false })
  @IsOptional()
  @IsString()
  meta_title_ru?: string;

  @ApiProperty({ description: 'SEO заголовок на английском', required: false })
  @IsOptional()
  @IsString()
  meta_title_en?: string;

  @ApiProperty({ description: 'SEO описание на русском', required: false })
  @IsOptional()
  @IsString()
  meta_description_ru?: string;

  @ApiProperty({ description: 'SEO описание на английском', required: false })
  @IsOptional()
  @IsString()
  meta_description_en?: string;

  @ApiProperty({
    description: 'Варианты продукта',
    type: [CreateProductVariantDto],
    required: false,
  })
  @IsOptional()
  variants?: CreateProductVariantDto[];

  @ApiProperty({
    description: 'Характеристики продукта',
    type: [CreateProductSpecificationDto],
    required: false,
  })
  @IsOptional()
  specifications?: CreateProductSpecificationDto[];

  @ApiProperty({
    description: 'Изображения продукта',
    type: [CreateProductImageDto],
    required: false,
  })
  @IsOptional()
  images?: CreateProductImageDto[];
}
