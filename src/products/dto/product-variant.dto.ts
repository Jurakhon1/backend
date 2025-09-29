import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsHexColor,
} from 'class-validator';

export enum VariantType {
  COLOR = 'color',
  MEMORY = 'memory',
  STORAGE = 'storage',
  SIZE = 'size',
  OTHER = 'other',
}

export class CreateProductVariantDto {
  @ApiProperty({ description: 'Название варианта на русском' })
  @IsString()
  variantNameRu: string;

  @ApiProperty({ description: 'Название варианта на английском' })
  @IsString()
  variantNameEn: string;

  @ApiProperty({ description: 'Тип варианта', enum: VariantType })
  @IsEnum(VariantType)
  variantType: VariantType;

  @ApiProperty({ description: 'Значение варианта на русском' })
  @IsString()
  variantValueRu: string;

  @ApiProperty({ description: 'Значение варианта на английском' })
  @IsString()
  variantValueEn: string;

  @ApiProperty({ description: 'Hex код цвета', required: false })
  @IsOptional()
  @IsHexColor()
  colorCode?: string;

  @ApiProperty({ description: 'Дополнительная стоимость', default: 0 })
  @IsOptional()
  @IsNumber()
  priceModifier?: number = 0;

  @ApiProperty({ description: 'Количество на складе', default: 0 })
  @IsOptional()
  @IsNumber()
  stockQuantity?: number = 0;

  @ApiProperty({ description: 'Суффикс для SKU', required: false })
  @IsOptional()
  @IsString()
  skuSuffix?: string;

  @ApiProperty({ description: 'Активен ли вариант', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({ description: 'Порядок сортировки', default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number = 0;
}

export class ProductVariantResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  variantNameRu: string;

  @ApiProperty()
  variantNameEn: string;

  @ApiProperty({ enum: VariantType })
  variantType: VariantType;

  @ApiProperty()
  variantValueRu: string;

  @ApiProperty()
  variantValueEn: string;

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

  constructor(partial: Partial<ProductVariantResponseDto>) {
    Object.assign(this, partial);
  }
}
