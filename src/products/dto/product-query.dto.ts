import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ProductQueryDto {
  @ApiProperty({
    description: 'Включить варианты',
    default: true,
    required: false,
  })
  @IsOptional()
  includeVariants?: boolean = true;

  @ApiProperty({
    description: 'Включить комбинации вариантов',
    default: false,
    required: false,
  })
  @IsOptional()
  includeVariantCombinations?: boolean = false;

  @ApiProperty({
    description: 'Включить характеристики',
    default: true,
    required: false,
  })
  @IsOptional()
  includeSpecifications?: boolean = true;

  @ApiProperty({
    description: 'Включить изображения',
    default: true,
    required: false,
  })
  @IsOptional()
  includeImages?: boolean = true;
}
