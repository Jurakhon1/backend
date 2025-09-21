import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    example: '+79123456789',
    description: 'Номер телефона',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'password123',
    description: 'Пароль (минимум 6 символов)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Иван',
    description: 'Имя пользователя',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    example: 'Иванов',
    description: 'Фамилия пользователя',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiPropertyOptional({
    example: 'ru',
    description: 'Предпочитаемый язык',
    enum: ['ru', 'en'],
    default: 'ru',
  })
  @IsOptional()
  @IsEnum(['ru', 'en'])
  languagePreference?: 'ru' | 'en';
}
