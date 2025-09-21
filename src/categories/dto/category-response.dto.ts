import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CategoryResponseDto {
  @ApiProperty({ example: 1, description: 'ID категории' })
  id: number;

  @ApiProperty({ example: 'Смартфоны', description: 'Название на русском' })
  nameRu: string;

  @ApiProperty({
    example: 'Smartphones',
    description: 'Название на английском',
  })
  nameEn: string;

  @ApiProperty({ example: 'smartphones', description: 'URL-slug' })
  slug: string;

  @ApiPropertyOptional({
    example: 'Описание категории',
    description: 'Описание на русском',
  })
  descriptionRu?: string;

  @ApiPropertyOptional({
    example: 'Category description',
    description: 'Описание на английском',
  })
  descriptionEn?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/icon.svg',
    description: 'URL иконки',
  })
  iconUrl?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'URL изображения',
  })
  imageUrl?: string;

  @ApiProperty({ example: true, description: 'Активна ли категория' })
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

export class CategoryWithProductsDto extends CategoryResponseDto {
  @ApiProperty({ example: 15, description: 'Количество товаров в категории' })
  productsCount: number;
}
