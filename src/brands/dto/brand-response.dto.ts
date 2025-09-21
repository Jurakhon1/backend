import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BrandResponseDto {
  @ApiProperty({ example: 1, description: 'ID бренда' })
  id: number;

  @ApiProperty({ example: 'Apple', description: 'Название бренда' })
  name: string;

  @ApiProperty({ example: 'apple', description: 'URL-slug' })
  slug: string;

  @ApiPropertyOptional({
    example: 'https://example.com/logo.png',
    description: 'URL логотипа',
  })
  logoUrl?: string;

  @ApiPropertyOptional({
    example: 'Описание бренда',
    description: 'Описание на русском',
  })
  descriptionRu?: string;

  @ApiPropertyOptional({
    example: 'Brand description',
    description: 'Описание на английском',
  })
  descriptionEn?: string;

  @ApiPropertyOptional({
    example: 'https://apple.com',
    description: 'URL сайта',
  })
  websiteUrl?: string;

  @ApiProperty({ example: true, description: 'Активен ли бренд' })
  isActive: boolean;

  @ApiProperty({ example: 0, description: 'Порядок сортировки' })
  sortOrder: number;

  @ApiPropertyOptional({
    example: 'Meta title',
    description: 'Meta title на русском',
  })
  metaTitleRu?: string;

  @ApiPropertyOptional({
    example: 'Meta title',
    description: 'Meta title на английском',
  })
  metaTitleEn?: string;

  @ApiPropertyOptional({
    example: 'Meta description',
    description: 'Meta description на русском',
  })
  metaDescriptionRu?: string;

  @ApiPropertyOptional({
    example: 'Meta description',
    description: 'Meta description на английском',
  })
  metaDescriptionEn?: string;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Дата создания',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Дата обновления',
  })
  updatedAt: Date;
}

export class BrandWithProductsDto extends BrandResponseDto {
  @ApiProperty({ example: 15, description: 'Количество товаров бренда' })
  productsCount: number;
}
