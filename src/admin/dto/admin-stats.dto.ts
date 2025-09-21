import { ApiProperty } from '@nestjs/swagger';

export class AdminStatsDto {
  @ApiProperty({ example: 1250, description: 'Общее количество пользователей' })
  totalUsers: number;

  @ApiProperty({
    example: 45,
    description: 'Новых пользователей за последние 30 дней',
  })
  newUsersLast30Days: number;

  @ApiProperty({ example: 320, description: 'Общее количество товаров' })
  totalProducts: number;

  @ApiProperty({
    example: 15,
    description: 'Товаров добавлено за последние 30 дней',
  })
  newProductsLast30Days: number;

  @ApiProperty({ example: 89, description: 'Общее количество заказов' })
  totalOrders: number;

  @ApiProperty({ example: 12, description: 'Заказов за последние 30 дней' })
  newOrdersLast30Days: number;

  @ApiProperty({ example: 2500000.5, description: 'Общая сумма продаж' })
  totalRevenue: number;

  @ApiProperty({
    example: 150000.25,
    description: 'Доход за последние 30 дней',
  })
  revenueLast30Days: number;

  @ApiProperty({ example: 156, description: 'Количество отзывов на модерации' })
  pendingReviews: number;

  @ApiProperty({ example: 23, description: 'Количество неактивных товаров' })
  inactiveProducts: number;

  @ApiProperty({ example: 8, description: 'Товаров с низким остатком' })
  lowStockProducts: number;

  @ApiProperty({ example: 5, description: 'Заблокированных пользователей' })
  blockedUsers: number;
}

export class UserStatsDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  email: string;

  @ApiProperty({ example: 'Иван Иванов', description: 'Полное имя' })
  fullName: string;

  @ApiProperty({ example: 5, description: 'Количество заказов' })
  ordersCount: number;

  @ApiProperty({ example: 125000.5, description: 'Общая сумма покупок' })
  totalSpent: number;

  @ApiProperty({
    example: '2025-01-15T10:30:00.000Z',
    description: 'Дата последнего заказа',
  })
  lastOrderDate: Date;

  @ApiProperty({ example: true, description: 'Активен ли пользователь' })
  isActive: boolean;

  @ApiProperty({
    example: '2024-12-01T09:15:00.000Z',
    description: 'Дата регистрации',
  })
  createdAt: Date;
}

export class ProductStatsDto {
  @ApiProperty({ example: 1, description: 'ID товара' })
  id: number;

  @ApiProperty({ example: 'iPhone 15 Pro', description: 'Название товара' })
  name: string;

  @ApiProperty({ example: 'iphone-15-pro', description: 'Slug товара' })
  slug: string;

  @ApiProperty({ example: 89990.0, description: 'Цена товара' })
  price: number;

  @ApiProperty({ example: 25, description: 'Остаток на складе' })
  stockQuantity: number;

  @ApiProperty({ example: 45, description: 'Количество продаж' })
  salesCount: number;

  @ApiProperty({ example: 4.8, description: 'Средний рейтинг' })
  averageRating: number;

  @ApiProperty({ example: 23, description: 'Количество отзывов' })
  reviewsCount: number;

  @ApiProperty({ example: true, description: 'Активен ли товар' })
  isActive: boolean;
}
