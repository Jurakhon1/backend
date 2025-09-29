import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { ProductColorsFastDto } from './dto/product-color-fast.dto';

@ApiTags('products')
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Получить все продукты' })
  @ApiResponse({
    status: 200,
    description: 'Список продуктов',
    type: [ProductResponseDto],
  })
  async findAll(
    @Query() query: ProductQueryDto,
  ): Promise<ProductResponseDto[]> {
    return await this.productsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Получить продукт по ID' })
  @ApiResponse({
    status: 200,
    description: 'Продукт найден',
    type: ProductResponseDto,
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ProductQueryDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.findOne(id, query);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Получить продукт по слагу' })
  @ApiResponse({
    status: 200,
    description: 'Продукт найден',
    type: ProductResponseDto,
  })
  async findBySlug(
    @Param('slug') slug: string,
    @Query() query: ProductQueryDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.findBySlug(slug, query);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.productsService.remove(id);
  }

  @Put(':id/stock')
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body('quantity', ParseIntPipe) quantity: number,
  ): Promise<ProductResponseDto> {
    return await this.productsService.updateStock(id, quantity);
  }

  @Public()
  @Get(':id/colors-fast')
  @ApiOperation({ summary: 'Быстрое получение цветов с изображениями' })
  @ApiResponse({
    status: 200,
    description: 'Цвета продукта с изображениями',
    type: ProductColorsFastDto,
  })
  async getColorsFast(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProductColorsFastDto> {
    return await this.productsService.getProductColorsFast(id);
  }

  @Public()
  @Get(':id/color/:colorId/images')
  @ApiOperation({ summary: 'Получить изображения конкретного цвета' })
  @ApiResponse({
    status: 200,
    description: 'Изображения цвета продукта',
  })
  async getColorImages(
    @Param('id', ParseIntPipe) productId: number,
    @Param('colorId', ParseIntPipe) colorId: number,
  ): Promise<any> {
    return await this.productsService.getColorImages(productId, colorId);
  }
}
