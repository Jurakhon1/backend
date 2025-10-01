import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import {
  AdminAuthResponseDto,
  AdminRefreshTokenDto,
} from './dto/admin-auth-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('admin-auth')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly adminAuthService: AdminAuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход в админ панель' })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход',
    type: AdminAuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async login(@Body() loginDto: AdminLoginDto): Promise<AdminAuthResponseDto> {
    return this.adminAuthService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление токенов админа' })
  @ApiResponse({
    status: 200,
    description: 'Токены обновлены',
    type: AdminAuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Недействительный refresh token' })
  async refresh(
    @Body() refreshTokenDto: AdminRefreshTokenDto,
  ): Promise<AdminAuthResponseDto> {
    return this.adminAuthService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Выход из админ панели' })
  @ApiResponse({ status: 204, description: 'Успешный выход' })
  async logout(@Body() refreshTokenDto: AdminRefreshTokenDto): Promise<void> {
    return this.adminAuthService.logout(refreshTokenDto.refreshToken);
  }

  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Получить информацию о текущем админе' })
  @ApiResponse({
    status: 200,
    description: 'Информация об админе',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        role: { type: 'string' },
        permissions: { type: 'array', items: { type: 'string' } },
        isActive: { type: 'boolean' },
        lastLoginAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  async getCurrentAdmin(@Request() req: any) {
    const admin = await this.adminAuthService.getAdminById(req.user.sub);
    return {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      permissions: admin.permissions || [],
      isActive: admin.isActive,
      lastLoginAt: admin.lastLoginAt,
    };
  }

  @Get('verify')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Проверить валидность токена админа' })
  @ApiResponse({ status: 200, description: 'Токен валиден' })
  @ApiResponse({ status: 401, description: 'Токен недействителен' })
  async verifyToken(@Request() req: any) {
    return {
      valid: true,
      admin: {
        id: req.user.sub,
        email: req.user.email,
        role: req.user.role,
        permissions: req.user.permissions,
      },
    };
  }
}
