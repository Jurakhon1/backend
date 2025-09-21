import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUrl,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Смартфоны',
    description: 'Название категории на русском',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nameRu: string;

  @ApiProperty({
    example: 'Smartphones',
    description: 'Название категории на английском',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  nameEn: string;

  @ApiProperty({
    example: 'smartphones',
    description: 'URL-slug категории',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional({
    example: 'Современные смартфоны от ведущих производителей',
    description: 'Описание категории на русском',
  })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiPropertyOptional({
    example: 'Modern smartphones from leading manufacturers',
    description: 'Описание категории на английском',
  })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icon.svg',
    description: 'URL иконки категории',
  })
  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'URL изображения категории',
  })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Активна ли категория',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'Порядок сортировки',
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({
    example: 'Купить смартфоны',
    description: 'Meta title для SEO на русском',
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  metaTitleRu?: string;

  @ApiPropertyOptional({
    example: 'Buy smartphones',
    description: 'Meta title для SEO на английском',
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  metaTitleEn?: string;

  @ApiPropertyOptional({
    example: 'Лучшие смартфоны по выгодным ценам',
    description: 'Meta description для SEO на русском',
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescriptionRu?: string;

  @ApiPropertyOptional({
    example: 'Best smartphones at great prices',
    description: 'Meta description для SEO на английском',
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescriptionEn?: string;
}
