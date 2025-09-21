import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    example: 1,
    description: 'ID товара для отзыва',
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    example: 5,
    description: 'Оценка от 1 до 5',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    example: 'Отличный телефон!',
    description: 'Заголовок отзыва',
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title?: string;

  @ApiProperty({
    example: 'Очень доволен покупкой, рекомендую всем!',
    description: 'Текст отзыва',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  comment: string;

  @ApiPropertyOptional({
    example: 'Быстро работает, хорошая камера',
    description: 'Достоинства товара',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  pros?: string;

  @ApiPropertyOptional({
    example: 'Дорого стоит',
    description: 'Недостатки товара',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  cons?: string;
}
