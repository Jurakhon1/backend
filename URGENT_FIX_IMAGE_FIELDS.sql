-- =============================================
-- СРОЧНОЕ ИСПРАВЛЕНИЕ: Изменение VARCHAR(500) на TEXT
-- =============================================
-- Этот скрипт исправляет ограничение длины полей изображений
-- с VARCHAR(500) на TEXT для поддержки длинных base64 строк

-- ВНИМАНИЕ: Выполните этот скрипт в вашей базе данных!

-- 1. Проверяем текущую структуру таблицы
DESCRIBE product_color_images;

-- 2. Изменяем тип полей с VARCHAR(500) на TEXT
ALTER TABLE product_color_images 
MODIFY COLUMN primary_image_url TEXT NOT NULL;

ALTER TABLE product_color_images 
MODIFY COLUMN thumbnail_url TEXT NULL;

-- 3. Проверяем обновленную структуру таблицы
DESCRIBE product_color_images;

-- 4. Выводим информацию об успешном обновлении
SELECT '✅ Поля изображений успешно обновлены на TEXT!' as message;
SELECT 'Теперь base64 изображения не будут обрезаться до 500 символов.' as info;
