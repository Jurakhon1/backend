import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import {
  BrandResponseDto,
  BrandWithProductsDto,
} from './dto/brand-response.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto): Promise<BrandResponseDto> {
    // Проверяем уникальность slug
    const existingSlug = await this.brandRepository.findOne({
      where: { slug: createBrandDto.slug },
    });

    if (existingSlug) {
      throw new ConflictException('Бренд с таким slug уже существует');
    }

    const brand = this.brandRepository.create({
      name: createBrandDto.name,
      slug: createBrandDto.slug,
      logoUrl: createBrandDto.logoUrl,
      descriptionRu: createBrandDto.descriptionRu,
      descriptionEn: createBrandDto.descriptionEn,
      websiteUrl: createBrandDto.websiteUrl,
      isActive: createBrandDto.isActive ?? true,
      sortOrder: createBrandDto.sortOrder ?? 0,
      metaTitleRu: createBrandDto.metaTitleRu,
      metaTitleEn: createBrandDto.metaTitleEn,
      metaDescriptionRu: createBrandDto.metaDescriptionRu,
      metaDescriptionEn: createBrandDto.metaDescriptionEn,
    });

    const savedBrand = await this.brandRepository.save(brand);
    return this.mapToResponseDto(savedBrand);
  }

  async findAll(includeInactive = false): Promise<BrandWithProductsDto[]> {
    const queryBuilder = this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect(
        'brand.products',
        'product',
        'product.is_active = :active',
        { active: true },
      )
      .addSelect('COUNT(product.id)', 'productsCount')
      .groupBy('brand.id')
      .orderBy('brand.sort_order', 'ASC')
      .addOrderBy('brand.name', 'ASC');

    if (!includeInactive) {
      queryBuilder.where('brand.is_active = :active', { active: true });
    }

    const brands = await queryBuilder.getRawAndEntities();

    return brands.entities.map((brand, index) => ({
      ...this.mapToResponseDto(brand),
      productsCount: parseInt(brands.raw[index].productsCount) || 0,
    }));
  }

  async findOne(id: number): Promise<BrandWithProductsDto> {
    const brand = await this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect(
        'brand.products',
        'product',
        'product.is_active = :active',
        { active: true },
      )
      .addSelect('COUNT(product.id)', 'productsCount')
      .where('brand.id = :id', { id })
      .groupBy('brand.id')
      .getRawAndEntities();

    if (!brand.entities.length) {
      throw new NotFoundException('Бренд не найден');
    }

    return {
      ...this.mapToResponseDto(brand.entities[0]),
      productsCount: parseInt(brand.raw[0].productsCount) || 0,
    };
  }

  async findBySlug(slug: string): Promise<BrandWithProductsDto> {
    const brand = await this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect(
        'brand.products',
        'product',
        'product.is_active = :active',
        { active: true },
      )
      .addSelect('COUNT(product.id)', 'productsCount')
      .where('brand.slug = :slug', { slug })
      .groupBy('brand.id')
      .getRawAndEntities();

    if (!brand.entities.length) {
      throw new NotFoundException('Бренд не найден');
    }

    return {
      ...this.mapToResponseDto(brand.entities[0]),
      productsCount: parseInt(brand.raw[0].productsCount) || 0,
    };
  }

  async update(
    id: number,
    updateBrandDto: UpdateBrandDto,
  ): Promise<BrandResponseDto> {
    const brand = await this.brandRepository.findOne({ where: { id } });

    if (!brand) {
      throw new NotFoundException('Бренд не найден');
    }

    // Проверяем уникальность slug, если он изменяется
    if (updateBrandDto.slug && updateBrandDto.slug !== brand.slug) {
      const existingSlug = await this.brandRepository.findOne({
        where: { slug: updateBrandDto.slug },
      });

      if (existingSlug) {
        throw new ConflictException('Бренд с таким slug уже существует');
      }
    }

    Object.assign(brand, updateBrandDto);
    const updatedBrand = await this.brandRepository.save(brand);
    return this.mapToResponseDto(updatedBrand);
  }

  async remove(id: number): Promise<void> {
    const brand = await this.brandRepository.findOne({
      where: { id },
      relations: ['products'],
    });

    if (!brand) {
      throw new NotFoundException('Бренд не найден');
    }

    if (brand.products && brand.products.length > 0) {
      throw new ConflictException('Нельзя удалить бренд, содержащий товары');
    }

    await this.brandRepository.remove(brand);
  }

  private mapToResponseDto(brand: Brand): BrandResponseDto {
    return {
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      logoUrl: brand.logoUrl,
      descriptionRu: brand.descriptionRu,
      descriptionEn: brand.descriptionEn,
      websiteUrl: brand.websiteUrl,
      isActive: brand.isActive,
      sortOrder: brand.sortOrder,
      metaTitleRu: brand.metaTitleRu,
      metaTitleEn: brand.metaTitleEn,
      metaDescriptionRu: brand.metaDescriptionRu,
      metaDescriptionEn: brand.metaDescriptionEn,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
    };
  }
}
