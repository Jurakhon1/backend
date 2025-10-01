import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ProductQuerySimpleDto {
  @ApiProperty({
    description: 'Включить варианты',
    default: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @Type(() => Boolean)
  includeVariants?: boolean;

  @ApiProperty({
    description: 'Включить комбинации вариантов',
    default: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @Type(() => Boolean)
  includeVariantCombinations?: boolean;

  @ApiProperty({
    description: 'Включить характеристики',
    default: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @Type(() => Boolean)
  includeSpecifications?: boolean;

  @ApiProperty({
    description: 'Включить изображения',
    default: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @Type(() => Boolean)
  includeImages?: boolean;
}

