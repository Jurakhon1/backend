import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';

export class LanguageQueryDto {
  @ApiProperty({
    description: 'Язык интерфейса',
    enum: ['ru', 'en'],
    required: false,
    default: 'ru',
  })
  @IsOptional()
  @IsIn(['ru', 'en'])
  lang?: 'ru' | 'en' = 'ru';
}

