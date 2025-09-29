-- Исправление URL изображений для устранения CORS ошибок
-- Заменяем example.com на рабочие URL изображений

-- Обновляем изображения товаров
UPDATE product_images 
SET imageUrl = 'https://via.placeholder.com/400x400/007ACC/FFFFFF?text=Product+Image'
WHERE imageUrl LIKE '%example.com%';

-- Обновляем логотипы брендов
UPDATE brands 
SET logo_url = 'https://via.placeholder.com/100x100/FF6B6B/FFFFFF?text=Brand'
WHERE logo_url LIKE '%example.com%';

-- Обновляем иконки категорий
UPDATE categories 
SET icon_url = 'https://via.placeholder.com/64x64/4ECDC4/FFFFFF?text=Category'
WHERE icon_url LIKE '%example.com%';

-- Обновляем изображения категорий
UPDATE categories 
SET image_url = 'https://via.placeholder.com/300x200/45B7D1/FFFFFF?text=Category+Image'
WHERE image_url LIKE '%example.com%';

-- Проверяем результат
SELECT 'Updated product images:' as info;
SELECT id, imageUrl FROM product_images WHERE imageUrl LIKE '%placeholder%' LIMIT 5;

SELECT 'Updated brand logos:' as info;
SELECT id, name, logo_url FROM brands WHERE logo_url LIKE '%placeholder%' LIMIT 5;

SELECT 'Updated category icons:' as info;
SELECT id, name_ru, icon_url FROM categories WHERE icon_url LIKE '%placeholder%' LIMIT 5;
