-- Исправление ограничений длины для полей изображений
-- Изменяем VARCHAR(500) на TEXT для хранения длинных base64 строк

-- Проверяем текущую структуру таблицы
DESCRIBE product_color_images;

-- Изменяем тип полей с VARCHAR(500) на TEXT
ALTER TABLE product_color_images 
MODIFY COLUMN primary_image_url TEXT NOT NULL;

ALTER TABLE product_color_images 
MODIFY COLUMN thumbnail_url TEXT NULL;

-- Проверяем обновленную структуру таблицы
DESCRIBE product_color_images;

-- Выводим информацию об успешном обновлении
SELECT 'Поля изображений успешно обновлены на TEXT!' as message;
