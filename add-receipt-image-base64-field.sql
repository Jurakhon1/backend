-- Добавление поля receipt_image_base64 в таблицу payment_transactions
-- для хранения base64 данных чека вместо URL файла

ALTER TABLE payment_transactions 
ADD COLUMN receipt_image_base64 LONGTEXT NULL 
COMMENT 'Base64 данные изображения чека';

-- Добавляем индекс для оптимизации поиска по base64 данным (опционально)
-- CREATE INDEX idx_payment_transactions_receipt_base64 ON payment_transactions(receipt_image_base64(100));

-- Обновляем существующие записи, если нужно
-- UPDATE payment_transactions 
-- SET receipt_image_base64 = NULL 
-- WHERE receipt_image_base64 IS NULL;
