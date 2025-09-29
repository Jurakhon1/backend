-- Обновление таблицы banks для добавления недостающих полей
-- Проверяем и добавляем поля по одному
ALTER TABLE banks 
ADD COLUMN payment_steps_ru JSON;

ALTER TABLE banks 
ADD COLUMN payment_steps_en JSON;

ALTER TABLE banks 
ADD COLUMN screenshot_urls JSON;

ALTER TABLE banks 
ADD COLUMN prepayment_percent DECIMAL(5,2) DEFAULT 10.0;

ALTER TABLE banks 
ADD COLUMN payment_timeout_minutes INTEGER DEFAULT 30;

-- Обновление существующих записей
UPDATE banks SET 
    payment_steps_ru = '[
        "1️⃣ Откройте приложение Сбербанк Онлайн",
        "2️⃣ Выберите «Переводы» → «По номеру карты»",
        "3️⃣ Введите номер карты: {card_number}",
        "4️⃣ Введите сумму предоплаты: {amount} ₽",
        "5️⃣ Укажите назначение: «Предоплата заказа»",
        "6️⃣ Подтвердите перевод",
        "7️⃣ Сделайте скриншот чека"
    ]'::json,
    payment_steps_en = '[
        "1️⃣ Open Sberbank Online app",
        "2️⃣ Select \"Transfers\" → \"By card number\"",
        "3️⃣ Enter card number: {card_number}",
        "4️⃣ Enter prepayment amount: {amount} ₽",
        "5️⃣ Specify purpose: \"Order prepayment\"",
        "6️⃣ Confirm transfer",
        "7️⃣ Take screenshot of receipt"
    ]'::json,
    prepayment_percent = 10.0,
    payment_timeout_minutes = 30
WHERE name LIKE '%Сбербанк%' OR name_en = 'Sberbank';

UPDATE banks SET 
    payment_steps_ru = '[
        "1️⃣ Откройте приложение Тинькофф",
        "2️⃣ Выберите «Переводы» → «На карту другого банка»",
        "3️⃣ Введите номер карты: {card_number}",
        "4️⃣ Введите сумму предоплаты: {amount} ₽",
        "5️⃣ Укажите назначение: «Предоплата заказа»",
        "6️⃣ Подтвердите перевод",
        "7️⃣ Сделайте скриншот чека"
    ]'::json,
    payment_steps_en = '[
        "1️⃣ Open Tinkoff app",
        "2️⃣ Select \"Transfers\" → \"To another bank card\"",
        "3️⃣ Enter card number: {card_number}",
        "4️⃣ Enter prepayment amount: {amount} ₽",
        "5️⃣ Specify purpose: \"Order prepayment\"",
        "6️⃣ Confirm transfer",
        "7️⃣ Take screenshot of receipt"
    ]'::json,
    prepayment_percent = 10.0,
    payment_timeout_minutes = 30
WHERE name LIKE '%Тинькофф%' OR name_en = 'Tinkoff';
