import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import {
  BrandResponseDto,
  BrandWithProductsDto,
} from './dto/brand-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новый бренд' })
  @ApiResponse({
    status: 201,
    description: 'Бренд создан',
    type: BrandResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Бренд с таким slug уже существует',
  })
  async create(
    @Body() createBrandDto: CreateBrandDto,
  ): Promise<BrandResponseDto> {
    return await this.brandsService.create(createBrandDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Получить список всех брендов' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Включить неактивные бренды',
  })
  @ApiResponse({
    status: 200,
    description: 'Список брендов',
    type: [BrandWithProductsDto],
  })
  async findAll(
    @Query('includeInactive') includeInactive?: boolean,
  ): Promise<BrandWithProductsDto[]> {
    return await this.brandsService.findAll(includeInactive);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Получить бренд по ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID бренда' })
  @ApiResponse({
    status: 200,
    description: 'Информация о бренде',
    type: BrandWithProductsDto,
  })
  @ApiResponse({ status: 404, description: 'Бренд не найден' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BrandWithProductsDto> {
    return await this.brandsService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Получить бренд по slug' })
  @ApiParam({ name: 'slug', type: 'string', description: 'Slug бренда' })
  @ApiResponse({
    status: 200,
    description: 'Информация о бренде',
    type: BrandWithProductsDto,
  })
  @ApiResponse({ status: 404, description: 'Бренд не найден' })
  async findBySlug(@Param('slug') slug: string): Promise<BrandWithProductsDto> {
    return await this.brandsService.findBySlug(slug);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Обновить бренд' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID бренда' })
  @ApiResponse({
    status: 200,
    description: 'Бренд обновлен',
    type: BrandResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Бренд не найден' })
  @ApiResponse({
    status: 409,
    description: 'Бренд с таким slug уже существует',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
  ): Promise<BrandResponseDto> {
    return await this.brandsService.update(id, updateBrandDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить бренд' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID бренда' })
  @ApiResponse({ status: 204, description: 'Бренд удален' })
  @ApiResponse({ status: 404, description: 'Бренд не найден' })
  @ApiResponse({ status: 409, description: 'Нельзя удалить бренд с товарами' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.brandsService.remove(id);
  }
}
