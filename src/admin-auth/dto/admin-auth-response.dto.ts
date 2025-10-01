import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AdminAuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT токен доступа',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh токен для обновления access токена',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Информация об админе',
    type: 'object',
    properties: {
      id: { type: 'number', example: 1 },
      email: { type: 'string', example: 'super-admin@phone-store.com' },
      firstName: { type: 'string', example: 'Super' },
      lastName: { type: 'string', example: 'Admin' },
      role: { type: 'string', example: 'super_admin' },
      permissions: {
        type: 'array',
        items: { type: 'string' },
        example: ['users:create', 'users:view', 'products:create'],
      },
      isActive: { type: 'boolean', example: true },
      lastLoginAt: { type: 'string', format: 'date-time' },
    },
  })
  admin: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    permissions: string[];
    isActive: boolean;
    lastLoginAt: Date;
  };

  constructor(partial: Partial<AdminAuthResponseDto>) {
    Object.assign(this, partial);
  }
}

export class AdminRefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh токен для обновления access токена',
  })
  @IsString()
  refreshToken: string;
}
