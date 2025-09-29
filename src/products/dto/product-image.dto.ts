import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsUrl,
} from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ description: 'URL изображения' })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({ description: 'Alt текст на русском', required: false })
  @IsOptional()
  @IsString()
  altTextRu?: string;

  @ApiProperty({ description: 'Alt текст на английском', required: false })
  @IsOptional()
  @IsString()
  altTextEn?: string;

  @ApiProperty({ description: 'Порядок сортировки', default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number = 0;

  @ApiProperty({ description: 'Основное изображение', default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean = false;
}

export class ProductImageResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty({ required: false })
  altTextRu?: string;

  @ApiProperty({ required: false })
  altTextEn?: string;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  isPrimary: boolean;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<ProductImageResponseDto>) {
    Object.assign(this, partial);
  }
}
