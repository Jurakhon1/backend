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
  UsePipes,
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
import { ProductQuerySimpleDto } from './dto/product-query-simple.dto';
import { ProductColorsFastDto } from './dto/product-color-fast.dto';
import { LanguageQueryDto } from './dto/language-query.dto';
import {
  CreateColorImageDto,
  UpdateColorImageDto,
  ColorImageResponseDto,
} from './dto/product-color-image.dto';
import {
  CreateProductImageBase64Dto,
  UpdateProductImageBase64Dto,
  ProductImageBase64ResponseDto,
} from './dto/product-image-base64.dto';
import {
  CreateProductVariantDto,
  UpdateProductVariantDto,
  ProductVariantResponseDto,
} from './dto/product-variant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import {
  productImageUploadConfig,
  base64ImageUploadConfig,
} from '../config/upload.config';

@ApiTags('products')
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
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
    return await this.productsService.findAll(query, query.lang || 'ru');
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
    @Query('includeVariants') includeVariants?: string,
    @Query('includeImages') includeImages?: string,
    @Query('includeSpecifications') includeSpecifications?: string,
    @Query('includeVariantCombinations') includeVariantCombinations?: string,
    @Query('lang') lang?: string,
  ): Promise<ProductResponseDto> {
    const query = {
      includeVariants: includeVariants === 'true',
      includeImages: includeImages === 'true',
      includeSpecifications: includeSpecifications === 'true',
      includeVariantCombinations: includeVariantCombinations === 'true',
    };
    return await this.productsService.findOne(
      id,
      query,
      (lang as 'ru' | 'en') || 'ru',
    );
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
    @Query() langQuery: LanguageQueryDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.findBySlug(slug, query, langQuery.lang);
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
    @Query() langQuery: LanguageQueryDto,
  ): Promise<ProductResponseDto> {
    return await this.productsService.updateStock(
      id,
      quantity,
      undefined,
      langQuery.lang,
    );
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

  // ===== ENDPOINTS ДЛЯ УПРАВЛЕНИЯ ЦВЕТОВЫМИ ИЗОБРАЖЕНИЯМИ =====

  @Post(':id/color-images')
  @Public()
  @ApiOperation({ summary: 'Создать цветовое изображение' })
  @ApiResponse({
    status: 201,
    description: 'Цветовое изображение создано',
    type: ColorImageResponseDto,
  })
  async createColorImage(
    @Param('id', ParseIntPipe) productId: number,
    @Body() createDto: CreateColorImageDto,
  ): Promise<ColorImageResponseDto> {
    return await this.productsService.createColorImage(productId, createDto);
  }

  @Get(':id/color-images')
  @Public()
  @ApiOperation({ summary: 'Получить все цветовые изображения продукта' })
  @ApiResponse({
    status: 200,
    description: 'Список цветовых изображений',
    type: [ColorImageResponseDto],
  })
  async getColorImagesByProduct(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<ColorImageResponseDto[]> {
    return await this.productsService.getColorImagesByProduct(productId);
  }

  @Put('color-images/:imageId')
  @ApiOperation({ summary: 'Обновить цветовое изображение' })
  @ApiResponse({
    status: 200,
    description: 'Цветовое изображение обновлено',
    type: ColorImageResponseDto,
  })
  async updateColorImage(
    @Param('imageId', ParseIntPipe) imageId: number,
    @Body() updateDto: UpdateColorImageDto,
  ): Promise<ColorImageResponseDto> {
    return await this.productsService.updateColorImage(imageId, updateDto);
  }

  @Delete('color-images/:imageId')
  @ApiOperation({ summary: 'Удалить цветовое изображение' })
  @ApiResponse({
    status: 204,
    description: 'Цветовое изображение удалено',
  })
  async deleteColorImage(
    @Param('imageId', ParseIntPipe) imageId: number,
  ): Promise<void> {
    return await this.productsService.deleteColorImage(imageId);
  }

  @Post(':id/color-images/upload')
  @UseInterceptors(FileInterceptor('file', productImageUploadConfig))
  @ApiOperation({ summary: 'Загрузить файл цветового изображения' })
  @ApiResponse({
    status: 201,
    description: 'Файл загружен',
    type: ColorImageResponseDto,
  })
  async uploadColorImage(
    @Param('id', ParseIntPipe) productId: number,
    @Query('colorId', ParseIntPipe) colorId: number,
    @UploadedFile() file: any,
  ): Promise<ColorImageResponseDto> {
    return await this.productsService.uploadColorImage(
      productId,
      colorId,
      file,
    );
  }

  // ===== ENDPOINTS ДЛЯ УПРАВЛЕНИЯ ВАРИАНТАМИ ПРОДУКТОВ (ЦВЕТАМИ) =====

  @Post(':id/variants')
  @Public()
  @ApiOperation({ summary: 'Создать вариант продукта (цвет)' })
  @ApiResponse({
    status: 201,
    description: 'Вариант создан',
    type: ProductVariantResponseDto,
  })
  async createProductVariant(
    @Param('id', ParseIntPipe) productId: number,
    @Body() createDto: CreateProductVariantDto,
  ): Promise<any> {
    return await this.productsService.createProductVariant(
      productId,
      createDto,
    );
  }

  @Get(':id/variants')
  @Public()
  @ApiOperation({ summary: 'Получить все варианты продукта' })
  @ApiResponse({
    status: 200,
    description: 'Список вариантов',
    type: [ProductVariantResponseDto],
  })
  async getProductVariants(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<any[]> {
    return await this.productsService.getProductVariants(productId);
  }

  @Put('variants/:variantId')
  @ApiOperation({ summary: 'Обновить вариант продукта' })
  @ApiResponse({
    status: 200,
    description: 'Вариант обновлен',
    type: ProductVariantResponseDto,
  })
  async updateProductVariant(
    @Param('variantId', ParseIntPipe) variantId: number,
    @Body() updateDto: UpdateProductVariantDto,
  ): Promise<any> {
    return await this.productsService.updateProductVariant(
      variantId,
      updateDto,
    );
  }

  @Delete('variants/:variantId')
  @ApiOperation({ summary: 'Удалить вариант продукта' })
  @ApiResponse({
    status: 204,
    description: 'Вариант удален',
  })
  async deleteProductVariant(
    @Param('variantId', ParseIntPipe) variantId: number,
  ): Promise<void> {
    return await this.productsService.deleteProductVariant(variantId);
  }

  // ===== ENDPOINTS ДЛЯ РАБОТЫ С BASE64 ИЗОБРАЖЕНИЯМИ =====

  @Post(':id/images/base64')
  @Public()
  @ApiOperation({ summary: 'Создать изображение продукта в Base64' })
  @ApiResponse({
    status: 201,
    description: 'Изображение создано',
    type: ProductImageBase64ResponseDto,
  })
  async createProductImageBase64(
    @Param('id', ParseIntPipe) productId: number,
    @Body() createDto: CreateProductImageBase64Dto,
  ): Promise<any> {
    return await this.productsService.createProductImageBase64(
      productId,
      createDto,
    );
  }

  @Put('images/base64/:imageId')
  @ApiOperation({ summary: 'Обновить изображение продукта в Base64' })
  @ApiResponse({
    status: 200,
    description: 'Изображение обновлено',
    type: ProductImageBase64ResponseDto,
  })
  async updateProductImageBase64(
    @Param('imageId', ParseIntPipe) imageId: number,
    @Body() updateDto: UpdateProductImageBase64Dto,
  ): Promise<any> {
    return await this.productsService.updateProductImageBase64(
      imageId,
      updateDto,
    );
  }

  @Post(':id/images/base64/upload')
  @UseInterceptors(FileInterceptor('file', base64ImageUploadConfig))
  @ApiOperation({ summary: 'Загрузить файл и конвертировать в Base64' })
  @ApiResponse({
    status: 201,
    description: 'Файл загружен и конвертирован',
    type: ProductImageBase64ResponseDto,
  })
  async uploadFileBase64(
    @Param('id', ParseIntPipe) productId: number,
    @Query('variantId', ParseIntPipe) variantId: number,
    @UploadedFile() file: any,
  ): Promise<any> {
    return await this.productsService.uploadFileBase64(
      productId,
      variantId,
      file,
    );
  }
}
