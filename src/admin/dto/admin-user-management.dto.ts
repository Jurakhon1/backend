import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserStatusDto {
  @ApiProperty({ example: true, description: 'Активен ли пользователь' })
  @IsBoolean()
  isActive: boolean;

  @ApiPropertyOptional({
    example: 'Нарушение правил сервиса',
    description: 'Причина блокировки',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  blockReason?: string;
}

export class AdminUserResponseDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  email: string;

  @ApiProperty({ example: '+79123456789', description: 'Телефон пользователя' })
  phone: string;

  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  firstName: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  lastName: string;

  @ApiProperty({ example: true, description: 'Активен ли пользователь' })
  isActive: boolean;

  @ApiProperty({ example: true, description: 'Подтвержден ли email' })
  isVerified: boolean;

  @ApiProperty({ example: 5, description: 'Количество заказов' })
  ordersCount: number;

  @ApiProperty({ example: 125000.5, description: 'Общая сумма покупок' })
  totalSpent: number;

  @ApiProperty({
    example: '2024-12-01T09:15:00.000Z',
    description: 'Дата регистрации',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-15T10:30:00.000Z',
    description: 'Последняя активность',
  })
  lastActivity: Date;
}

export class AdminProductManagementDto {
  @ApiProperty({ example: 1, description: 'ID товара' })
  id: number;

  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Название товара' })
  nameRu: string;

  @ApiProperty({
    example: 'iPhone 15 Pro',
    description: 'Название товара на английском',
  })
  nameEn: string;

  @ApiProperty({ example: 'iphone-15-pro', description: 'Slug товара' })
  slug: string;

  @ApiProperty({ example: 89990.0, description: 'Базовая цена' })
  basePrice: number;

  @ApiProperty({ example: 85000.0, description: 'Цена со скидкой' })
  salePrice: number;

  @ApiProperty({ example: 25, description: 'Остаток на складе' })
  stockQuantity: number;

  @ApiProperty({ example: true, description: 'Активен ли товар' })
  isActive: boolean;

  @ApiProperty({ example: true, description: 'Рекомендуемый товар' })
  isFeatured: boolean;

  @ApiProperty({ example: 'Смартфоны', description: 'Категория товара' })
  categoryName: string;

  @ApiProperty({ example: 'Apple', description: 'Бренд товара' })
  brandName: string;

  @ApiProperty({ example: 45, description: 'Количество продаж' })
  salesCount: number;

  @ApiProperty({ example: 4.8, description: 'Средний рейтинг' })
  averageRating: number;

  @ApiProperty({ example: 23, description: 'Количество отзывов' })
  reviewsCount: number;

  @ApiProperty({
    example: '2024-11-15T14:20:00.000Z',
    description: 'Дата создания',
  })
  createdAt: Date;
}
