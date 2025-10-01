import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  IsBase64,
} from 'class-validator';

export class CreateProductImageBase64Dto {
  @ApiProperty({ example: 1, description: 'ID продукта' })
  @IsNumber()
  product_id: number;

  @ApiProperty({ example: 1, description: 'ID варианта (цвета)', required: false })
  @IsOptional()
  @IsNumber()
  variant_id?: number;

  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    description: 'Base64 основного изображения',
  })
  @IsString()
  @IsBase64()
  primary_image_base64: string;

  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    description: 'Base64 миниатюры',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsBase64()
  thumbnail_base64?: string;

  @ApiProperty({
    example: [
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    ],
    description: 'Base64 галереи изображений',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery_base64?: string[];

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

export class UpdateProductImageBase64Dto {
  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    description: 'Base64 основного изображения',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsBase64()
  primary_image_base64?: string;

  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    description: 'Base64 миниатюры',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsBase64()
  thumbnail_base64?: string;

  @ApiProperty({
    example: [
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    ],
    description: 'Base64 галереи изображений',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gallery_base64?: string[];

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

export class ProductImageBase64ResponseDto {
  @ApiProperty({ example: 1, description: 'ID изображения' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID продукта' })
  product_id: number;

  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    description: 'Base64 основного изображения',
  })
  primary_image_base64: string;

  @ApiProperty({
    example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    description: 'Base64 миниатюры',
  })
  thumbnail_base64?: string;

  @ApiProperty({
    example: [
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
      'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
    ],
    description: 'Base64 галереи изображений',
  })
  gallery_base64?: string[];

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
