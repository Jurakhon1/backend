import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AppSettingsService } from './app-settings.service';
import {
  CreateAppSettingDto,
  UpdateAppSettingDto,
  AppSettingResponseDto,
} from './dto/app-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('app-settings')
@Controller('app-settings')
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Получить настройки приложения' })
  @ApiQuery({
    name: 'publicOnly',
    required: false,
    type: Boolean,
    description: 'Только публичные настройки',
  })
  @ApiResponse({
    status: 200,
    description: 'Список настроек',
    type: [AppSettingResponseDto],
  })
  async findAll(
    @Query('publicOnly') publicOnly?: boolean,
  ): Promise<AppSettingResponseDto[]> {
    return await this.appSettingsService.findAll(publicOnly || false);
  }

  @Get('public')
  @Public()
  @ApiOperation({
    summary: 'Получить публичные настройки для мобильного приложения',
  })
  @ApiResponse({
    status: 200,
    description: 'Публичные настройки',
    type: [AppSettingResponseDto],
  })
  async getPublicSettings(): Promise<AppSettingResponseDto[]> {
    return await this.appSettingsService.findAll(true);
  }

  @Get(':key')
  @Public()
  @ApiOperation({ summary: 'Получить настройку по ключу' })
  @ApiParam({ name: 'key', type: 'string', description: 'Ключ настройки' })
  @ApiResponse({
    status: 200,
    description: 'Настройка',
    type: AppSettingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Настройка не найдена' })
  async findByKey(@Param('key') key: string): Promise<AppSettingResponseDto> {
    return await this.appSettingsService.findByKey(key);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новую настройку (только для админов)' })
  @ApiResponse({
    status: 201,
    description: 'Настройка создана',
    type: AppSettingResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Настройка с таким ключом уже существует',
  })
  async create(
    @Body() createDto: CreateAppSettingDto,
  ): Promise<AppSettingResponseDto> {
    return await this.appSettingsService.create(createDto);
  }

  @Patch(':key')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Обновить настройку (только для админов)' })
  @ApiParam({ name: 'key', type: 'string', description: 'Ключ настройки' })
  @ApiResponse({
    status: 200,
    description: 'Настройка обновлена',
    type: AppSettingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Настройка не найдена' })
  async update(
    @Param('key') key: string,
    @Body() updateDto: UpdateAppSettingDto,
  ): Promise<AppSettingResponseDto> {
    return await this.appSettingsService.update(key, updateDto);
  }

  @Delete(':key')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить настройку (только для админов)' })
  @ApiParam({ name: 'key', type: 'string', description: 'Ключ настройки' })
  @ApiResponse({ status: 204, description: 'Настройка удалена' })
  @ApiResponse({ status: 404, description: 'Настройка не найдена' })
  async remove(@Param('key') key: string): Promise<void> {
    return await this.appSettingsService.remove(key);
  }

  @Post('initialize')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Инициализировать настройки по умолчанию (только для админов)',
  })
  @ApiResponse({ status: 204, description: 'Настройки инициализированы' })
  async initializeDefaults(): Promise<void> {
    return await this.appSettingsService.initializeDefaultSettings();
  }
}
