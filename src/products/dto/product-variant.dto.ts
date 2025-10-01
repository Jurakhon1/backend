import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({ example: 1, description: 'ID продукта' })
  @IsNumber()
  product_id: number;

  @ApiProperty({ example: 'Красный', description: 'Название варианта' })
  @IsString()
  name: string;

  @ApiProperty({
    example: '#FF0000',
    description: 'Код цвета (HEX)',
    required: false,
  })
  @IsOptional()
  @IsString()
  colorCode?: string;

  @ApiProperty({
    example: 'red',
    description: 'Код цвета (текстовый)',
    required: false,
  })
  @IsOptional()
  @IsString()
  colorName?: string;

  @ApiProperty({
    example: 100,
    description: 'Дополнительная цена',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price_adjustment?: number;

  @ApiProperty({
    example: 50,
    description: 'Остаток на складе',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  stock_quantity?: number;

  @ApiProperty({
    example: true,
    description: 'Активен ли вариант',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateProductVariantDto {
  @ApiProperty({
    example: 'Синий',
    description: 'Название варианта',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '#0000FF',
    description: 'Код цвета (HEX)',
    required: false,
  })
  @IsOptional()
  @IsString()
  colorCode?: string;

  @ApiProperty({
    example: 'blue',
    description: 'Код цвета (текстовый)',
    required: false,
  })
  @IsOptional()
  @IsString()
  colorName?: string;

  @ApiProperty({
    example: 150,
    description: 'Дополнительная цена',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price_adjustment?: number;

  @ApiProperty({
    example: 75,
    description: 'Остаток на складе',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  stock_quantity?: number;

  @ApiProperty({
    example: false,
    description: 'Активен ли вариант',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class ProductVariantResponseDto {
  @ApiProperty({ example: 1, description: 'ID варианта' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID продукта' })
  product_id: number;

  @ApiProperty({ example: 'Красный', description: 'Название варианта' })
  name: string;

  @ApiProperty({ example: '#FF0000', description: 'Код цвета (HEX)' })
  colorCode?: string;

  @ApiProperty({ example: 'red', description: 'Код цвета (текстовый)' })
  colorName?: string;

  @ApiProperty({ example: 100, description: 'Дополнительная цена' })
  price_adjustment?: number;

  @ApiProperty({ example: 50, description: 'Остаток на складе' })
  stock_quantity?: number;

  @ApiProperty({ example: true, description: 'Активен ли вариант' })
  is_active: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Дата создания',
  })
  created_at: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Дата обновления',
  })
  updated_at: Date;
}
