import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { ProductSpecification } from '../entities/product-specification.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Brand)
    private brandsRepository: Repository<Brand>,
    @InjectRepository(ProductVariant)
    private variantsRepository: Repository<ProductVariant>,
    @InjectRepository(ProductSpecification)
    private specificationsRepository: Repository<ProductSpecification>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    // Проверяем существование slug
    const existingProduct = await this.productsRepository.findOne({
      where: { slug: createProductDto.slug },
    });
    if (existingProduct) {
      throw new ConflictException('Продукт с таким slug уже существует');
    }

    // Проверяем существование категории
    const category = await this.categoriesRepository.findOne({
      where: { id: createProductDto.category_id },
    });
    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    // Проверяем существование бренда
    const brand = await this.brandsRepository.findOne({
      where: { id: createProductDto.brand_id },
    });
    if (!brand) {
      throw new NotFoundException('Бренд не найден');
    }

    const product = this.productsRepository.create({
      ...createProductDto,
      category,
      brand,
    });

    const savedProduct = await this.productsRepository.save(product);
    return this.mapToResponseDto(savedProduct);
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productsRepository.find({
      relations: ['category', 'brand', 'images'],
    });

    return products.map((product) => this.mapToResponseDto(product));
  }

  // Добавляем метод для поиска с фильтрацией
  async findWithFilters(filters: {
    categoryId?: number;
    query?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<ProductResponseDto[]> {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.is_active = :isActive', { isActive: true });

    if (filters.categoryId) {
      queryBuilder.andWhere('product.category_id = :categoryId', {
        categoryId: filters.categoryId,
      });
    }

    if (filters.query) {
      queryBuilder.andWhere(
        '(product.name_ru LIKE :query OR product.name_en LIKE :query OR product.description_ru LIKE :query OR product.description_en LIKE :query)',
        { query: `%${filters.query}%` },
      );
    }

    if (filters.minPrice) {
      queryBuilder.andWhere('product.base_price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters.maxPrice) {
      queryBuilder.andWhere('product.base_price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    const products = await queryBuilder.getMany();
    return products.map((product) => this.mapToResponseDto(product));
  }

  // Добавляем метод для маппинга в ResponseDto
  private mapToResponseDto(product: Product): ProductResponseDto {
    return new ProductResponseDto({
      id: product.id,
      nameRu: product.name_ru,
      nameEn: product.name_en,
      slug: product.slug,
      descriptionRu: product.description_ru,
      descriptionEn: product.description_en,
      basePrice: product.base_price,
      discountPrice: product.discount_price,
      stockQuantity: product.stock_quantity,
      sku: product.sku,
      barcode: product.sku, // Using SKU as barcode for now
      weight: product.weight,
      rating: product.rating,
      reviewCount: product.review_count,
      isActive: product.is_active,
      isFeatured: product.is_featured,
      categoryId: product.category_id,
      brandId: product.brand_id,
      category: product.category
        ? {
            id: product.category.id,
            nameRu: product.category.nameRu,
            nameEn: product.category.nameEn,
            slug: product.category.slug,
          }
        : undefined,
      brand: product.brand
        ? {
            id: product.brand.id,
            name: product.brand.name,
            slug: product.brand.slug,
          }
        : undefined,
      images: product.images?.map((img) => ({
        id: img.id,
        imageUrl: img.imageUrl,
        altText: img.altTextRu,
        sortOrder: img.sortOrder,
        isPrimary: img.isPrimary,
      })),
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    });
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'brand', 'images', 'variants', 'specifications'],
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    return this.mapToResponseDto(product);
  }

  async findBySlug(slug: string): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOne({
      where: { slug },
      relations: ['category', 'brand', 'images'],
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    return this.mapToResponseDto(product);
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'brand'],
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    // Проверяем уникальность slug при обновлении
    if (
      'slug' in updateProductDto &&
      updateProductDto.slug &&
      updateProductDto.slug !== product.slug
    ) {
      const existingProduct = await this.productsRepository.findOne({
        where: { slug: updateProductDto.slug },
      });
      if (existingProduct) {
        throw new ConflictException('Продукт с таким slug уже существует');
      }
    }

    // Обновляем категорию если указана
    if ('category_id' in updateProductDto && updateProductDto.category_id) {
      const category = await this.categoriesRepository.findOne({
        where: { id: updateProductDto.category_id },
      });
      if (!category) {
        throw new NotFoundException('Категория не найдена');
      }
      product.category = category;
    }

    // Обновляем бренд если указан
    if ('brand_id' in updateProductDto && updateProductDto.brand_id) {
      const brand = await this.brandsRepository.findOne({
        where: { id: updateProductDto.brand_id },
      });
      if (!brand) {
        throw new NotFoundException('Бренд не найден');
      }
      product.brand = brand;
    }

    // Обновляем остальные поля
    Object.assign(product, updateProductDto);

    const updatedProduct = await this.productsRepository.save(product);
    return this.mapToResponseDto(updatedProduct);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Продукт не найден');
    }
  }

  async updateStock(id: number, quantity: number): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'brand'],
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    product.stock_quantity = quantity;
    const updatedProduct = await this.productsRepository.save(product);
    return this.mapToResponseDto(updatedProduct);
  }
}
