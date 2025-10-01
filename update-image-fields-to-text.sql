-- Обновление полей изображений в таблице product_color_images
-- Изменяем тип полей с VARCHAR(500) на TEXT для хранения длинных base64 строк

ALTER TABLE product_color_images 
MODIFY COLUMN primary_image_url TEXT NOT NULL;

ALTER TABLE product_color_images 
MODIFY COLUMN thumbnail_url TEXT NULL;
