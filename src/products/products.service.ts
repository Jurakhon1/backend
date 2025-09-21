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
    return new ProductResponseDto({
      ...savedProduct,
      category: {
        id: category.id,
        name_ru: category.nameRu,
        name_en: category.nameEn,
        slug: category.slug,
      },
      brand: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
      },
    });
  }

  async findAll(): Promise<ProductResponseDto[]> {
    const products = await this.productsRepository.find({
      relations: ['category', 'brand'],
    });

    return products.map(
      (product) =>
        new ProductResponseDto({
          ...product,
          category: {
            id: product.category.id,
            name_ru: product.category.nameRu,
            name_en: product.category.nameEn,
            slug: product.category.slug,
          },
          brand: {
            id: product.brand.id,
            name: product.brand.name,
            slug: product.brand.slug,
          },
        }),
    );
  }

  async findOne(id: number): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'brand', 'variants', 'specifications'],
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    return new ProductResponseDto({
      ...product,
      category: {
        id: product.category.id,
        name_ru: product.category.nameRu,
        name_en: product.category.nameEn,
        slug: product.category.slug,
      },
      brand: {
        id: product.brand.id,
        name: product.brand.name,
        slug: product.brand.slug,
      },
      variants: product.variants || [],
      specifications: product.specifications || [],
    });
  }

  async findBySlug(slug: string): Promise<ProductResponseDto> {
    const product = await this.productsRepository.findOne({
      where: { slug },
      relations: ['category', 'brand'],
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    return new ProductResponseDto({
      ...product,
      category: {
        id: product.category.id,
        name_ru: product.category.nameRu,
        name_en: product.category.nameEn,
        slug: product.category.slug,
      },
      brand: {
        id: product.brand.id,
        name: product.brand.name,
        slug: product.brand.slug,
      },
    });
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

    return new ProductResponseDto({
      ...updatedProduct,
      category: {
        id: updatedProduct.category.id,
        name_ru: updatedProduct.category.nameRu,
        name_en: updatedProduct.category.nameEn,
        slug: updatedProduct.category.slug,
      },
      brand: {
        id: updatedProduct.brand.id,
        name: updatedProduct.brand.name,
        slug: updatedProduct.brand.slug,
      },
    });
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

    return new ProductResponseDto({
      ...updatedProduct,
      category: {
        id: updatedProduct.category.id,
        name_ru: updatedProduct.category.nameRu,
        name_en: updatedProduct.category.nameEn,
        slug: updatedProduct.category.slug,
      },
      brand: {
        id: updatedProduct.brand.id,
        name: updatedProduct.brand.name,
        slug: updatedProduct.brand.slug,
      },
    });
  }
}
