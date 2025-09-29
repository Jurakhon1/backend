-- Тестовые данные для изображений телефонов разных цветов
-- Этот скрипт добавляет тестовые изображения для демонстрации системы цветов

-- Сначала создаем тестовые продукты (если их нет)
INSERT IGNORE INTO products (id, name_ru, name_en, slug, category_id, brand_id, base_price, stock_quantity, is_active, sku) VALUES
(1, 'iPhone 15 Pro', 'iPhone 15 Pro', 'iphone-15-pro', 1, 1, 99999, 50, true, 'IPH15PRO'),
(2, 'Samsung Galaxy S24', 'Samsung Galaxy S24', 'samsung-galaxy-s24', 1, 2, 89999, 30, true, 'SGS24'),
(3, 'Google Pixel 8', 'Google Pixel 8', 'google-pixel-8', 1, 3, 79999, 25, true, 'GP8');

-- Создаем варианты цветов для iPhone 15 Pro
INSERT IGNORE INTO product_variants (id, product_id, variantNameRu, variantNameEn, variantType, variantValueRu, variantValueEn, colorCode, priceModifier, stockQuantity, isActive) VALUES
(1, 1, 'Цвет', 'Color', 'color', 'Титан синий', 'Titanium Blue', '#4A90E2', 0, 10, true),
(2, 1, 'Цвет', 'Color', 'color', 'Титан белый', 'Titanium White', '#F5F5F5', 0, 8, true),
(3, 1, 'Цвет', 'Color', 'color', 'Титан черный', 'Titanium Black', '#2C2C2C', 0, 12, true),
(4, 1, 'Цвет', 'Color', 'color', 'Титан природный', 'Titanium Natural', '#D4C4A8', 0, 6, true);

-- Создаем варианты цветов для Samsung Galaxy S24
INSERT IGNORE INTO product_variants (id, product_id, variantNameRu, variantNameEn, variantType, variantValueRu, variantValueEn, colorCode, priceModifier, stockQuantity, isActive) VALUES
(5, 2, 'Цвет', 'Color', 'color', 'Оникс черный', 'Onyx Black', '#1A1A1A', 0, 8, true),
(6, 2, 'Цвет', 'Color', 'color', 'Мрамор серый', 'Marble Gray', '#8E8E93', 0, 10, true),
(7, 2, 'Цвет', 'Color', 'color', 'Кобальт фиолетовый', 'Cobalt Violet', '#5856D6', 0, 7, true),
(8, 2, 'Цвет', 'Color', 'color', 'Янтарный желтый', 'Amber Yellow', '#FF9500', 0, 5, true);

-- Создаем варианты цветов для Google Pixel 8
INSERT IGNORE INTO product_variants (id, product_id, variantNameRu, variantNameEn, variantType, variantValueRu, variantValueEn, colorCode, priceModifier, stockQuantity, isActive) VALUES
(9, 3, 'Цвет', 'Color', 'color', 'Обсидиан черный', 'Obsidian Black', '#000000', 0, 8, true),
(10, 3, 'Цвет', 'Color', 'color', 'Хейзел коричневый', 'Hazel Brown', '#8B4513', 0, 6, true),
(11, 3, 'Цвет', 'Color', 'color', 'Роза розовый', 'Rose Pink', '#FF69B4', 0, 7, true),
(12, 3, 'Цвет', 'Color', 'color', 'Мятный зеленый', 'Mint Green', '#98FB98', 0, 4, true);

-- Добавляем изображения для каждого варианта цвета
-- iPhone 15 Pro - Титан синий
INSERT IGNORE INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code, is_active) VALUES
(1, 1, '/uploads/phones/iphone-15-pro-blue.jpg', '/uploads/phones/iphone-15-pro-blue.jpg', 
 '["/uploads/phones/iphone-15-pro-blue.jpg", "/uploads/phones/iphone-15-pro-blue.jpg", "/uploads/phones/iphone-15-pro-blue.jpg"]', 
 '#4A90E2', true);

-- iPhone 15 Pro - Титан белый
INSERT IGNORE INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code, is_active) VALUES
(1, 2, '/uploads/phones/iphone-15-pro-white.jpg', '/uploads/phones/iphone-15-pro-white.jpg', 
 '["/uploads/phones/iphone-15-pro-white.jpg", "/uploads/phones/iphone-15-pro-white.jpg", "/uploads/phones/iphone-15-pro-white.jpg"]', 
 '#F5F5F5', true);

-- iPhone 15 Pro - Титан черный
INSERT IGNORE INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code, is_active) VALUES
(1, 3, '/uploads/phones/iphone-15-pro-black.jpg', '/uploads/phones/iphone-15-pro-black.jpg', 
 '["/uploads/phones/iphone-15-pro-black.jpg", "/uploads/phones/iphone-15-pro-black.jpg", "/uploads/phones/iphone-15-pro-black.jpg"]', 
 '#2C2C2C', true);

-- iPhone 15 Pro - Титан природный
INSERT IGNORE INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code, is_active) VALUES
(1, 4, '/uploads/phones/iphone-15-pro-natural.jpg', '/uploads/phones/iphone-15-pro-natural.jpg', 
 '["/uploads/phones/iphone-15-pro-natural.jpg", "/uploads/phones/iphone-15-pro-natural.jpg", "/uploads/phones/iphone-15-pro-natural.jpg"]', 
 '#D4C4A8', true);

-- Samsung Galaxy S24 - Оникс черный
INSERT IGNORE INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code, is_active) VALUES
(2, 5, '/uploads/phones/samsung-s24-black.jpg', '/uploads/phones/samsung-s24-black.jpg', 
 '["/uploads/phones/samsung-s24-black.jpg", "/uploads/phones/samsung-s24-black.jpg", "/uploads/phones/samsung-s24-black.jpg"]', 
 '#1A1A1A', true);

-- Samsung Galaxy S24 - Мрамор серый
INSERT IGNORE INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code, is_active) VALUES
(2, 6, '/uploads/phones/samsung-s24-gray.jpg', '/uploads/phones/samsung-s24-gray.jpg', 
 '["/uploads/phones/samsung-s24-gray.jpg", "/uploads/phones/samsung-s24-gray.jpg", "/uploads/phones/samsung-s24-gray.jpg"]', 
 '#8E8E93', true);

-- Samsung Galaxy S24 - Кобальт фиолетовый
INSERT IGNORE INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code, is_active) VALUES
(2, 7, '/uploads/phones/samsung-s24-violet.jpg', '/uploads/phones/samsung-s24-violet.jpg', 
 '["/uploads/phones/samsung-s24-violet.jpg", "/uploads/phones/samsung-s24-violet.jpg", "/uploads/phones/samsung-s24-violet.jpg"]', 
 '#5856D6', true);

-- Samsung Galaxy S24 - Янтарный желтый
INSERT IGNORE INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code, is_active) VALUES
(2, 8, '/uploads/phones/samsung-s24-yellow.jpg', '/uploads/phones/samsung-s24-yellow.jpg', 
 '["/uploads/phones/samsung-s24-yellow.jpg", "/uploads/phones/samsung-s24-yellow.jpg", "/uploads/phones/samsung-s24-yellow.jpg"]', 
 '#FF9500', true);

-- Google Pixel 8 - Обсидиан черный
INSERT IGNORE INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code, is_active) VALUES
(3, 9, '/uploads/phones/pixel-8-black.jpg', '/uploads/phones/pixel-8-black.jpg', 
 '["/uploads/phones/pixel-8-black.jpg", "/uploads/phones/pixel-8-black.jpg", "/uploads/phones/pixel-8-black.jpg"]', 
 '#000000', true);

-- Google Pixel 8 - Хейзел коричневый
INSERT IGNORE INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code, is_active) VALUES
(3, 10, '/uploads/phones/pixel-8-brown.jpg', '/uploads/phones/pixel-8-brown.jpg', 
 '["/uploads/phones/pixel-8-brown.jpg", "/uploads/phones/pixel-8-brown.jpg", "/uploads/phones/pixel-8-brown.jpg"]', 
 '#8B4513', true);

-- Google Pixel 8 - Роза розовый
INSERT IGNORE INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code, is_active) VALUES
(3, 11, '/uploads/phones/pixel-8-pink.jpg', '/uploads/phones/pixel-8-pink.jpg', 
 '["/uploads/phones/pixel-8-pink.jpg", "/uploads/phones/pixel-8-pink.jpg", "/uploads/phones/pixel-8-pink.jpg"]', 
 '#FF69B4', true);

-- Google Pixel 8 - Мятный зеленый
INSERT IGNORE INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code, is_active) VALUES
(3, 12, '/uploads/phones/pixel-8-mint.jpg', '/uploads/phones/pixel-8-mint.jpg', 
 '["/uploads/phones/pixel-8-mint.jpg", "/uploads/phones/pixel-8-mint.jpg", "/uploads/phones/pixel-8-mint.jpg"]', 
 '#98FB98', true);

-- Также добавляем основные изображения продуктов
INSERT IGNORE INTO product_images (product_id, imageUrl, altTextRu, altTextEn, sortOrder, isPrimary) VALUES
(1, '/uploads/phones/iphone-15-pro-blue.jpg', 'iPhone 15 Pro', 'iPhone 15 Pro', 0, true),
(2, '/uploads/phones/samsung-s24-black.jpg', 'Samsung Galaxy S24', 'Samsung Galaxy S24', 0, true),
(3, '/uploads/phones/pixel-8-black.jpg', 'Google Pixel 8', 'Google Pixel 8', 0, true);
