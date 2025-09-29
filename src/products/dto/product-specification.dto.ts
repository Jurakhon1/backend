import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateProductSpecificationDto {
  @ApiProperty({ description: 'Название характеристики на русском' })
  @IsString()
  specNameRu: string;

  @ApiProperty({ description: 'Название характеристики на английском' })
  @IsString()
  specNameEn: string;

  @ApiProperty({ description: 'Значение характеристики на русском' })
  @IsString()
  specValueRu: string;

  @ApiProperty({ description: 'Значение характеристики на английском' })
  @IsString()
  specValueEn: string;

  @ApiProperty({ description: 'Группа характеристики', required: false })
  @IsOptional()
  @IsString()
  specGroup?: string;

  @ApiProperty({ description: 'Порядок сортировки', default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder?: number = 0;
}

export class ProductSpecificationResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  specNameRu: string;

  @ApiProperty()
  specNameEn: string;

  @ApiProperty()
  specValueRu: string;

  @ApiProperty()
  specValueEn: string;

  @ApiProperty({ required: false })
  specGroup?: string;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<ProductSpecificationResponseDto>) {
    Object.assign(this, partial);
  }
}
