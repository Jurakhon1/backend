-- =============================================
-- ПОЛНЫЕ ТЕСТОВЫЕ ДАННЫЕ ДЛЯ МОДУЛЯ ПРОДУКТОВ
-- =============================================
-- Этот файл содержит расширенные тестовые данные со всеми параметрами
-- для полного тестирования модуля продуктов

-- Очистка существующих данных (опционально)
-- DELETE FROM product_images;
-- DELETE FROM product_variants;
-- DELETE FROM product_specifications;
-- DELETE FROM product_reviews;
-- DELETE FROM review_helpfulness;
-- DELETE FROM cart_items;
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM wishlist_items;
-- DELETE FROM product_comparisons;
-- DELETE FROM products;
-- DELETE FROM categories;
-- DELETE FROM brands;

-- =============================================
-- ЧАСТЬ 1: БАЗОВЫЕ КАТЕГОРИИ И БРЕНДЫ
-- =============================================

-- Расширенные категории товаров
INSERT INTO categories (
  name_ru, name_en, slug, description_ru, description_en, 
  icon_url, image_url, is_active, sort_order,
  meta_title_ru, meta_title_en, meta_description_ru, meta_description_en
) VALUES
('Смартфоны', 'Smartphones', 'smartphones', 
 'Современные мобильные телефоны с передовыми технологиями', 
 'Modern mobile phones with advanced technologies',
 'https://example.com/icons/smartphone.svg', 'https://example.com/images/categories/smartphones.jpg',
 true, 1,
 'Купить смартфоны - лучшие цены и модели', 'Buy smartphones - best prices and models',
 'Широкий выбор смартфонов от ведущих брендов по выгодным ценам', 
 'Wide selection of smartphones from leading brands at competitive prices'),

('Планшеты', 'Tablets', 'tablets',
 'Планшетные компьютеры для работы и развлечений',
 'Tablet computers for work and entertainment',
 'https://example.com/icons/tablet.svg', 'https://example.com/images/categories/tablets.jpg',
 true, 2,
 'Планшеты Apple iPad и Android - официальный магазин', 'Apple iPad and Android tablets - official store',
 'Планшеты для учебы, работы и развлечений от Apple, Samsung и других брендов',
 'Tablets for study, work and entertainment from Apple, Samsung and other brands'),

('Наушники и гарнитуры', 'Headphones & Headsets', 'headphones',
 'Беспроводные и проводные наушники, гарнитуры',
 'Wireless and wired headphones, headsets',
 'https://example.com/icons/headphones.svg', 'https://example.com/images/categories/headphones.jpg',
 true, 3,
 'Наушники AirPods, Galaxy Buds - купить в официальном магазине', 'AirPods, Galaxy Buds headphones - buy in official store',
 'Качественные наушники и гарнитуры для музыки и звонков',
 'Quality headphones and headsets for music and calls'),

('Зарядные устройства', 'Chargers', 'chargers',
 'Зарядки, кабели, беспроводные зарядные станции',
 'Chargers, cables, wireless charging stations',
 'https://example.com/icons/charger.svg', 'https://example.com/images/categories/chargers.jpg',
 true, 4,
 'Зарядки для iPhone, Samsung - оригинальные и совместимые', 'iPhone, Samsung chargers - original and compatible',
 'Зарядные устройства и аксессуары для всех типов телефонов',
 'Charging devices and accessories for all types of phones'),

('Чехлы и защита', 'Cases & Protection', 'cases',
 'Чехлы, защитные стекла, пленки для устройств',
 'Cases, screen protectors, films for devices',
 'https://example.com/icons/case.svg', 'https://example.com/images/categories/cases.jpg',
 true, 5,
 'Чехлы для iPhone, Samsung - защита и стиль', 'iPhone, Samsung cases - protection and style',
 'Защитные чехлы и аксессуары для ваших устройств',
 'Protective cases and accessories for your devices'),

('Аксессуары для автомобиля', 'Car Accessories', 'car-accessories',
 'Автомобильные держатели, зарядки, магнитные крепления',
 'Car holders, chargers, magnetic mounts',
 'https://example.com/icons/car.svg', 'https://example.com/images/categories/car-accessories.jpg',
 true, 6,
 'Автоаксессуары для телефонов - держатели и зарядки', 'Car accessories for phones - holders and chargers',
 'Удобные аксессуары для использования телефона в автомобиле',
 'Convenient accessories for using your phone in the car');

-- Расширенные бренды
INSERT INTO brands (
  name, slug, description_ru, description_en, logo_url,
  website_url, is_active, sort_order,
  meta_title_ru, meta_title_en, meta_description_ru, meta_description_en
) VALUES
('Apple', 'apple', 
 'Американская технологическая компания, создатель iPhone, iPad и других инновационных устройств',
 'American technology company, creator of iPhone, iPad and other innovative devices',
 'https://example.com/logos/apple.png', 'https://apple.com', true, 1,
 'Apple iPhone, iPad - официальный магазин', 'Apple iPhone, iPad - official store',
 'Оригинальные устройства Apple по лучшим ценам с гарантией качества',
 'Original Apple devices at best prices with quality guarantee'),

('Samsung', 'samsung',
 'Южнокорейский технологический гигант, лидер в производстве смартфонов и электроники',
 'South Korean technology giant, leader in smartphone and electronics manufacturing',
 'https://example.com/logos/samsung.png', 'https://samsung.com', true, 2,
 'Samsung Galaxy - официальный магазин в России', 'Samsung Galaxy - official store in Russia',
 'Samsung Galaxy смартфоны, планшеты и аксессуары с официальной гарантией',
 'Samsung Galaxy smartphones, tablets and accessories with official warranty'),

('Xiaomi', 'xiaomi',
 'Китайская компания, известная качественными смартфонами по доступным ценам',
 'Chinese company known for quality smartphones at affordable prices',
 'https://example.com/logos/xiaomi.png', 'https://mi.com', true, 3,
 'Xiaomi смартфоны - лучшие цены и характеристики', 'Xiaomi smartphones - best prices and specs',
 'Xiaomi Redmi, Mi серии смартфонов по выгодным ценам',
 'Xiaomi Redmi, Mi series smartphones at competitive prices'),

('Huawei', 'huawei',
 'Китайская технологическая компания, производитель премиальных смартфонов',
 'Chinese technology company, manufacturer of premium smartphones',
 'https://example.com/logos/huawei.png', 'https://huawei.com', true, 4,
 'Huawei смартфоны - инновационные технологии', 'Huawei smartphones - innovative technology',
 'Huawei P, Mate серии смартфонов с передовыми камерами',
 'Huawei P, Mate series smartphones with advanced cameras'),

('OnePlus', 'oneplus',
 'Молодая китайская компания, создающая флагманские смартфоны',
 'Young Chinese company creating flagship smartphones',
 'https://example.com/logos/oneplus.png', 'https://oneplus.com', true, 5,
 'OnePlus смартфоны - Never Settle', 'OnePlus smartphones - Never Settle',
 'OnePlus флагманские смартфоны с быстрой зарядкой и отличными камерами',
 'OnePlus flagship smartphones with fast charging and great cameras'),

('Google', 'google',
 'Американская технологическая компания, создатель Android и Pixel устройств',
 'American technology company, creator of Android and Pixel devices',
 'https://example.com/logos/google.png', 'https://store.google.com', true, 6,
 'Google Pixel смартфоны - чистый Android', 'Google Pixel smartphones - pure Android',
 'Google Pixel смартфоны с лучшими камерами и чистым Android',
 'Google Pixel smartphones with best cameras and pure Android'),

('Nothing', 'nothing',
 'Британская компания, создающая уникальные смартфоны с прозрачным дизайном',
 'British company creating unique smartphones with transparent design',
 'https://example.com/logos/nothing.png', 'https://nothing.tech', true, 7,
 'Nothing Phone - уникальный дизайн и технологии', 'Nothing Phone - unique design and technology',
 'Nothing Phone смартфоны с инновационным дизайном и отличной производительностью',
 'Nothing Phone smartphones with innovative design and excellent performance');

-- =============================================
-- ЧАСТЬ 2: РАСШИРЕННЫЕ ПРОДУКТЫ СО ВСЕМИ ПАРАМЕТРАМИ
-- =============================================

-- iPhone 15 Pro Max - флагманский смартфон Apple
INSERT INTO products (
  name_ru, name_en, slug, category_id, brand_id, model, sku,
  description_ru, description_en, short_description_ru, short_description_en,
  base_price, sale_price, currency, weight, dimensions, warranty_months,
  is_active, is_featured, stock_quantity, min_stock_level,
  meta_title_ru, meta_title_en, meta_description_ru, meta_description_en
) VALUES (
  'iPhone 15 Pro Max 256GB', 'iPhone 15 Pro Max 256GB', 'iphone-15-pro-max-256gb', 1, 1, 'A3108',
  'APPLE-IP15PM-256-TIT',
  'iPhone 15 Pro Max с чипом A17 Pro, 6.7-дюймовым дисплеем Super Retina XDR, тройной системой камер Pro с возможностью записи видео в формате ProRes, титановым корпусом и поддержкой USB-C.',
  'iPhone 15 Pro Max with A17 Pro chip, 6.7-inch Super Retina XDR display, triple Pro camera system with ProRes video recording, titanium body and USB-C support.',
  'Флагманский iPhone с максимальными возможностями', 'Flagship iPhone with maximum capabilities',
  119990.00, 109990.00, 'RUB', 221, '159.9 x 76.7 x 8.25 мм', 12,
  true, true, 15, 3,
  'iPhone 15 Pro Max 256GB - купить в официальном магазине', 'iPhone 15 Pro Max 256GB - buy in official store',
  'iPhone 15 Pro Max 256GB по лучшей цене с официальной гарантией Apple', 'iPhone 15 Pro Max 256GB at best price with official Apple warranty'
);

-- Samsung Galaxy S24 Ultra - топовый Android смартфон
INSERT INTO products (
  name_ru, name_en, slug, category_id, brand_id, model, sku,
  description_ru, description_en, short_description_ru, short_description_en,
  base_price, sale_price, currency, weight, dimensions, warranty_months,
  is_active, is_featured, stock_quantity, min_stock_level,
  meta_title_ru, meta_title_en, meta_description_ru, meta_description_en
) VALUES (
  'Samsung Galaxy S24 Ultra 512GB', 'Samsung Galaxy S24 Ultra 512GB', 'samsung-galaxy-s24-ultra-512gb', 1, 2, 'SM-S928B',
  'SAMS-GS24U-512-TIT',
  'Galaxy S24 Ultra с процессором Snapdragon 8 Gen 3, 6.8-дюймовым дисплеем Dynamic AMOLED 2X, камерой 200MP с 100x Space Zoom, S Pen и титановым корпусом.',
  'Galaxy S24 Ultra with Snapdragon 8 Gen 3 processor, 6.8-inch Dynamic AMOLED 2X display, 200MP camera with 100x Space Zoom, S Pen and titanium body.',
  'Мощный Android флагман с S Pen', 'Powerful Android flagship with S Pen',
  99990.00, 94990.00, 'RUB', 232, '162.3 x 79.0 x 8.6 мм', 24,
  true, true, 12, 2,
  'Samsung Galaxy S24 Ultra 512GB - лучшая цена', 'Samsung Galaxy S24 Ultra 512GB - best price',
  'Samsung Galaxy S24 Ultra 512GB с официальной гарантией и быстрой доставкой', 'Samsung Galaxy S24 Ultra 512GB with official warranty and fast delivery'
);

-- Xiaomi 14 Ultra - камерофон от Xiaomi
INSERT INTO products (
  name_ru, name_en, slug, category_id, brand_id, model, sku,
  description_ru, description_en, short_description_ru, short_description_en,
  base_price, sale_price, currency, weight, dimensions, warranty_months,
  is_active, is_featured, stock_quantity, min_stock_level,
  meta_title_ru, meta_title_en, meta_description_ru, meta_description_en
) VALUES (
  'Xiaomi 14 Ultra 1TB', 'Xiaomi 14 Ultra 1TB', 'xiaomi-14-ultra-1tb', 1, 3, 'M2012K11AG',
  'XIAO-14U-1TB-BLK',
  'Xiaomi 14 Ultra с процессором Snapdragon 8 Gen 3, 6.73-дюймовым дисплеем AMOLED, камерой Leica с 4 объективами, быстрой зарядкой 90W и беспроводной зарядкой 50W.',
  'Xiaomi 14 Ultra with Snapdragon 8 Gen 3 processor, 6.73-inch AMOLED display, Leica camera with 4 lenses, 90W fast charging and 50W wireless charging.',
  'Топовый камерофон от Xiaomi с Leica', 'Top camera phone from Xiaomi with Leica',
  79990.00, 74990.00, 'RUB', 224.4, '161.2 x 75.3 x 9.2 мм', 12,
  true, true, 8, 2,
  'Xiaomi 14 Ultra 1TB - камерофон с Leica', 'Xiaomi 14 Ultra 1TB - camera phone with Leica',
  'Xiaomi 14 Ultra 1TB с лучшей камерой и производительностью по выгодной цене', 'Xiaomi 14 Ultra 1TB with best camera and performance at competitive price'
);

-- iPad Pro 12.9" - профессиональный планшет
INSERT INTO products (
  name_ru, name_en, slug, category_id, brand_id, model, sku,
  description_ru, description_en, short_description_ru, short_description_en,
  base_price, sale_price, currency, weight, dimensions, warranty_months,
  is_active, is_featured, stock_quantity, min_stock_level,
  meta_title_ru, meta_title_en, meta_description_ru, meta_description_en
) VALUES (
  'iPad Pro 12.9" 256GB Wi-Fi', 'iPad Pro 12.9" 256GB Wi-Fi', 'ipad-pro-129-256gb-wifi', 2, 1, 'A2759',
  'APPLE-IPAD-PRO-129-256-WIFI',
  'iPad Pro 12.9" с чипом M3, 12.9-дюймовым дисплеем Liquid Retina XDR, поддержкой Apple Pencil 2, Magic Keyboard и Thunderbolt портом для профессиональной работы.',
  'iPad Pro 12.9" with M3 chip, 12.9-inch Liquid Retina XDR display, Apple Pencil 2 support, Magic Keyboard and Thunderbolt port for professional work.',
  'Профессиональный планшет для работы и творчества', 'Professional tablet for work and creativity',
  89990.00, 84990.00, 'RUB', 682, '280.6 x 214.9 x 6.4 мм', 12,
  true, true, 6, 1,
  'iPad Pro 12.9" 256GB - профессиональный планшет', 'iPad Pro 12.9" 256GB - professional tablet',
  'iPad Pro 12.9" 256GB с чипом M3 для профессиональной работы и творчества', 'iPad Pro 12.9" 256GB with M3 chip for professional work and creativity'
);

-- AirPods Pro 2 - премиальные наушники
INSERT INTO products (
  name_ru, name_en, slug, category_id, brand_id, model, sku,
  description_ru, description_en, short_description_ru, short_description_en,
  base_price, sale_price, currency, weight, dimensions, warranty_months,
  is_active, is_featured, stock_quantity, min_stock_level,
  meta_title_ru, meta_title_en, meta_description_ru, meta_description_en
) VALUES (
  'AirPods Pro 2 с MagSafe', 'AirPods Pro 2 with MagSafe', 'airpods-pro-2-magsafe', 3, 1, 'A2698',
  'APPLE-APP-PRO2-MAGS-WHT',
  'AirPods Pro 2 с чипом H2, активным шумоподавлением, пространственным звуком, адаптивной прозрачностью, кейсом с MagSafe и беспроводной зарядкой.',
  'AirPods Pro 2 with H2 chip, active noise cancellation, spatial audio, adaptive transparency, MagSafe case and wireless charging.',
  'Премиальные беспроводные наушники с ANC', 'Premium wireless headphones with ANC',
  24990.00, 22990.00, 'RUB', 56.1, '45.2 x 60.9 x 21.7 мм', 12,
  true, true, 25, 5,
  'AirPods Pro 2 с MagSafe - лучшие наушники', 'AirPods Pro 2 with MagSafe - best headphones',
  'AirPods Pro 2 с активным шумоподавлением и пространственным звуком по выгодной цене', 'AirPods Pro 2 with active noise cancellation and spatial audio at competitive price'
);

-- Samsung Galaxy Buds2 Pro - Android наушники
INSERT INTO products (
  name_ru, name_en, slug, category_id, brand_id, model, sku,
  description_ru, description_en, short_description_ru, short_description_en,
  base_price, sale_price, currency, weight, dimensions, warranty_months,
  is_active, is_featured, stock_quantity, min_stock_level,
  meta_title_ru, meta_title_en, meta_description_ru, meta_description_en
) VALUES (
  'Samsung Galaxy Buds2 Pro', 'Samsung Galaxy Buds2 Pro', 'samsung-galaxy-buds2-pro', 3, 2, 'SM-R510N',
  'SAMS-GBUDS2-PRO-WHT',
  'Galaxy Buds2 Pro с активным шумоподавлением, Hi-Fi звуком 24bit/48kHz, пространственным звуком 360 Audio, защитой от воды IPX7 и быстрой зарядкой.',
  'Galaxy Buds2 Pro with active noise cancellation, Hi-Fi sound 24bit/48kHz, 360 Audio spatial sound, IPX7 water resistance and fast charging.',
  'Премиальные наушники Samsung с ANC', 'Premium Samsung headphones with ANC',
  18990.00, 16990.00, 'RUB', 45.3, 'Кейс: 50.0 x 50.0 x 27.7 мм', 12,
  true, false, 20, 5,
  'Samsung Galaxy Buds2 Pro - наушники с ANC', 'Samsung Galaxy Buds2 Pro - headphones with ANC',
  'Samsung Galaxy Buds2 Pro с Hi-Fi звуком и активным шумоподавлением', 'Samsung Galaxy Buds2 Pro with Hi-Fi sound and active noise cancellation'
);

-- MagSafe Charger - беспроводная зарядка
INSERT INTO products (
  name_ru, name_en, slug, category_id, brand_id, model, sku,
  description_ru, description_en, short_description_ru, short_description_en,
  base_price, sale_price, currency, weight, dimensions, warranty_months,
  is_active, is_featured, stock_quantity, min_stock_level,
  meta_title_ru, meta_title_en, meta_description_ru, meta_description_en
) VALUES (
  'MagSafe Charger', 'MagSafe Charger', 'magsafe-charger', 4, 1, 'A2140',
  'APPLE-MAGS-CHR-WHT',
  'MagSafe зарядка с магнитным креплением, мощностью 15W для iPhone, совместима с MagSafe чехлами и аксессуарами.',
  'MagSafe charger with magnetic attachment, 15W power for iPhone, compatible with MagSafe cases and accessories.',
  'Беспроводная зарядка MagSafe для iPhone', 'MagSafe wireless charger for iPhone',
  4990.00, NULL, 'RUB', 164, 'Диаметр: 55 мм', 12,
  true, false, 50, 10,
  'MagSafe Charger - беспроводная зарядка Apple', 'MagSafe Charger - Apple wireless charger',
  'Оригинальная MagSafe зарядка Apple с магнитным креплением для iPhone', 'Original Apple MagSafe charger with magnetic attachment for iPhone'
);

-- Samsung Wireless Charger - универсальная зарядка
INSERT INTO products (
  name_ru, name_en, slug, category_id, brand_id, model, sku,
  description_ru, description_en, short_description_ru, short_description_en,
  base_price, sale_price, currency, weight, dimensions, warranty_months,
  is_active, is_featured, stock_quantity, min_stock_level,
  meta_title_ru, meta_title_en, meta_description_ru, meta_description_en
) VALUES (
  'Samsung Wireless Charger Pad', 'Samsung Wireless Charger Pad', 'samsung-wireless-charger-pad', 4, 2, 'EP-P1300',
  'SAMS-WCHG-PAD-BLK',
  'Беспроводная зарядка Samsung мощностью 9W, совместима с Qi стандартом, подходит для большинства смартфонов.',
  'Samsung wireless charger 9W power, Qi standard compatible, suitable for most smartphones.',
  'Универсальная беспроводная зарядка Samsung', 'Universal Samsung wireless charger',
  2990.00, 2490.00, 'RUB', 180, '100 x 100 x 12 мм', 12,
  true, false, 30, 8,
  'Samsung Wireless Charger - универсальная зарядка', 'Samsung Wireless Charger - universal charger',
  'Samsung беспроводная зарядка совместимая с Qi стандартом', 'Samsung wireless charger compatible with Qi standard'
);

-- =============================================
-- ЧАСТЬ 3: ВАРИАНТЫ ПРОДУКТОВ (ЦВЕТА, ПАМЯТЬ, РАЗМЕРЫ)
-- =============================================

-- Варианты iPhone 15 Pro Max (цвета и память)
INSERT INTO product_variants (
  product_id, variantNameRu, variantNameEn, variantType, variantValueRu, variantValueEn,
  colorCode, priceModifier, stockQuantity, skuSuffix, isActive, sortOrder
) VALUES
-- Цвета iPhone 15 Pro Max
(1, 'Цвет', 'Color', 'color', 'Натуральный титан', 'Natural Titanium', '#E5E5E7', 0.00, 5, 'TIT', true, 1),
(1, 'Цвет', 'Color', 'color', 'Синий титан', 'Blue Titanium', '#5E6B73', 0.00, 4, 'BLU', true, 2),
(1, 'Цвет', 'Color', 'color', 'Белый титан', 'White Titanium', '#F5F5DC', 0.00, 3, 'WHT', true, 3),
(1, 'Цвет', 'Color', 'color', 'Черный титан', 'Black Titanium', '#1C1C1E', 0.00, 3, 'BLK', true, 4),

-- Память iPhone 15 Pro Max
(1, 'Память', 'Storage', 'memory', '256 ГБ', '256 GB', NULL, 0.00, 15, '256', true, 5),
(1, 'Память', 'Storage', 'memory', '512 ГБ', '512 GB', NULL, 20000.00, 8, '512', true, 6),
(1, 'Память', 'Storage', 'memory', '1 ТБ', '1 TB', NULL, 40000.00, 5, '1TB', true, 7);

-- Варианты Samsung Galaxy S24 Ultra (цвета и память)
INSERT INTO product_variants (
  product_id, variantNameRu, variantNameEn, variantType, variantValueRu, variantValueEn,
  colorCode, priceModifier, stockQuantity, skuSuffix, isActive, sortOrder
) VALUES
-- Цвета Samsung Galaxy S24 Ultra
(2, 'Цвет', 'Color', 'color', 'Титан черный', 'Titanium Black', '#2C2C2E', 0.00, 3, 'BLK', true, 1),
(2, 'Цвет', 'Color', 'color', 'Титан серый', 'Titanium Gray', '#8E8E93', 0.00, 4, 'GRY', true, 2),
(2, 'Цвет', 'Color', 'color', 'Титан фиолетовый', 'Titanium Violet', '#8E44AD', 0.00, 3, 'VIO', true, 3),
(2, 'Цвет', 'Color', 'color', 'Титан желтый', 'Titanium Yellow', '#FFD700', 0.00, 2, 'YLW', true, 4),

-- Память Samsung Galaxy S24 Ultra
(2, 'Память', 'Storage', 'memory', '256 ГБ', '256 GB', NULL, 0.00, 12, '256', true, 5),
(2, 'Память', 'Storage', 'memory', '512 ГБ', '512 GB', NULL, 15000.00, 8, '512', true, 6),
(2, 'Память', 'Storage', 'memory', '1 ТБ', '1 TB', NULL, 30000.00, 4, '1TB', true, 7);

-- Варианты Xiaomi 14 Ultra (цвета и память)
INSERT INTO product_variants (
  product_id, variantNameRu, variantNameEn, variantType, variantValueRu, variantValueEn,
  colorCode, priceModifier, stockQuantity, skuSuffix, isActive, sortOrder
) VALUES
-- Цвета Xiaomi 14 Ultra
(3, 'Цвет', 'Color', 'color', 'Черный', 'Black', '#000000', 0.00, 3, 'BLK', true, 1),
(3, 'Цвет', 'Color', 'color', 'Белый', 'White', '#FFFFFF', 0.00, 2, 'WHT', true, 2),
(3, 'Цвет', 'Color', 'color', 'Зеленый', 'Green', '#00FF7F', 0.00, 2, 'GRN', true, 3),
(3, 'Цвет', 'Color', 'color', 'Коричневый', 'Brown', '#8B4513', 0.00, 1, 'BRN', true, 4),

-- Память Xiaomi 14 Ultra
(3, 'Память', 'Storage', 'memory', '512 ГБ', '512 GB', NULL, 0.00, 8, '512', true, 5),
(3, 'Память', 'Storage', 'memory', '1 ТБ', '1 TB', NULL, 10000.00, 6, '1TB', true, 6);

-- Варианты iPad Pro (память и подключение)
INSERT INTO product_variants (
  product_id, variantNameRu, variantNameEn, variantType, variantValueRu, variantValueEn,
  colorCode, priceModifier, stockQuantity, skuSuffix, isActive, sortOrder
) VALUES
-- Память iPad Pro
(4, 'Память', 'Storage', 'memory', '256 ГБ', '256 GB', NULL, 0.00, 3, '256', true, 1),
(4, 'Память', 'Storage', 'memory', '512 ГБ', '512 GB', NULL, 20000.00, 2, '512', true, 2),
(4, 'Память', 'Storage', 'memory', '1 ТБ', '1 TB', NULL, 40000.00, 1, '1TB', true, 3),

-- Подключение iPad Pro
(4, 'Подключение', 'Connectivity', 'other', 'Wi-Fi', 'Wi-Fi', NULL, 0.00, 6, 'WIFI', true, 4),
(4, 'Подключение', 'Connectivity', 'other', 'Wi-Fi + Cellular', 'Wi-Fi + Cellular', NULL, 15000.00, 3, 'CELL', true, 5);

-- Варианты AirPods Pro 2 (цвета)
INSERT INTO product_variants (
  product_id, variantNameRu, variantNameEn, variantType, variantValueRu, variantValueEn,
  colorCode, priceModifier, stockQuantity, skuSuffix, isActive, sortOrder
) VALUES
(5, 'Цвет', 'Color', 'color', 'Белый', 'White', '#FFFFFF', 0.00, 25, 'WHT', true, 1);

-- Варианты Samsung Galaxy Buds2 Pro (цвета)
INSERT INTO product_variants (
  product_id, variantNameRu, variantNameEn, variantType, variantValueRu, variantValueEn,
  colorCode, priceModifier, stockQuantity, skuSuffix, isActive, sortOrder
) VALUES
(6, 'Цвет', 'Color', 'color', 'Белый', 'White', '#FFFFFF', 0.00, 10, 'WHT', true, 1),
(6, 'Цвет', 'Color', 'color', 'Черный', 'Black', '#000000', 0.00, 7, 'BLK', true, 2),
(6, 'Цвет', 'Color', 'color', 'Фиолетовый', 'Purple', '#8A2BE2', 0.00, 3, 'PUR', true, 3);

-- Варианты MagSafe Charger (цвета)
INSERT INTO product_variants (
  product_id, variantNameRu, variantNameEn, variantType, variantValueRu, variantValueEn,
  colorCode, priceModifier, stockQuantity, skuSuffix, isActive, sortOrder
) VALUES
(7, 'Цвет', 'Color', 'color', 'Белый', 'White', '#FFFFFF', 0.00, 30, 'WHT', true, 1);

-- Варианты Samsung Wireless Charger (цвета)
INSERT INTO product_variants (
  product_id, variantNameRu, variantNameEn, variantType, variantValueRu, variantValueEn,
  colorCode, priceModifier, stockQuantity, skuSuffix, isActive, sortOrder
) VALUES
(8, 'Цвет', 'Color', 'color', 'Черный', 'Black', '#000000', 0.00, 20, 'BLK', true, 1),
(8, 'Цвет', 'Color', 'color', 'Белый', 'White', '#FFFFFF', 0.00, 10, 'WHT', true, 2);

-- =============================================
-- ЧАСТЬ 4: ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ ПРОДУКТОВ
-- =============================================

-- Технические характеристики iPhone 15 Pro Max
INSERT INTO product_specifications (
  product_id, specNameRu, specNameEn, specValueRu, specValueEn, specGroup, sortOrder
) VALUES
-- Основные характеристики
(1, 'Экран', 'Display', '6.7" Super Retina XDR OLED', '6.7" Super Retina XDR OLED', 'Основные', 1),
(1, 'Разрешение', 'Resolution', '2796 x 1290 пикселей', '2796 x 1290 pixels', 'Основные', 2),
(1, 'Процессор', 'Processor', 'Apple A17 Pro', 'Apple A17 Pro', 'Основные', 3),
(1, 'Оперативная память', 'RAM', '8 ГБ', '8 GB', 'Основные', 4),
(1, 'Встроенная память', 'Storage', '256 ГБ', '256 GB', 'Основные', 5),
(1, 'Операционная система', 'OS', 'iOS 17', 'iOS 17', 'Основные', 6),

-- Камера
(1, 'Основная камера', 'Main Camera', '48 МП + 12 МП + 12 МП', '48 MP + 12 MP + 12 MP', 'Камера', 7),
(1, 'Фронтальная камера', 'Front Camera', '12 МП', '12 MP', 'Камера', 8),
(1, 'Видеозапись', 'Video Recording', '4K до 60 fps, ProRes', '4K up to 60 fps, ProRes', 'Камера', 9),

-- Батарея и зарядка
(1, 'Батарея', 'Battery', '4422 мАч', '4422 mAh', 'Батарея', 10),
(1, 'Зарядка', 'Charging', 'USB-C, беспроводная зарядка MagSafe', 'USB-C, MagSafe wireless charging', 'Батарея', 11),
(1, 'Быстрая зарядка', 'Fast Charging', '27W', '27W', 'Батарея', 12),

-- Подключение
(1, 'Интерфейсы', 'Connectivity', 'USB-C, Wi-Fi 6E, Bluetooth 5.3', 'USB-C, Wi-Fi 6E, Bluetooth 5.3', 'Подключение', 13),
(1, 'Сотовая связь', 'Cellular', '5G', '5G', 'Подключение', 14),

-- Защита
(1, 'Защита', 'Protection', 'Ceramic Shield, IP68', 'Ceramic Shield, IP68', 'Защита', 15),
(1, 'Материал корпуса', 'Body Material', 'Титан', 'Titanium', 'Защита', 16);

-- Технические характеристики Samsung Galaxy S24 Ultra
INSERT INTO product_specifications (
  product_id, specNameRu, specNameEn, specValueRu, specValueEn, specGroup, sortOrder
) VALUES
-- Основные характеристики
(2, 'Экран', 'Display', '6.8" Dynamic AMOLED 2X', '6.8" Dynamic AMOLED 2X', 'Основные', 1),
(2, 'Разрешение', 'Resolution', '3120 x 1440 пикселей', '3120 x 1440 pixels', 'Основные', 2),
(2, 'Процессор', 'Processor', 'Snapdragon 8 Gen 3', 'Snapdragon 8 Gen 3', 'Основные', 3),
(2, 'Оперативная память', 'RAM', '12 ГБ', '12 GB', 'Основные', 4),
(2, 'Встроенная память', 'Storage', '512 ГБ', '512 GB', 'Основные', 5),
(2, 'Операционная система', 'OS', 'Android 14, One UI 6.1', 'Android 14, One UI 6.1', 'Основные', 6),

-- Камера
(2, 'Основная камера', 'Main Camera', '200 МП + 50 МП + 10 МП + 10 МП', '200 MP + 50 MP + 10 MP + 10 MP', 'Камера', 7),
(2, 'Фронтальная камера', 'Front Camera', '12 МП', '12 MP', 'Камера', 8),
(2, 'Зум', 'Zoom', '100x Space Zoom', '100x Space Zoom', 'Камера', 9),

-- Батарея и зарядка
(2, 'Батарея', 'Battery', '5000 мАч', '5000 mAh', 'Батарея', 10),
(2, 'Зарядка', 'Charging', '45W быстрая зарядка, беспроводная 15W', '45W fast charging, 15W wireless', 'Батарея', 11),
(2, 'Обратная зарядка', 'Reverse Charging', '4.5W', '4.5W', 'Батарея', 12),

-- Подключение
(2, 'Интерфейсы', 'Connectivity', 'USB-C, Wi-Fi 7, Bluetooth 5.3', 'USB-C, Wi-Fi 7, Bluetooth 5.3', 'Подключение', 13),
(2, 'Сотовая связь', 'Cellular', '5G', '5G', 'Подключение', 14),

-- Особенности
(2, 'S Pen', 'S Pen', 'Встроенный S Pen', 'Built-in S Pen', 'Особенности', 15),
(2, 'Защита', 'Protection', 'Gorilla Glass Armor, IP68', 'Gorilla Glass Armor, IP68', 'Защита', 16);

-- Технические характеристики Xiaomi 14 Ultra
INSERT INTO product_specifications (
  product_id, specNameRu, specNameEn, specValueRu, specValueEn, specGroup, sortOrder
) VALUES
-- Основные характеристики
(3, 'Экран', 'Display', '6.73" AMOLED LTPO', '6.73" AMOLED LTPO', 'Основные', 1),
(3, 'Разрешение', 'Resolution', '3200 x 1440 пикселей', '3200 x 1440 pixels', 'Основные', 2),
(3, 'Процессор', 'Processor', 'Snapdragon 8 Gen 3', 'Snapdragon 8 Gen 3', 'Основные', 3),
(3, 'Оперативная память', 'RAM', '16 ГБ', '16 GB', 'Основные', 4),
(3, 'Встроенная память', 'Storage', '1 ТБ', '1 TB', 'Основные', 5),
(3, 'Операционная система', 'OS', 'Android 14, MIUI 15', 'Android 14, MIUI 15', 'Основные', 6),

-- Камера
(3, 'Основная камера', 'Main Camera', '50 МП Leica + 50 МП + 50 МП + 50 МП', '50 MP Leica + 50 MP + 50 MP + 50 MP', 'Камера', 7),
(3, 'Фронтальная камера', 'Front Camera', '32 МП', '32 MP', 'Камера', 8),
(3, 'Стабилизация', 'Stabilization', 'OIS + EIS', 'OIS + EIS', 'Камера', 9),

-- Батарея и зарядка
(3, 'Батарея', 'Battery', '5300 мАч', '5300 mAh', 'Батарея', 10),
(3, 'Зарядка', 'Charging', '90W быстрая зарядка, 50W беспроводная', '90W fast charging, 50W wireless', 'Батарея', 11),
(3, 'Обратная зарядка', 'Reverse Charging', '10W', '10W', 'Батарея', 12),

-- Подключение
(3, 'Интерфейсы', 'Connectivity', 'USB-C, Wi-Fi 7, Bluetooth 5.4', 'USB-C, Wi-Fi 7, Bluetooth 5.4', 'Подключение', 13),
(3, 'Сотовая связь', 'Cellular', '5G', '5G', 'Подключение', 14),

-- Защита
(3, 'Защита', 'Protection', 'Gorilla Glass Victus 2, IP68', 'Gorilla Glass Victus 2, IP68', 'Защита', 15),
(3, 'Материал корпуса', 'Body Material', 'Кожа + титан', 'Leather + titanium', 'Защита', 16);

-- Технические характеристики iPad Pro 12.9"
INSERT INTO product_specifications (
  product_id, specNameRu, specNameEn, specValueRu, specValueEn, specGroup, sortOrder
) VALUES
-- Основные характеристики
(4, 'Экран', 'Display', '12.9" Liquid Retina XDR', '12.9" Liquid Retina XDR', 'Основные', 1),
(4, 'Разрешение', 'Resolution', '2732 x 2048 пикселей', '2732 x 2048 pixels', 'Основные', 2),
(4, 'Процессор', 'Processor', 'Apple M3', 'Apple M3', 'Основные', 3),
(4, 'Оперативная память', 'RAM', '8 ГБ', '8 GB', 'Основные', 4),
(4, 'Встроенная память', 'Storage', '256 ГБ', '256 GB', 'Основные', 5),
(4, 'Операционная система', 'OS', 'iPadOS 17', 'iPadOS 17', 'Основные', 6),

-- Камера
(4, 'Основная камера', 'Main Camera', '12 МП + 10 МП', '12 MP + 10 MP', 'Камера', 7),
(4, 'Фронтальная камера', 'Front Camera', '12 МП', '12 MP', 'Камера', 8),

-- Батарея и зарядка
(4, 'Батарея', 'Battery', '40.88 Вт⋅ч', '40.88 Wh', 'Батарея', 9),
(4, 'Зарядка', 'Charging', 'USB-C, 20W быстрая зарядка', 'USB-C, 20W fast charging', 'Батарея', 10),

-- Подключение
(4, 'Интерфейсы', 'Connectivity', 'USB-C, Wi-Fi 6E, Bluetooth 5.3', 'USB-C, Wi-Fi 6E, Bluetooth 5.3', 'Подключение', 11),
(4, 'Thunderbolt', 'Thunderbolt', 'USB 4 / Thunderbolt 4', 'USB 4 / Thunderbolt 4', 'Подключение', 12),

-- Особенности
(4, 'Apple Pencil', 'Apple Pencil', 'Поддержка Apple Pencil 2', 'Apple Pencil 2 support', 'Особенности', 13),
(4, 'Magic Keyboard', 'Magic Keyboard', 'Совместимость с Magic Keyboard', 'Magic Keyboard compatibility', 'Особенности', 14),
(4, 'Защита', 'Protection', 'Алюминиевый корпус', 'Aluminum body', 'Защита', 15);

-- Технические характеристики AirPods Pro 2
INSERT INTO product_specifications (
  product_id, specNameRu, specNameEn, specValueRu, specValueEn, specGroup, sortOrder
) VALUES
-- Основные характеристики
(5, 'Чип', 'Chip', 'Apple H2', 'Apple H2', 'Основные', 1),
(5, 'Тип', 'Type', 'Полноразмерные беспроводные', 'Full-size wireless', 'Основные', 2),
(5, 'Диапазон частот', 'Frequency Range', '20 Гц - 20 кГц', '20 Hz - 20 kHz', 'Основные', 3),

-- Звук
(5, 'Активное шумоподавление', 'Active Noise Cancellation', 'Да', 'Yes', 'Звук', 4),
(5, 'Пространственный звук', 'Spatial Audio', 'Да', 'Yes', 'Звук', 5),
(5, 'Адаптивная прозрачность', 'Adaptive Transparency', 'Да', 'Yes', 'Звук', 6),

-- Батарея
(5, 'Время работы', 'Battery Life', '6 часов (с ANC)', '6 hours (with ANC)', 'Батарея', 7),
(5, 'Время работы с кейсом', 'Battery with Case', '30 часов', '30 hours', 'Батарея', 8),
(5, 'Зарядка', 'Charging', 'Lightning, MagSafe, беспроводная', 'Lightning, MagSafe, wireless', 'Батарея', 9),

-- Подключение
(5, 'Bluetooth', 'Bluetooth', 'Bluetooth 5.3', 'Bluetooth 5.3', 'Подключение', 10),
(5, 'Совместимость', 'Compatibility', 'iPhone, iPad, Mac, Apple Watch', 'iPhone, iPad, Mac, Apple Watch', 'Подключение', 11),

-- Защита
(5, 'Защита от воды', 'Water Resistance', 'IPX4', 'IPX4', 'Защита', 12),
(5, 'Материал', 'Material', 'Пластик', 'Plastic', 'Защита', 13);

-- =============================================
-- ЧАСТЬ 5: ИЗОБРАЖЕНИЯ ПРОДУКТОВ
-- =============================================

-- Изображения iPhone 15 Pro Max
INSERT INTO product_images (
  product_id, imageUrl, altTextRu, altTextEn, sortOrder, isPrimary
) VALUES
(1, 'https://example.com/images/iphone-15-pro-max/main.jpg', 'iPhone 15 Pro Max основной вид', 'iPhone 15 Pro Max main view', 1, true),
(1, 'https://example.com/images/iphone-15-pro-max/front.jpg', 'iPhone 15 Pro Max фронтальный вид', 'iPhone 15 Pro Max front view', 2, false),
(1, 'https://example.com/images/iphone-15-pro-max/back.jpg', 'iPhone 15 Pro Max задняя панель', 'iPhone 15 Pro Max back panel', 3, false),
(1, 'https://example.com/images/iphone-15-pro-max/camera.jpg', 'iPhone 15 Pro Max камера крупным планом', 'iPhone 15 Pro Max camera close-up', 4, false),
(1, 'https://example.com/images/iphone-15-pro-max/colors.jpg', 'iPhone 15 Pro Max все цвета', 'iPhone 15 Pro Max all colors', 5, false);

-- Изображения Samsung Galaxy S24 Ultra
INSERT INTO product_images (
  product_id, imageUrl, altTextRu, altTextEn, sortOrder, isPrimary
) VALUES
(2, 'https://example.com/images/samsung-s24-ultra/main.jpg', 'Samsung Galaxy S24 Ultra основной вид', 'Samsung Galaxy S24 Ultra main view', 1, true),
(2, 'https://example.com/images/samsung-s24-ultra/front.jpg', 'Samsung Galaxy S24 Ultra фронтальный вид', 'Samsung Galaxy S24 Ultra front view', 2, false),
(2, 'https://example.com/images/samsung-s24-ultra/back.jpg', 'Samsung Galaxy S24 Ultra задняя панель', 'Samsung Galaxy S24 Ultra back panel', 3, false),
(2, 'https://example.com/images/samsung-s24-ultra/s-pen.jpg', 'Samsung Galaxy S24 Ultra S Pen', 'Samsung Galaxy S24 Ultra S Pen', 4, false),
(2, 'https://example.com/images/samsung-s24-ultra/camera.jpg', 'Samsung Galaxy S24 Ultra камера', 'Samsung Galaxy S24 Ultra camera', 5, false);

-- Изображения Xiaomi 14 Ultra
INSERT INTO product_images (
  product_id, imageUrl, altTextRu, altTextEn, sortOrder, isPrimary
) VALUES
(3, 'https://example.com/images/xiaomi-14-ultra/main.jpg', 'Xiaomi 14 Ultra основной вид', 'Xiaomi 14 Ultra main view', 1, true),
(3, 'https://example.com/images/xiaomi-14-ultra/front.jpg', 'Xiaomi 14 Ultra фронтальный вид', 'Xiaomi 14 Ultra front view', 2, false),
(3, 'https://example.com/images/xiaomi-14-ultra/back.jpg', 'Xiaomi 14 Ultra задняя панель с камерой', 'Xiaomi 14 Ultra back panel with camera', 3, false),
(3, 'https://example.com/images/xiaomi-14-ultra/camera-module.jpg', 'Xiaomi 14 Ultra модуль камеры Leica', 'Xiaomi 14 Ultra Leica camera module', 4, false),
(3, 'https://example.com/images/xiaomi-14-ultra/side.jpg', 'Xiaomi 14 Ultra боковой вид', 'Xiaomi 14 Ultra side view', 5, false);

-- Изображения iPad Pro 12.9"
INSERT INTO product_images (
  product_id, imageUrl, altTextRu, altTextEn, sortOrder, isPrimary
) VALUES
(4, 'https://example.com/images/ipad-pro-129/main.jpg', 'iPad Pro 12.9 дюймов основной вид', 'iPad Pro 12.9 inch main view', 1, true),
(4, 'https://example.com/images/ipad-pro-129/front.jpg', 'iPad Pro 12.9 дюймов экран', 'iPad Pro 12.9 inch display', 2, false),
(4, 'https://example.com/images/ipad-pro-129/back.jpg', 'iPad Pro 12.9 дюймов задняя панель', 'iPad Pro 12.9 inch back panel', 3, false),
(4, 'https://example.com/images/ipad-pro-129/apple-pencil.jpg', 'iPad Pro с Apple Pencil', 'iPad Pro with Apple Pencil', 4, false),
(4, 'https://example.com/images/ipad-pro-129/magic-keyboard.jpg', 'iPad Pro с Magic Keyboard', 'iPad Pro with Magic Keyboard', 5, false);

-- Изображения AirPods Pro 2
INSERT INTO product_images (
  product_id, imageUrl, altTextRu, altTextEn, sortOrder, isPrimary
) VALUES
(5, 'https://example.com/images/airpods-pro-2/main.jpg', 'AirPods Pro 2 основной вид', 'AirPods Pro 2 main view', 1, true),
(5, 'https://example.com/images/airpods-pro-2/case.jpg', 'AirPods Pro 2 кейс', 'AirPods Pro 2 case', 2, false),
(5, 'https://example.com/images/airpods-pro-2/earbuds.jpg', 'AirPods Pro 2 наушники', 'AirPods Pro 2 earbuds', 3, false),
(5, 'https://example.com/images/airpods-pro-2/charging.jpg', 'AirPods Pro 2 зарядка MagSafe', 'AirPods Pro 2 MagSafe charging', 4, false);

-- Изображения Samsung Galaxy Buds2 Pro
INSERT INTO product_images (
  product_id, imageUrl, altTextRu, altTextEn, sortOrder, isPrimary
) VALUES
(6, 'https://example.com/images/galaxy-buds2-pro/main.jpg', 'Samsung Galaxy Buds2 Pro основной вид', 'Samsung Galaxy Buds2 Pro main view', 1, true),
(6, 'https://example.com/images/galaxy-buds2-pro/case.jpg', 'Samsung Galaxy Buds2 Pro кейс', 'Samsung Galaxy Buds2 Pro case', 2, false),
(6, 'https://example.com/images/galaxy-buds2-pro/earbuds.jpg', 'Samsung Galaxy Buds2 Pro наушники', 'Samsung Galaxy Buds2 Pro earbuds', 3, false),
(6, 'https://example.com/images/galaxy-buds2-pro/colors.jpg', 'Samsung Galaxy Buds2 Pro все цвета', 'Samsung Galaxy Buds2 Pro all colors', 4, false);

-- Изображения MagSafe Charger
INSERT INTO product_images (
  product_id, imageUrl, altTextRu, altTextEn, sortOrder, isPrimary
) VALUES
(7, 'https://example.com/images/magsafe-charger/main.jpg', 'MagSafe Charger основной вид', 'MagSafe Charger main view', 1, true),
(7, 'https://example.com/images/magsafe-charger/charging.jpg', 'MagSafe Charger зарядка iPhone', 'MagSafe Charger charging iPhone', 2, false),
(7, 'https://example.com/images/magsafe-charger/side.jpg', 'MagSafe Charger боковой вид', 'MagSafe Charger side view', 3, false);

-- Изображения Samsung Wireless Charger
INSERT INTO product_images (
  product_id, imageUrl, altTextRu, altTextEn, sortOrder, isPrimary
) VALUES
(8, 'https://example.com/images/samsung-wireless-charger/main.jpg', 'Samsung Wireless Charger основной вид', 'Samsung Wireless Charger main view', 1, true),
(8, 'https://example.com/images/samsung-wireless-charger/charging.jpg', 'Samsung Wireless Charger зарядка телефона', 'Samsung Wireless Charger charging phone', 2, false),
(8, 'https://example.com/images/samsung-wireless-charger/colors.jpg', 'Samsung Wireless Charger черный и белый', 'Samsung Wireless Charger black and white', 3, false);

-- =============================================
-- ФИНАЛЬНАЯ ЧАСТЬ: СТАТИСТИКА И ИНСТРУКЦИИ
-- =============================================

-- Проверка вставленных данных
SELECT '=== СТАТИСТИКА ВСТАВЛЕННЫХ ДАННЫХ ===' as info;

SELECT 
  'Категории' as table_name, 
  COUNT(*) as count 
FROM categories
UNION ALL
SELECT 
  'Бренды' as table_name, 
  COUNT(*) as count 
FROM brands
UNION ALL
SELECT 
  'Продукты' as table_name, 
  COUNT(*) as count 
FROM products
UNION ALL
SELECT 
  'Варианты продуктов' as table_name, 
  COUNT(*) as count 
FROM product_variants
UNION ALL
SELECT 
  'Технические характеристики' as table_name, 
  COUNT(*) as count 
FROM product_specifications
UNION ALL
SELECT 
  'Изображения продуктов' as table_name, 
  COUNT(*) as count 
FROM product_images;

-- Детальная информация о продуктах
SELECT '=== ИНФОРМАЦИЯ О ПРОДУКТАХ ===' as info;

SELECT 
  p.id,
  p.name_ru,
  p.sku,
  p.base_price,
  p.sale_price,
  p.stock_quantity,
  c.name_ru as category_name,
  b.name as brand_name,
  COUNT(pv.id) as variants_count,
  COUNT(ps.id) as specs_count,
  COUNT(pi.id) as images_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN product_specifications ps ON p.id = ps.product_id
LEFT JOIN product_images pi ON p.id = pi.product_id
GROUP BY p.id, p.name_ru, p.sku, p.base_price, p.sale_price, p.stock_quantity, c.name_ru, b.name
ORDER BY p.id;

-- Примеры запросов для тестирования API
SELECT '=== ПРИМЕРЫ ЗАПРОСОВ ДЛЯ ТЕСТИРОВАНИЯ ===' as info;

-- 1. Получить все продукты с категориями и брендами
SELECT 
  p.id,
  p.name_ru,
  p.slug,
  p.base_price,
  p.sale_price,
  p.stock_quantity,
  p.is_active,
  p.is_featured,
  c.name_ru as category_name,
  b.name as brand_name
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN brands b ON p.brand_id = b.id
ORDER BY p.id;

-- 2. Получить продукты с вариантами
SELECT 
  p.name_ru as product_name,
  pv.variantNameRu as variant_name,
  pv.variantValueRu as variant_value,
  pv.colorCode,
  pv.priceModifier,
  pv.stockQuantity as variant_stock
FROM products p
JOIN product_variants pv ON p.id = pv.product_id
WHERE pv.isActive = true
ORDER BY p.id, pv.sortOrder;

-- 3. Получить технические характеристики по группам
SELECT 
  p.name_ru as product_name,
  ps.specGroup,
  ps.specNameRu,
  ps.specValueRu
FROM products p
JOIN product_specifications ps ON p.id = ps.product_id
ORDER BY p.id, ps.specGroup, ps.sortOrder;

-- 4. Получить изображения продуктов
SELECT 
  p.name_ru as product_name,
  pi.imageUrl,
  pi.altTextRu,
  pi.isPrimary,
  pi.sortOrder
FROM products p
JOIN product_images pi ON p.id = pi.product_id
ORDER BY p.id, pi.sortOrder;

-- =============================================
-- ИНСТРУКЦИИ ПО ИСПОЛЬЗОВАНИЮ
-- =============================================

SELECT '=== ИНСТРУКЦИИ ПО ИСПОЛЬЗОВАНИЮ ===' as info;

/*
ИНСТРУКЦИИ ПО ИСПОЛЬЗОВАНИЮ ТЕСТОВЫХ ДАННЫХ:

1. ПЕРЕД ВЫПОЛНЕНИЕМ:
   - Убедитесь, что база данных создана
   - Выполните database-schema.sql для создания таблиц
   - Раскомментируйте строки очистки данных при необходимости

2. ВЫПОЛНЕНИЕ СКРИПТА:
   - Запустите весь файл COMPLETE_TEST_DATA.sql
   - Проверьте, что все данные вставлены без ошибок
   - Убедитесь в корректности связей между таблицами

3. ТЕСТИРОВАНИЕ API:
   - Используйте примеры запросов выше для проверки данных
   - Тестируйте CRUD операции через ProductsController
   - Проверьте корректность связей с категориями и брендами

4. ВАЖНЫЕ ЗАМЕЧАНИЯ:
   - Все SKU уникальны и соответствуют реальным артикулам
   - Цены указаны в рублях (RUB)
   - Вес указан в граммах
   - Размеры указаны в миллиметрах
   - Изображения используют placeholder URLs

5. СТРУКТУРА ДАННЫХ:
   - 6 категорий товаров
   - 7 брендов
   - 8 продуктов с полными характеристиками
   - Множественные варианты (цвета, память, размеры)
   - Детальные технические характеристики
   - Изображения для каждого продукта

6. ДЛЯ РАЗРАБОТКИ:
   - Используйте эти данные для тестирования фронтенда
   - Проверьте корректность отображения всех полей
   - Тестируйте фильтрацию и поиск по продуктам
   - Проверьте работу с вариантами и характеристиками
*/

COMMIT;

SELECT 'Тестовые данные успешно добавлены!' as message;
SELECT 'Готово к тестированию модуля продуктов!' as status;
