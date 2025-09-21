import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';
import { SettingType } from '../../entities/app-setting.entity';

export class CreateAppSettingDto {
  @ApiProperty({
    example: 'app_name',
    description: 'Ключ настройки',
  })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  settingKey: string;

  @ApiProperty({
    example: 'Mobile Phone Store',
    description: 'Значение настройки',
  })
  @IsString()
  settingValue: string;

  @ApiProperty({
    example: 'string',
    description: 'Тип настройки',
    enum: SettingType,
  })
  @IsEnum(SettingType)
  settingType: SettingType;

  @ApiPropertyOptional({
    example: 'Название приложения',
    description: 'Описание на русском',
  })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiPropertyOptional({
    example: 'Application name',
    description: 'Описание на английском',
  })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Доступно ли клиентскому приложению',
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class UpdateAppSettingDto {
  @ApiProperty({
    example: 'Mobile Phone Store Updated',
    description: 'Новое значение настройки',
  })
  @IsString()
  settingValue: string;

  @ApiPropertyOptional({
    example: 'Обновленное название приложения',
    description: 'Обновленное описание на русском',
  })
  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @ApiPropertyOptional({
    example: 'Updated application name',
    description: 'Обновленное описание на английском',
  })
  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Доступно ли клиентскому приложению',
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}

export class AppSettingResponseDto {
  @ApiProperty({ example: 1, description: 'ID настройки' })
  id: number;

  @ApiProperty({ example: 'app_name', description: 'Ключ настройки' })
  settingKey: string;

  @ApiProperty({
    example: 'Mobile Phone Store',
    description: 'Значение настройки',
  })
  settingValue: string;

  @ApiProperty({
    example: 'string',
    description: 'Тип настройки',
    enum: SettingType,
  })
  settingType: SettingType;

  @ApiPropertyOptional({
    example: 'Название приложения',
    description: 'Описание на русском',
  })
  descriptionRu?: string;

  @ApiPropertyOptional({
    example: 'Application name',
    description: 'Описание на английском',
  })
  descriptionEn?: string;

  @ApiProperty({
    example: true,
    description: 'Доступно ли клиентскому приложению',
  })
  isPublic: boolean;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Дата обновления',
  })
  updatedAt: Date;
}
