import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
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
import { ProductSpecificationResponseDto } from './dto/product-specification.dto';
import { ProductImageResponseDto } from './dto/product-image.dto';
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
import { ProductQuerySimpleDto } from './dto/product-query-simple.dto';
import {
  ProductColorsFastDto,
  ColorFastDto,
} from './dto/product-color-fast.dto';
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
import { ImageService } from '../services/image.service';

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

  async findAll(
    query?: ProductQueryDto,
    lang: 'ru' | 'en' = 'ru',
  ): Promise<ProductResponseDto[]> {
    // Оптимизация: загружаем только базовые relations по умолчанию
    const relations = ['category', 'brand'];

    // Загружаем дополнительные данные только если явно запрошено
    if (query?.includeVariants === true) relations.push('variants');
    if (query?.includeVariantCombinations === true) {
      relations.push('variantCombinations');
      relations.push('variantCombinations.variants');
    }
    if (query?.includeSpecifications === true) relations.push('specifications');
    if (query?.includeImages === true) relations.push('colorImages');

    const products = await this.productsRepository.find({
      relations,
      take: 100, // Ограничиваем количество для производительности
      order: {
        created_at: 'DESC',
      },
    });

    return products.map((product) => this.mapProductToResponse(product, lang));
  }

  async findOne(
    id: number,
    query?: any, // Изменено на any для совместимости
    lang: 'ru' | 'en' = 'ru',
  ): Promise<ProductResponseDto> {
    console.log('🔍 ProductsService.findOne: Запрос продукта', {
      id,
      query,
      includeVariants: query?.includeVariants,
      includeImages: query?.includeImages,
      includeSpecifications: query?.includeSpecifications,
    });

    // Оптимизация: загружаем только базовые relations по умолчанию
    const relations = ['category', 'brand'];

    // Загружаем дополнительные данные только если явно запрошено
    if (query?.includeVariants === true) {
      relations.push('variants');
      console.log('➕ ProductsService.findOne: Добавлены варианты в relations');
    }
    if (query?.includeVariantCombinations === true) {
      relations.push('variantCombinations');
      relations.push('variantCombinations.variants');
    }
    if (query?.includeSpecifications === true) relations.push('specifications');
    if (query?.includeImages === true) relations.push('colorImages');

    console.log(
      '📋 ProductsService.findOne: Relations для загрузки',
      relations,
    );

    const product = await this.productsRepository.findOne({
      where: { id },
      relations,
    });

    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    console.log('📦 ProductsService.findOne: Продукт загружен', {
      id: product.id,
      hasVariants: !!product.variants,
      variantsCount: product.variants?.length || 0,
      hasImages: !!product.colorImages,
      imagesCount: product.colorImages?.length || 0,
      images:
        product.colorImages?.map((img, i) => ({
          index: i,
          id: img.id,
          productId: img.product_id,
          variantId: img.variant_id,
          isPrimary: img.is_active,
          imageUrl: img.primary_image_url,
          thumbnailUrl: img.thumbnail_url,
        })) || [],
      variants:
        product.variants?.map((v) => ({
          id: v.id,
          variantNameRu: v.variantNameRu,
          variantNameEn: v.variantNameEn,
          variantValueRu: v.variantValueRu,
          variantValueEn: v.variantValueEn,
        })) || [],
    });

    return this.mapProductToResponse(product, lang);
  }

  private mapProductToResponse(
    product: any,
    lang: 'ru' | 'en' = 'ru',
  ): ProductResponseDto {
    return new ProductResponseDto({
      ...product,
      name: new LocalizedContentDto({
        ru: product.name_ru,
        en: product.name_en,
      }),
      // Добавляем локализованные поля для удобства
      localized_name: lang === 'ru' ? product.name_ru : product.name_en,
      localized_description:
        lang === 'ru' ? product.description_ru : product.description_en,
      localized_short_description:
        lang === 'ru'
          ? product.short_description_ru
          : product.short_description_en,
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
      category: product.category
        ? {
            id: product.category.id,
            name: new LocalizedContentDto({
              ru: product.category.nameRu,
              en: product.category.nameEn,
            }),
            localized_name:
              lang === 'ru' ? product.category.nameRu : product.category.nameEn,
            name_ru: product.category.nameRu,
            name_en: product.category.nameEn,
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
      variants: product.variants?.map((variant) =>
        this.mapVariantToLocalized(variant, lang),
      ),
      variantCombinations: product.variantCombinations?.map((combination) =>
        this.mapCombinationToResponse(combination),
      ),
      specifications: product.specifications?.map((spec) =>
        this.mapSpecificationToLocalized(spec, lang),
      ),
      images: (() => {
        console.log(
          '🖼️ ProductsService.mapProductToResponse: Обработка изображений',
          {
            productId: product.id,
            hasImages: !!product.colorImages,
            imagesCount: product.colorImages?.length || 0,
            rawImages:
              product.colorImages?.map((img, i) => ({
                index: i,
                id: img.id,
                productId: img.product_id,
                variantId: img.variant_id,
                isPrimary: img.is_active,
                imageUrl: img.primary_image_url,
                thumbnailUrl: img.thumbnail_url,
              })) || [],
          },
        );

        const mappedImages = (product.colorImages || []).map(
          (image) => new ProductImageResponseDto(image),
        );

        console.log(
          '🖼️ ProductsService.mapProductToResponse: Изображения обработаны',
          {
            productId: product.id,
            mappedImagesCount: mappedImages.length,
            mappedImages: mappedImages.map((img, i) => ({
              index: i,
              id: img.id,
              productId: img.product_id,
              variantId: img.variant_id,
              isPrimary: img.is_active,
              imageUrl: img.primary_image_url,
              thumbnailUrl: img.thumbnail_url,
            })),
          },
        );

        return mappedImages;
      })(),
    });
  }

  private mapVariantToLocalized(
    variant: any,
    lang: 'ru' | 'en' = 'ru',
  ): LocalizedVariantDto {
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

  private mapSpecificationToLocalized(
    spec: any,
    lang: 'ru' | 'en' = 'ru',
  ): LocalizedSpecificationDto {
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
    lang: 'ru' | 'en' = 'ru',
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

    return this.mapProductToResponse(product, lang);
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

    // Обрабатываем варианты если они переданы
    if (updateProductDto.variants && Array.isArray(updateProductDto.variants)) {
      console.log('🔄 ProductsService.update: Обработка вариантов', {
        productId: id,
        variantsCount: updateProductDto.variants.length,
        variants: updateProductDto.variants,
      });

      // Удаляем существующие варианты
      await this.variantsRepository.delete({ product: { id } });
      console.log('🗑️ ProductsService.update: Существующие варианты удалены');

      // Создаем новые варианты
      for (const variantData of updateProductDto.variants) {
        // @ts-ignore - временно отключаем проверку типов для всего блока
        console.log('➕ ProductsService.update: Создание варианта', {
          variantData,
          variantNameRu: (variantData as any).variantName?.ru,
          variantNameEn: (variantData as any).variantName?.en,
          variantValueRu: (variantData as any).variantValue?.ru,
          variantValueEn: (variantData as any).variantValue?.en,
        });

        // @ts-ignore - временно отключаем проверку типов для всего блока
        const variant = this.variantsRepository.create({
          product: { id },
          variantNameRu: (variantData as any).variantName?.ru || '',
          variantNameEn: (variantData as any).variantName?.en || '',
          variantType: (variantData as any).variantType,
          variantValueRu: (variantData as any).variantValue?.ru || '',
          variantValueEn: (variantData as any).variantValue?.en || '',
          colorCode: (variantData as any).colorCode,
          priceModifier: (variantData as any).priceModifier || 0,
          stockQuantity: (variantData as any).stockQuantity || 0,
          skuSuffix: (variantData as any).skuSuffix || '',
          isActive: (variantData as any).isActive !== false,
          sortOrder: (variantData as any).sortOrder || 0,
        });

        const savedVariant = await this.variantsRepository.save(variant);
        // @ts-ignore - временно отключаем проверку типов для всего блока
        console.log('✅ ProductsService.update: Вариант сохранен', {
          id: (savedVariant as any).id,
          variantNameRu: (savedVariant as any).variantNameRu,
          variantNameEn: (savedVariant as any).variantNameEn,
          variantValueRu: (savedVariant as any).variantValueRu,
          variantValueEn: (savedVariant as any).variantValueEn,
        });
      }
    }

    // Обрабатываем характеристики если они переданы
    if (
      updateProductDto.specifications &&
      Array.isArray(updateProductDto.specifications)
    ) {
      // Удаляем существующие характеристики
      await this.specificationsRepository.delete({ product: { id } });

      // Создаем новые характеристики
      for (const specData of updateProductDto.specifications) {
        // @ts-ignore - временно отключаем проверку типов для всего блока
        const specification = this.specificationsRepository.create({
          product: { id },
          nameRu: (specData as any).name?.ru || '',
          nameEn: (specData as any).name?.en || '',
          valueRu: (specData as any).value?.ru || '',
          valueEn: (specData as any).value?.en || '',
          sortOrder: (specData as any).sortOrder || 0,
        });
        await this.specificationsRepository.save(specification);
      }
    }

    // Загружаем обновленный продукт с вариантами и характеристиками
    const finalProduct = await this.productsRepository.findOne({
      where: { id },
      relations: ['category', 'brand', 'variants', 'specifications', 'images'],
    });

    return this.mapProductToResponse(finalProduct);
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
    lang: 'ru' | 'en' = 'ru',
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

    return this.mapProductToResponse(product, lang);
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
    const gallery: { [key: string]: string[] } = {};
    colorImages.forEach((img) => {
      if (img.variant_id !== null) {
        gallery[img.variant_id.toString()] = img.gallery_urls || [];
      }
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

  // ===== МЕТОДЫ ДЛЯ УПРАВЛЕНИЯ ЦВЕТОВЫМИ ИЗОБРАЖЕНИЯМИ =====

  // ===== МЕТОДЫ ДЛЯ УПРАВЛЕНИЯ ВАРИАНТАМИ ПРОДУКТОВ (ЦВЕТАМИ) =====

  async createProductVariant(
    productId: number,
    createDto: CreateProductVariantDto,
  ): Promise<ProductVariant> {
    // Проверяем существование продукта
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    // Проверяем, существует ли уже вариант с таким названием
    const existingVariant = await this.variantsRepository.findOne({
      where: {
        product: { id: productId },
        variantNameRu: createDto.name,
      },
    });

    if (existingVariant) {
      throw new ConflictException(
        `Вариант с названием "${createDto.name}" уже существует для данного продукта`,
      );
    }

    const newVariant = this.variantsRepository.create({
      variantNameRu: createDto.name,
      variantNameEn: createDto.name,
      variantType: 'color' as any,
      variantValueRu: createDto.name,
      variantValueEn: createDto.name,
      colorCode: createDto.colorCode,
      priceModifier: createDto.price_adjustment || 0,
      stockQuantity: createDto.stock_quantity || 0,
      isActive: createDto.is_active !== false,
      product: { id: productId },
    });

    return (await this.variantsRepository.save(newVariant)) as any;
  }

  async updateProductVariant(
    variantId: number,
    updateDto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    const variant = await this.variantsRepository.findOne({
      where: { id: variantId },
    });
    if (!variant) {
      throw new NotFoundException('Вариант не найден');
    }

    Object.assign(variant, updateDto);
    return await this.variantsRepository.save(variant);
  }

  async deleteProductVariant(variantId: number): Promise<void> {
    const result = await this.variantsRepository.delete(variantId);
    if (result.affected === 0) {
      throw new NotFoundException('Вариант не найден');
    }
  }

  async getProductVariants(productId: number): Promise<ProductVariant[]> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    return await this.variantsRepository.find({
      where: { product: { id: productId } },
      order: { createdAt: 'ASC' },
    });
  }

  // ===== МЕТОДЫ ДЛЯ РАБОТЫ С BASE64 ИЗОБРАЖЕНИЯМИ =====

  async createProductImageBase64(
    productId: number,
    createDto: CreateProductImageBase64Dto,
  ): Promise<ProductColorImage> {
    // Проверяем существование продукта
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    // Проверяем существование варианта (цвета) только если он указан
    let variant: any = null;
    if (createDto.variant_id) {
      console.log(
        '🔍 ProductsService.createProductImageBase64: Поиск варианта',
        {
          variantId: createDto.variant_id,
          productId: productId,
        },
      );

      variant = await this.variantsRepository.findOne({
        where: { id: createDto.variant_id },
        relations: ['product'],
      });

      console.log(
        '🔍 ProductsService.createProductImageBase64: Найденный вариант',
        {
          variant: variant
            ? {
                id: variant.id,
                hasProduct: !!variant.product,
                productId: variant.product?.id,
              }
            : null,
        },
      );

      if (!variant) {
        throw new NotFoundException('Вариант (цвет) не найден');
      }

      // Проверяем, что вариант принадлежит продукту
      if (!variant.product || variant.product.id !== productId) {
        console.error(
          '❌ ProductsService.createProductImageBase64: Вариант не принадлежит продукту',
          {
            variantId: createDto.variant_id,
            variantProductId: variant.product?.id,
            targetProductId: productId,
          },
        );

        throw new BadRequestException(
          `Вариант с ID ${createDto.variant_id} не принадлежит продукту с ID ${productId}`,
        );
      }
    }

    // Валидируем Base64
    if (!this.imageService.validateBase64(createDto.primary_image_base64)) {
      throw new BadRequestException('Некорректный формат Base64 изображения');
    }

    // Проверяем, существует ли уже изображение для данного варианта
    const whereCondition: any = {
      product_id: productId,
    };

    if (createDto.variant_id) {
      whereCondition.variant_id = createDto.variant_id;
    } else {
      whereCondition.variant_id = null;
    }

    const existingImage = await this.colorImagesRepository.findOne({
      where: whereCondition,
    });

    if (existingImage) {
      throw new ConflictException(
        `Изображение для ${createDto.variant_id ? `варианта ${createDto.variant_id}` : 'базового варианта'} уже существует`,
      );
    }

    // Создаем миниатюру если не предоставлена
    let thumbnailBase64 = createDto.thumbnail_base64;
    if (!thumbnailBase64) {
      thumbnailBase64 = await this.imageService.createThumbnail(
        createDto.primary_image_base64,
      );
    }

    // Функция для добавления префикса data:image если его нет
    const ensureDataPrefix = (base64: string): string => {
      if (!base64) return '';
      if (base64.startsWith('data:image/')) {
        return base64; // Уже есть префикс
      }
      return `data:image/jpeg;base64,${base64}`;
    };

    const newColorImage = this.colorImagesRepository.create({
      product_id: productId,
      variant_id: createDto.variant_id || null,
      primary_image_url: ensureDataPrefix(createDto.primary_image_base64),
      thumbnail_url: ensureDataPrefix(thumbnailBase64),
      gallery_urls: (createDto.gallery_base64 || []).map((base64) =>
        ensureDataPrefix(base64),
      ),
      color_code:
        createDto.color_code || (variant ? variant.colorCode : '#FFFFFF'),
      is_active: createDto.is_active !== false,
    });

    return await this.colorImagesRepository.save(newColorImage);
  }

  async updateProductImageBase64(
    imageId: number,
    updateDto: UpdateProductImageBase64Dto,
  ): Promise<ProductColorImage> {
    const colorImage = await this.colorImagesRepository.findOne({
      where: { id: imageId },
    });
    if (!colorImage) {
      throw new NotFoundException('Изображение не найдено');
    }

    // Валидируем Base64 если предоставлен
    if (
      updateDto.primary_image_base64 &&
      !this.imageService.validateBase64(updateDto.primary_image_base64)
    ) {
      throw new BadRequestException('Некорректный формат Base64 изображения');
    }

    // Обновляем поля
    if (updateDto.primary_image_base64) {
      colorImage.primary_image_url = updateDto.primary_image_base64;
    }
    if (updateDto.thumbnail_base64) {
      colorImage.thumbnail_url = updateDto.thumbnail_base64;
    }
    if (updateDto.gallery_base64) {
      colorImage.gallery_urls = updateDto.gallery_base64;
    }
    if (updateDto.color_code) {
      colorImage.color_code = updateDto.color_code;
    }
    if (updateDto.is_active !== undefined) {
      colorImage.is_active = updateDto.is_active;
    }

    return await this.colorImagesRepository.save(colorImage);
  }

  async uploadFileBase64(
    productId: number,
    variantId: number,
    file: any,
  ): Promise<ProductColorImage> {
    // Проверяем существование продукта
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    // Проверяем существование варианта
    const variant = await this.variantsRepository.findOne({
      where: { id: variantId, product: { id: productId } },
    });
    if (!variant) {
      throw new NotFoundException('Вариант продукта не найден');
    }

    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    // Конвертируем файл в Base64
    const base64String = await this.imageService.convertToBase64(file);

    // Создаем миниатюру
    const thumbnailBase64 =
      await this.imageService.createThumbnail(base64String);

    // Создаем URL для загруженного файла
    const imageUrl = `/uploads/phones/base64/${file.filename}`;
    const thumbnailUrl = `/uploads/phones/base64/${file.filename}`;

    // Ищем существующее изображение для этого варианта
    let colorImage = await this.colorImagesRepository.findOne({
      where: { product_id: productId, variant_id: variantId },
    });

    if (colorImage) {
      // Обновляем существующее изображение
      colorImage.primary_image_url = imageUrl;
      colorImage.thumbnail_url = thumbnailUrl;
    } else {
      // Создаем новое изображение
      colorImage = this.colorImagesRepository.create({
        product_id: productId,
        variant_id: variantId,
        primary_image_url: imageUrl,
        thumbnail_url: thumbnailUrl,
        gallery_urls: [],
        color_code: variant.colorCode || '#FFFFFF',
        is_active: true,
      });
    }

    return await this.colorImagesRepository.save(colorImage);
  }

  async createColorImage(
    productId: number,
    createDto: CreateColorImageDto,
  ): Promise<ProductColorImage> {
    // Проверяем существование продукта
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    // Проверяем существование варианта
    const variant = await this.variantsRepository.findOne({
      where: { id: createDto.variant_id, product: { id: productId } },
    });
    if (!variant) {
      throw new NotFoundException('Вариант продукта не найден');
    }

    // Проверяем, не существует ли уже изображение для этого варианта
    const existingImage = await this.colorImagesRepository.findOne({
      where: { product_id: productId, variant_id: createDto.variant_id },
    });
    if (existingImage) {
      throw new ConflictException('Изображение для этого цвета уже существует');
    }

    const colorImage = this.colorImagesRepository.create({
      product_id: productId,
      variant_id: createDto.variant_id,
      primary_image_url: createDto.primary_image_url,
      thumbnail_url: createDto.thumbnail_url,
      gallery_urls: createDto.gallery_urls || [],
      color_code: createDto.color_code,
      is_active: createDto.is_active ?? true,
    });

    return await this.colorImagesRepository.save(colorImage);
  }

  async updateColorImage(
    imageId: number,
    updateDto: UpdateColorImageDto,
  ): Promise<ProductColorImage> {
    const colorImage = await this.colorImagesRepository.findOne({
      where: { id: imageId },
    });
    if (!colorImage) {
      throw new NotFoundException('Цветовое изображение не найдено');
    }

    Object.assign(colorImage, updateDto);
    return await this.colorImagesRepository.save(colorImage);
  }

  async deleteColorImage(imageId: number): Promise<void> {
    const colorImage = await this.colorImagesRepository.findOne({
      where: { id: imageId },
    });
    if (!colorImage) {
      throw new NotFoundException('Цветовое изображение не найдено');
    }

    await this.colorImagesRepository.remove(colorImage);
  }

  async getColorImagesByProduct(
    productId: number,
  ): Promise<ProductColorImage[]> {
    return await this.colorImagesRepository.find({
      where: { product_id: productId },
      relations: ['variant'],
      order: { created_at: 'DESC' },
    });
  }

  async uploadColorImage(
    productId: number,
    colorId: number,
    file: any,
  ): Promise<ProductColorImage> {
    // Проверяем существование продукта
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Продукт не найден');
    }

    // Проверяем существование варианта
    const variant = await this.variantsRepository.findOne({
      where: { id: colorId, product: { id: productId } },
    });
    if (!variant) {
      throw new NotFoundException('Вариант продукта не найден');
    }

    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    // Создаем URL для загруженного файла
    const imageUrl = `/uploads/phones/${file.filename}`;

    // Создаем миниатюру (пока используем тот же файл)
    const thumbnailUrl = `/uploads/phones/${file.filename}`;

    // Ищем существующее изображение для этого цвета
    let colorImage = await this.colorImagesRepository.findOne({
      where: { product_id: productId, variant_id: colorId },
    });

    if (colorImage) {
      // Обновляем существующее изображение
      colorImage.primary_image_url = imageUrl;
      colorImage.thumbnail_url = thumbnailUrl;
    } else {
      // Создаем новое изображение
      colorImage = this.colorImagesRepository.create({
        product_id: productId,
        variant_id: colorId,
        primary_image_url: imageUrl,
        thumbnail_url: thumbnailUrl,
        gallery_urls: [],
        color_code: variant.colorCode || '#FFFFFF',
        is_active: true,
      });
    }

    return await this.colorImagesRepository.save(colorImage);
  }
}
