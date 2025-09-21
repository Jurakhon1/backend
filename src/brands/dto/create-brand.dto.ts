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

export class CreateBrandDto {
  @ApiProperty({
    example: 'Apple',
    description: 'Название бренда',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'apple',
    description: 'URL-slug бренда',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  slug: string;

  @ApiPropertyOptional({
    example: 'https://example.com/apple-logo.png',
    description: 'URL логотипа бренда',
  })
  @IsOptional()
  @IsUrl()
  logoUrl?: string;

  @ApiPropertyOptional({
    example: 'Apple Inc. — американская корпорация',
    description: 'Описание бренда на русском',
  })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiPropertyOptional({
    example: 'Apple Inc. is an American corporation',
    description: 'Описание бренда на английском',
  })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional({
    example: 'https://apple.com',
    description: 'URL официального сайта бренда',
  })
  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Активен ли бренд',
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
    example: 'Товары Apple',
    description: 'Meta title для SEO на русском',
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  metaTitleRu?: string;

  @ApiPropertyOptional({
    example: 'Apple Products',
    description: 'Meta title для SEO на английском',
  })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  metaTitleEn?: string;

  @ApiPropertyOptional({
    example: 'Официальные товары Apple по выгодным ценам',
    description: 'Meta description для SEO на русском',
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescriptionRu?: string;

  @ApiPropertyOptional({
    example: 'Official Apple products at great prices',
    description: 'Meta description для SEO на английском',
  })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescriptionEn?: string;
}
