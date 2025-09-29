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
import { ProductImage } from '../entities/product-image.entity';
import { ProductVariantCombination } from '../entities/product-variant-combination.entity';
import { ProductColorImage } from '../entities/product-color-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProductVariantResponseDto } from './dto/product-variant.dto';
import { ProductSpecificationResponseDto } from './dto/product-specification.dto';
import { ProductImageResponseDto } from './dto/product-image.dto';
import { ImageService } from '../shared/image.service';
import {
  LocalizedVariantDto,
  LocalizedSpecificationDto,
  LocalizedContentDto,
} from './dto/product-response.dto';
import {
  ProductVariantCombinationDto,
  VariantOptionDto,
} from './dto/product-variant-combination.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import {
  ProductColorsFastDto,
  ColorFastDto,
} from './dto/product-color-fast.dto';

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
    @InjectRepository(ProductImage)
    private imagesRepository: Repository<ProductImage>,
    @InjectRepository(ProductVariantCombination)
    private combinationsRepository: Repository<ProductVariantCombination>,

    private imageService: ImageService,

    @InjectRepository(ProductColorImage)
    private colorImagesRepository: Repository<ProductColorImage>,

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

    // Проверяем существование SKU
    const existingSku = await this.productsRepository.findOne({
      where: { sku: createProductDto.sku },
    });
    if (existingSku) {
      throw new ConflictException('Продукт с таким SKU уже существует');
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

    // Создаем продукт
    const { variants, specifications, images, ...productData } =
      createProductDto;
    const product = this.productsRepository.create({
      ...productData,
      category,
      brand,
    });

    const savedProduct = await this.productsRepository.save(product);

    // Создаем варианты
    if (variants && variants.length > 0) {
      const variantEntities = variants.map((variantData) =>
        this.variantsRepository.create({
          ...variantData,
          product: savedProduct,
        }),
      );
      await this.variantsRepository.save(variantEntities);
    }

    // Создаем характеристики
    if (specifications && specifications.length > 0) {
      const specEntities = specifications.map((specData) =>
        this.specificationsRepository.create({
          ...specData,
          product: savedProduct,
        }),
      );
      await this.specificationsRepository.save(specEntities);
    }

    // Создаем изображения
    if (images && images.length > 0) {
      const imageEntities = images.map((imageData) =>
        this.imagesRepository.create({
          ...imageData,
          product: savedProduct,
        }),
      );
      await this.imagesRepository.save(imageEntities);
    }

    // Возвращаем полный продукт с связанными данными
    return await this.findOne(savedProduct.id);
  }

  async findAll(query?: ProductQueryDto): Promise<ProductResponseDto[]> {
    const relations = ['category', 'brand'];

    if (query?.includeVariants !== false) relations.push('variants');
    if (query?.includeVariantCombinations === true) {
      relations.push('variantCombinations');
      relations.push('variantCombinations.variants');
    }
    if (query?.includeSpecifications !== false)
      relations.push('specifications');
    if (query?.includeImages !== false) relations.push('images');

    const products = await this.productsRepository.find({
      relations,
    });

    return products.map((product) => this.mapProductToResponse(product));
  }

  async findOne(
    id: number,
    query?: ProductQueryDto,
  ): Promise<ProductResponseDto> {
    const relations = ['category', 'brand'];

    if (query?.includeVariants !== false) relations.push('variants');
    if (query?.includeVariantCombinations === true) {
      relations.push('variantCombinations');
      relations.push('variantCombinations.variants');
    }
    if (query?.includeSpecifications !== false)
      relations.push('specifications');
    if (query?.includeImages !== false) relations.push('images');

    const product = await this.productsRepository.findOne({
      where: { id },
      relations,
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    return this.mapProductToResponse(product);
  }

  private mapProductToResponse(product: any): ProductResponseDto {
    return new ProductResponseDto({
      ...product,
      name: new LocalizedContentDto({
        ru: product.name_ru,
        en: product.name_en,
      }),
      description:
        product.description_ru || product.description_en
          ? new LocalizedContentDto({
              ru: product.description_ru,
              en: product.description_en,
            })
          : undefined,
      short_description:
        product.short_description_ru || product.short_description_en
          ? new LocalizedContentDto({
              ru: product.short_description_ru,
              en: product.short_description_en,
            })
          : undefined,
      category: {
        id: product.category.id,
        name: new LocalizedContentDto({
          ru: product.category.nameRu,
          en: product.category.nameEn,
        }),
        name_ru: product.category.nameRu,
        name_en: product.category.nameEn,
        slug: product.category.slug,
      },
      brand: {
        id: product.brand.id,
        name: product.brand.name,
        slug: product.brand.slug,
      },
      variants: product.variants?.map((variant) =>
        this.mapVariantToLocalized(variant),
      ),
      variantCombinations: product.variantCombinations?.map((combination) =>
        this.mapCombinationToResponse(combination),
      ),
      specifications: product.specifications?.map((spec) =>
        this.mapSpecificationToLocalized(spec),
      ),
      images: this.imageService.processProductImages(product.images || []).map(
        (image) => new ProductImageResponseDto(image),
      ),
    });
  }

  private mapVariantToLocalized(variant: any): LocalizedVariantDto {
    return new LocalizedVariantDto({
      ...variant,
      variantName: new LocalizedContentDto({
        ru: variant.variantNameRu,
        en: variant.variantNameEn,
      }),
      variantValue: new LocalizedContentDto({
        ru: variant.variantValueRu,
        en: variant.variantValueEn,
      }),
    });
  }

  private mapSpecificationToLocalized(spec: any): LocalizedSpecificationDto {
    return new LocalizedSpecificationDto({
      ...spec,
      specName: new LocalizedContentDto({
        ru: spec.specNameRu,
        en: spec.specNameEn,
      }),
      specValue: new LocalizedContentDto({
        ru: spec.specValueRu,
        en: spec.specValueEn,
      }),
    });
  }

  private mapCombinationToResponse(
    combination: any,
  ): ProductVariantCombinationDto {
    return new ProductVariantCombinationDto({
      ...combination,
      options: combination.variants?.map(
        (variant: any) =>
          new VariantOptionDto({
            id: variant.id,
            name: new LocalizedContentDto({
              ru: variant.variantNameRu,
              en: variant.variantNameEn,
            }),
            value: new LocalizedContentDto({
              ru: variant.variantValueRu,
              en: variant.variantValueEn,
            }),
            colorCode: variant.colorCode,
            variantType: variant.variantType,
            sortOrder: variant.sortOrder,
          }),
      ),
    });
  }

  async findBySlug(
    slug: string,
    query?: ProductQueryDto,
  ): Promise<ProductResponseDto> {
    const relations = ['category', 'brand'];

    if (query?.includeVariants !== false) relations.push('variants');
    if (query?.includeVariantCombinations === true) {
      relations.push('variantCombinations');
      relations.push('variantCombinations.variants');
    }
    if (query?.includeSpecifications !== false)
      relations.push('specifications');
    if (query?.includeImages !== false) relations.push('images');

    const product = await this.productsRepository.findOne({
      where: { slug },
      relations,
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    return this.mapProductToResponse(product);
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

    return this.mapProductToResponse(updatedProduct);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Продукт не найден');
    }
  }

  async updateStock(
    id: number,
    quantity: number,
    query?: ProductQueryDto,
  ): Promise<ProductResponseDto> {
    const relations = ['category', 'brand'];

    if (query?.includeVariants !== false) relations.push('variants');
    if (query?.includeVariantCombinations === true) {
      relations.push('variantCombinations');
      relations.push('variantCombinations.variants');
    }
    if (query?.includeSpecifications !== false)
      relations.push('specifications');
    if (query?.includeImages !== false) relations.push('images');

    const product = await this.productsRepository.findOne({
      where: { id },
      relations,
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    product.stock_quantity = quantity;
    await this.productsRepository.save(product);

    return this.mapProductToResponse(product);
  }

  async getProductColorsFast(productId: number): Promise<ProductColorsFastDto> {
    // Получаем продукт с вариантами цветов
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['variants'],
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    // Фильтруем только варианты цветов
    const colorVariants = product.variants.filter(
      (v) => v.variantType === 'color',
    );

    if (colorVariants.length === 0) {
      return new ProductColorsFastDto({
        id: product.id,
        name: new LocalizedContentDto({
          ru: product.name_ru,
          en: product.name_en,
        }),
        price: product.base_price,
        colors: [],
        currentColor: 0,
        gallery: {},
      });
    }

    // Получаем изображения для каждого цвета
    const colorImages = await this.colorImagesRepository.find({
      where: {
        product_id: productId,
        is_active: true,
      },
      relations: ['variant'],
    });

    // Создаем маппинг variant_id -> images
    const imagesMap = new Map();
    colorImages.forEach((img) => {
      imagesMap.set(img.variant_id, img);
    });

    // Формируем ответ
    const colors = colorVariants.map((variant) => {
      const images = imagesMap.get(variant.id);
      return new ColorFastDto({
        id: variant.id,
        name: new LocalizedContentDto({
          ru: variant.variantValueRu,
          en: variant.variantValueEn,
        }),
        code: images?.color_code || '#000000',
        primaryImage: images?.primary_image_url || '',
        thumbnail: images?.thumbnail_url,
        imageCount: images?.gallery_urls?.length || 0,
      });
    });

    // Создаем галерею
    const gallery = {};
    colorImages.forEach((img) => {
      gallery[img.variant_id] = img.gallery_urls || [];
    });

    return new ProductColorsFastDto({
      id: product.id,
      name: new LocalizedContentDto({
        ru: product.name_ru,
        en: product.name_en,
      }),
      price: product.base_price,
      colors,
      currentColor: colors[0]?.id || 0,
      gallery,
    });
  }

  async getColorImages(productId: number, colorId: number): Promise<any> {
    const result = await this.colorImagesRepository.findOne({
      where: {
        product_id: productId,
        variant_id: colorId,
        is_active: true,
      },
      relations: ['variant'],
    });

    if (!result) {
      throw new NotFoundException('Изображения для этого цвета не найдены');
    }

    return {
      colorId: result.variant_id,
      primaryImage: result.primary_image_url,
      gallery: result.gallery_urls || [],
      colorCode: result.color_code,
    };
  }
}
