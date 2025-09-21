import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty({ example: 1, description: 'ID отзыва' })
  id: number;

  @ApiProperty({ example: 1, description: 'ID товара' })
  productId: number;

  @ApiProperty({ example: 1, description: 'ID пользователя' })
  userId: number;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  userFirstName: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  userLastName: string;

  @ApiProperty({ example: 5, description: 'Оценка от 1 до 5' })
  rating: number;

  @ApiPropertyOptional({
    example: 'Отличный телефон!',
    description: 'Заголовок отзыва',
  })
  title?: string;

  @ApiProperty({
    example: 'Очень доволен покупкой!',
    description: 'Текст отзыва',
  })
  comment: string;

  @ApiPropertyOptional({
    example: 'Быстро работает',
    description: 'Достоинства',
  })
  pros?: string;

  @ApiPropertyOptional({ example: 'Дорого стоит', description: 'Недостатки' })
  cons?: string;

  @ApiProperty({ example: true, description: 'Подтвержденная покупка' })
  isVerifiedPurchase: boolean;

  @ApiProperty({ example: true, description: 'Одобрен модератором' })
  isApproved: boolean;

  @ApiProperty({ example: 5, description: 'Количество полезных голосов' })
  helpfulCount: number;

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
