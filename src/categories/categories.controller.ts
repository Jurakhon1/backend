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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CategoryResponseDto,
  CategoryWithProductsDto,
} from './dto/category-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новую категорию' })
  @ApiResponse({
    status: 201,
    description: 'Категория создана',
    type: CategoryResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Категория с таким slug уже существует',
  })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Получить список всех категорий' })
  @ApiQuery({
    name: 'includeInactive',
    required: false,
    type: Boolean,
    description: 'Включить неактивные категории',
  })
  @ApiResponse({
    status: 200,
    description: 'Список категорий',
    type: [CategoryWithProductsDto],
  })
  async findAll(
    @Query('includeInactive') includeInactive?: boolean,
  ): Promise<CategoryWithProductsDto[]> {
    return await this.categoriesService.findAll(includeInactive);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Получить категорию по ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID категории' })
  @ApiResponse({
    status: 200,
    description: 'Информация о категории',
    type: CategoryWithProductsDto,
  })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CategoryWithProductsDto> {
    return await this.categoriesService.findOne(id);
  }

  @Get('slug/:slug')
  @Public()
  @ApiOperation({ summary: 'Получить категорию по slug' })
  @ApiParam({ name: 'slug', type: 'string', description: 'Slug категории' })
  @ApiResponse({
    status: 200,
    description: 'Информация о категории',
    type: CategoryWithProductsDto,
  })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  async findBySlug(
    @Param('slug') slug: string,
  ): Promise<CategoryWithProductsDto> {
    return await this.categoriesService.findBySlug(slug);
  }

  @Get(':id/products')
  @Public()
  @ApiOperation({ summary: 'Получить продукты категории' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID категории' })
  @ApiResponse({
    status: 200,
    description: 'Список продуктов категории',
  })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  async getCategoryProducts(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    return await this.categoriesService.getCategoryProducts(id);
  }

  @Patch(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Обновить категорию' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID категории' })
  @ApiResponse({
    status: 200,
    description: 'Категория обновлена',
    type: CategoryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @ApiResponse({
    status: 409,
    description: 'Категория с таким slug уже существует',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить категорию' })
  @ApiParam({ name: 'id', type: 'number', description: 'ID категории' })
  @ApiResponse({ status: 204, description: 'Категория удалена' })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @ApiResponse({
    status: 409,
    description: 'Нельзя удалить категорию с товарами',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.categoriesService.remove(id);
  }
}
