import { ApiProperty } from '@nestjs/swagger';
import { LocalizedContentDto } from './product-response.dto';

export class ColorFastDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => LocalizedContentDto })
  name: LocalizedContentDto;

  @ApiProperty()
  code: string;

  @ApiProperty()
  primaryImage: string;

  @ApiProperty({ required: false })
  thumbnail?: string;

  @ApiProperty()
  imageCount: number;

  constructor(partial: Partial<ColorFastDto>) {
    Object.assign(this, partial);
  }
}

export class ProductColorsFastDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ type: () => LocalizedContentDto })
  name: LocalizedContentDto;

  @ApiProperty()
  price: number;

  @ApiProperty({ type: () => [ColorFastDto] })
  colors: ColorFastDto[];

  @ApiProperty()
  currentColor: number;

  @ApiProperty({ 
    type: 'object',
    additionalProperties: { type: 'array', items: { type: 'string' } },
    description: 'Галерея изображений по цветам'
  })
  gallery: { [colorId: string]: string[] };

  constructor(partial: Partial<ProductColorsFastDto>) {
    Object.assign(this, partial);
  }
}
