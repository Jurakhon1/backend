import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  CategoryResponseDto,
  CategoryWithProductsDto,
} from './dto/category-response.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    // Проверяем уникальность slug
    const existingSlug = await this.categoryRepository.findOne({
      where: { slug: createCategoryDto.slug },
    });

    if (existingSlug) {
      throw new ConflictException('Категория с таким slug уже существует');
    }

    const category = this.categoryRepository.create({
      nameRu: createCategoryDto.nameRu,
      nameEn: createCategoryDto.nameEn,
      slug: createCategoryDto.slug,
      descriptionRu: createCategoryDto.descriptionRu,
      descriptionEn: createCategoryDto.descriptionEn,
      iconUrl: createCategoryDto.iconUrl,
      imageUrl: createCategoryDto.imageUrl,
      isActive: createCategoryDto.isActive ?? true,
      sortOrder: createCategoryDto.sortOrder ?? 0,
      metaTitleRu: createCategoryDto.metaTitleRu,
      metaTitleEn: createCategoryDto.metaTitleEn,
      metaDescriptionRu: createCategoryDto.metaDescriptionRu,
      metaDescriptionEn: createCategoryDto.metaDescriptionEn,
    });

    const savedCategory = await this.categoryRepository.save(category);
    return this.mapToResponseDto(savedCategory);
  }

  async findAll(includeInactive = false): Promise<CategoryWithProductsDto[]> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect(
        'category.products',
        'product',
        'product.is_active = :active',
        { active: true },
      )
      .addSelect('COUNT(product.id)', 'productsCount')
      .groupBy('category.id')
      .orderBy('category.sort_order', 'ASC')
      .addOrderBy('category.nameRu', 'ASC');

    if (!includeInactive) {
      queryBuilder.where('category.is_active = :active', { active: true });
    }

    const categories = await queryBuilder.getRawAndEntities();

    return categories.entities.map((category, index) => ({
      ...this.mapToResponseDto(category),
      productsCount: parseInt(categories.raw[index].productsCount) || 0,
    }));
  }

  async findOne(id: number): Promise<CategoryWithProductsDto> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect(
        'category.products',
        'product',
        'product.is_active = :active',
        { active: true },
      )
      .addSelect('COUNT(product.id)', 'productsCount')
      .where('category.id = :id', { id })
      .groupBy('category.id')
      .getRawAndEntities();

    if (!category.entities.length) {
      throw new NotFoundException('Категория не найдена');
    }

    return {
      ...this.mapToResponseDto(category.entities[0]),
      productsCount: parseInt(category.raw[0].productsCount) || 0,
    };
  }

  async findBySlug(slug: string): Promise<CategoryWithProductsDto> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect(
        'category.products',
        'product',
        'product.is_active = :active',
        { active: true },
      )
      .addSelect('COUNT(product.id)', 'productsCount')
      .where('category.slug = :slug', { slug })
      .groupBy('category.id')
      .getRawAndEntities();

    if (!category.entities.length) {
      throw new NotFoundException('Категория не найдена');
    }

    return {
      ...this.mapToResponseDto(category.entities[0]),
      productsCount: parseInt(category.raw[0].productsCount) || 0,
    };
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    // Проверяем уникальность slug, если он изменяется
    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingSlug = await this.categoryRepository.findOne({
        where: { slug: updateCategoryDto.slug },
      });

      if (existingSlug) {
        throw new ConflictException('Категория с таким slug уже существует');
      }
    }

    Object.assign(category, updateCategoryDto);
    const updatedCategory = await this.categoryRepository.save(category);
    return this.mapToResponseDto(updatedCategory);
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    if (category.products && category.products.length > 0) {
      throw new ConflictException(
        'Нельзя удалить категорию, содержащую товары',
      );
    }

    await this.categoryRepository.remove(category);
  }

  private mapToResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      nameRu: category.nameRu,
      nameEn: category.nameEn,
      slug: category.slug,
      descriptionRu: category.descriptionRu,
      descriptionEn: category.descriptionEn,
      iconUrl: category.iconUrl,
      imageUrl: category.imageUrl,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      metaTitleRu: category.metaTitleRu,
      metaTitleEn: category.metaTitleEn,
      metaDescriptionRu: category.metaDescriptionRu,
      metaDescriptionEn: category.metaDescriptionEn,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  async getCategoryProducts(categoryId: number): Promise<any> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Категория не найдена');
    }

    // Получаем продукты через SQL запрос для лучшей производительности
    const products = await this.categoryRepository.query(
      `
      SELECT 
        p.id,
        p.name_ru,
        p.name_en,
        p.slug,
        p.model,
        p.sku,
        p.base_price,
        p.sale_price,
        p.currency,
        p.description_ru,
        p.description_en,
        p.short_description_ru,
        p.short_description_en,
        p.weight,
        p.dimensions,
        p.warranty_months,
        p.stock_quantity,
        p.min_stock_level,
        p.is_active,
        p.is_featured,
        p.meta_title_ru,
        p.meta_title_en,
        p.meta_description_ru,
        p.meta_description_en,
        p.created_at,
        p.updated_at,
        JSON_OBJECT(
          'id', c.id,
          'name', JSON_OBJECT('ru', c.name_ru, 'en', c.name_en),
          'name_ru', c.name_ru,
          'name_en', c.name_en,
          'slug', c.slug
        ) as category,
        JSON_OBJECT(
          'id', b.id,
          'name', b.name,
          'slug', b.slug
        ) as brand
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.category_id = ? AND p.is_active = true
      ORDER BY p.created_at DESC
    `,
      [categoryId],
    );

    return {
      category: {
        id: category.id,
        nameRu: category.nameRu,
        nameEn: category.nameEn,
        slug: category.slug,
        descriptionRu: category.descriptionRu,
        descriptionEn: category.descriptionEn,
        iconUrl: category.iconUrl,
        imageUrl: category.imageUrl,
        isActive: category.isActive,
        sortOrder: category.sortOrder,
        metaTitleRu: category.metaTitleRu,
        metaTitleEn: category.metaTitleEn,
        metaDescriptionRu: category.metaDescriptionRu,
        metaDescriptionEn: category.metaDescriptionEn,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
      products: products,
      total: products.length,
    };
  }
}
