import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '../../entities/notification.entity';

export class NotificationResponseDto {
  @ApiProperty({ example: 1, description: 'ID уведомления' })
  id: number;

  @ApiProperty({
    example: 'order_status',
    description: 'Тип уведомления',
    enum: NotificationType,
  })
  type: NotificationType;

  @ApiProperty({
    example: 'Заказ обновлен',
    description: 'Заголовок на русском',
  })
  titleRu: string;

  @ApiProperty({
    example: 'Order updated',
    description: 'Заголовок на английском',
  })
  titleEn: string;

  @ApiProperty({
    example: 'Ваш заказ #123 был обновлен',
    description: 'Сообщение на русском',
  })
  messageRu: string;

  @ApiProperty({
    example: 'Your order #123 has been updated',
    description: 'Сообщение на английском',
  })
  messageEn: string;

  @ApiPropertyOptional({
    example: { orderId: 123, status: 'processing' },
    description: 'Дополнительные данные',
  })
  data?: any;

  @ApiProperty({ example: false, description: 'Прочитано ли уведомление' })
  isRead: boolean;

  @ApiProperty({ example: true, description: 'Отправлено ли уведомление' })
  isSent: boolean;

  @ApiPropertyOptional({
    example: '2025-01-15T14:30:00.000Z',
    description: 'Время отправки',
  })
  sentAt?: Date;

  @ApiPropertyOptional({
    example: '2025-01-15T15:45:00.000Z',
    description: 'Время прочтения',
  })
  readAt?: Date;

  @ApiPropertyOptional({
    example: '2025-01-20T10:30:00.000Z',
    description: 'Запланированное время отправки',
  })
  scheduledAt?: Date;

  @ApiProperty({
    example: '2025-01-15T14:20:00.000Z',
    description: 'Дата создания',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-15T15:45:00.000Z',
    description: 'Дата обновления',
  })
  updatedAt: Date;
}

export class NotificationStatsDto {
  @ApiProperty({ example: 15, description: 'Общее количество уведомлений' })
  total: number;

  @ApiProperty({ example: 5, description: 'Количество непрочитанных' })
  unread: number;

  @ApiProperty({ example: 10, description: 'Количество прочитанных' })
  read: number;

  @ApiProperty({ example: 3, description: 'Количество неотправленных' })
  pending: number;
}
