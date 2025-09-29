import { ApiProperty } from '@nestjs/swagger';
import { LocalizedContentDto } from './product-response.dto';

export class VariantOptionDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => LocalizedContentDto })
  name: LocalizedContentDto;

  @ApiProperty({ type: () => LocalizedContentDto })
  value: LocalizedContentDto;

  @ApiProperty({ required: false })
  colorCode?: string;

  @ApiProperty()
  variantType: string;

  @ApiProperty()
  sortOrder: number;

  constructor(partial: Partial<VariantOptionDto>) {
    Object.assign(this, partial);
  }
}

export class ProductVariantCombinationDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ description: 'Уникальный SKU для комбинации' })
  sku: string;

  @ApiProperty({
    description: 'Массив вариантов в комбинации',
    type: () => [VariantOptionDto],
  })
  options: VariantOptionDto[];

  @ApiProperty({ description: 'Дополнительная стоимость за комбинацию' })
  priceModifier: number;

  @ApiProperty({ description: 'Количество на складе для этой комбинации' })
  stockQuantity: number;

  @ApiProperty({ description: 'Активна ли комбинация' })
  isActive: boolean;

  @ApiProperty({ description: 'Порядок сортировки' })
  sortOrder: number;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<ProductVariantCombinationDto>) {
    Object.assign(this, partial);
  }
}

export class CreateVariantCombinationDto {
  @ApiProperty({ description: 'Массив ID вариантов для комбинации' })
  variantIds: number[];

  @ApiProperty({ description: 'Уникальный SKU для комбинации' })
  sku: string;

  @ApiProperty({ description: 'Дополнительная стоимость', default: 0 })
  priceModifier?: number = 0;

  @ApiProperty({ description: 'Количество на складе', default: 0 })
  stockQuantity?: number = 0;

  @ApiProperty({ description: 'Активна ли комбинация', default: true })
  isActive?: boolean = true;

  @ApiProperty({ description: 'Порядок сортировки', default: 0 })
  sortOrder?: number = 0;
}
