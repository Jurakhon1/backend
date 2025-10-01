import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateColorImageDto {
  @ApiProperty({ example: 1, description: 'ID продукта' })
  @IsNumber()
  product_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID варианта (цвета)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  variant_id?: number;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL основного изображения',
  })
  @IsString()
  @IsUrl()
  primary_image_url: string;

  @ApiProperty({
    example: 'https://example.com/thumb.jpg',
    description: 'URL миниатюры',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  thumbnail_url?: string;

  @ApiProperty({
    example: [
      'https://example.com/gallery1.jpg',
      'https://example.com/gallery2.jpg',
    ],
    description: 'URL галереи изображений',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery_urls?: string[];

  @ApiProperty({
    example: '#FF0000',
    description: 'Код цвета',
    required: false,
  })
  @IsOptional()
  @IsString()
  color_code?: string;

  @ApiProperty({
    example: true,
    description: 'Активно ли изображение',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateColorImageDto {
  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL основного изображения',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  primary_image_url?: string;

  @ApiProperty({
    example: 'https://example.com/thumb.jpg',
    description: 'URL миниатюры',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  thumbnail_url?: string;

  @ApiProperty({
    example: [
      'https://example.com/gallery1.jpg',
      'https://example.com/gallery2.jpg',
    ],
    description: 'URL галереи изображений',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery_urls?: string[];

  @ApiProperty({
    example: '#FF0000',
    description: 'Код цвета',
    required: false,
  })
  @IsOptional()
  @IsString()
  color_code?: string;

  @ApiProperty({
    example: true,
    description: 'Активно ли изображение',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class ColorImageResponseDto {
  @ApiProperty({ example: 1, description: 'ID изображения' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID продукта' })
  product_id: number;

  @ApiProperty({
    example: 1,
    description: 'ID варианта (цвета)',
    required: false,
  })
  variant_id?: number | null;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL основного изображения',
  })
  primary_image_url: string;

  @ApiProperty({
    example: 'https://example.com/thumb.jpg',
    description: 'URL миниатюры',
  })
  thumbnail_url?: string;

  @ApiProperty({
    example: [
      'https://example.com/gallery1.jpg',
      'https://example.com/gallery2.jpg',
    ],
    description: 'URL галереи изображений',
  })
  gallery_urls?: string[];

  @ApiProperty({ example: '#FF0000', description: 'Код цвета' })
  color_code?: string;

  @ApiProperty({ example: true, description: 'Активно ли изображение' })
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
