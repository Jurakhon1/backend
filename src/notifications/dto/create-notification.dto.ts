import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsOptional,
  IsObject,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { NotificationType } from '../../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({
    example: 'order_status',
    description: 'Тип уведомления',
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty({
    example: 'Заказ обновлен',
    description: 'Заголовок уведомления на русском',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  titleRu: string;

  @ApiProperty({
    example: 'Order updated',
    description: 'Заголовок уведомления на английском',
  })
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  titleEn: string;

  @ApiProperty({
    example: 'Ваш заказ #123 был обновлен и находится в обработке',
    description: 'Текст уведомления на русском',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  messageRu: string;

  @ApiProperty({
    example: 'Your order #123 has been updated and is being processed',
    description: 'Текст уведомления на английском',
  })
  @IsString()
  @MinLength(10)
  @MaxLength(500)
  messageEn: string;

  @ApiPropertyOptional({
    example: { orderId: 123, status: 'processing' },
    description: 'Дополнительные данные уведомления',
  })
  @IsOptional()
  @IsObject()
  data?: any;

  @ApiPropertyOptional({
    example: '2025-01-20T10:30:00.000Z',
    description: 'Время отложенной отправки',
  })
  @IsOptional()
  @IsDateString()
  scheduledAt?: Date;
}
