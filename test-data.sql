-- =============================================
-- ТЕСТОВЫЕ ДАННЫЕ ДЛЯ МОБИЛЬНОГО ПРИЛОЖЕНИЯ
-- =============================================

-- Очистка существующих данных
DELETE FROM cart_items;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM payment_transactions;
DELETE FROM bonus_transactions;
DELETE FROM promo_code_usage;
DELETE FROM wishlist_items;
DELETE FROM product_comparisons;
DELETE FROM product_reviews;
DELETE FROM review_helpfulness;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM brands;
DELETE FROM banks;
DELETE FROM promo_codes;
DELETE FROM pickup_points;
DELETE FROM users;

-- =============================================
-- ПОЛЬЗОВАТЕЛИ
-- =============================================

INSERT INTO users (email, phone, password_hash, first_name, last_name, is_verified, language_preference) VALUES
('ivan@example.com', '+79123456789', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/kfnJTGqfq', 'Иван', 'Иванов', true, 'ru'),
('maria@example.com', '+79987654321', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/kfnJTGqfq', 'Мария', 'Петрова', true, 'ru'),
('john@example.com', '+79555123456', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/kfnJTGqfq', 'John', 'Smith', false, 'en');

-- =============================================
-- КАТЕГОРИИ
-- =============================================

INSERT INTO categories (name_ru, name_en, slug, description_ru, description_en) VALUES
('Смартфоны', 'Smartphones', 'smartphones', 'Современные мобильные телефоны', 'Modern mobile phones'),
('Планшеты', 'Tablets', 'tablets', 'Планшетные компьютеры', 'Tablet computers'),
('Аксессуары', 'Accessories', 'accessories', 'Аксессуары для мобильных устройств', 'Mobile device accessories'),
('Наушники', 'Headphones', 'headphones', 'Наушники и гарнитуры', 'Headphones and headsets'),
('Зарядки', 'Chargers', 'chargers', 'Зарядные устройства', 'Charging devices');

-- =============================================
-- БРЕНДЫ
-- =============================================

INSERT INTO brands (name, slug, description_ru, description_en, logo_url) VALUES
('Apple', 'apple', 'Американская технологическая компания', 'American technology company', 'https://example.com/logos/apple.png'),
('Samsung', 'samsung', 'Южнокорейская технологическая компания', 'South Korean technology company', 'https://example.com/logos/samsung.png'),
('Xiaomi', 'xiaomi', 'Китайская технологическая компания', 'Chinese technology company', 'https://example.com/logos/xiaomi.png'),
('Huawei', 'huawei', 'Китайская технологическая компания', 'Chinese technology company', 'https://example.com/logos/huawei.png'),
('OnePlus', 'oneplus', 'Китайская технологическая компания', 'Chinese technology company', 'https://example.com/logos/oneplus.png');

-- =============================================
-- ТОВАРЫ
-- =============================================

INSERT INTO products (
  name_ru, name_en, slug, category_id, brand_id, model, sku, 
  description_ru, description_en, short_description_ru, short_description_en,
  base_price, sale_price, weight, dimensions, warranty_months, 
  is_featured, stock_quantity, min_stock_level
) VALUES
-- iPhone 15 Pro
('iPhone 15 Pro', 'iPhone 15 Pro', 'iphone-15-pro', 1, 1, 'A3102', 'APPLE-IP15P-128-BLK',
'Профессиональный смартфон Apple с чипом A17 Pro, тройной камерой и титановым корпусом', 
'Professional Apple smartphone with A17 Pro chip, triple camera and titanium body',
'Мощный iPhone с профессиональными возможностями', 'Powerful iPhone with pro features',
89990.00, 84990.00, 187, '146.6 x 70.6 x 8.25 мм', 12, true, 25, 5),

-- Samsung Galaxy S24
('Samsung Galaxy S24', 'Samsung Galaxy S24', 'samsung-galaxy-s24', 1, 2, 'SM-S921B', 'SAMS-GS24-256-GRY',
'Флагманский смартфон Samsung с AI-функциями и камерой 50MP',
'Flagship Samsung smartphone with AI features and 50MP camera', 
'Умный смартфон с искусственным интеллектом', 'Smart smartphone with AI',
74990.00, 69990.00, 167, '147 x 70.6 x 7.6 мм', 24, true, 30, 5),

-- Xiaomi 14
('Xiaomi 14', 'Xiaomi 14', 'xiaomi-14', 1, 3, 'M2012K11AG', 'XIAO-14-512-WHT',
'Топовый смартфон Xiaomi с процессором Snapdragon 8 Gen 3',
'Top Xiaomi smartphone with Snapdragon 8 Gen 3 processor',
'Мощный смартфон с отличной камерой', 'Powerful smartphone with great camera',
54990.00, 49990.00, 193, '152.8 x 71.5 x 8.2 мм', 12, true, 20, 5),

-- iPad Air
('iPad Air', 'iPad Air', 'ipad-air', 2, 1, 'A2316', 'APPLE-IPAD-AIR-64-BLU',
'Легкий и мощный планшет Apple для работы и развлечений',
'Light and powerful Apple tablet for work and entertainment',
'Универсальный планшет для любых задач', 'Universal tablet for any tasks',
44990.00, NULL, 458, '247.6 x 178.5 x 6.1 мм', 12, false, 15, 3),

-- AirPods Pro
('AirPods Pro 2', 'AirPods Pro 2', 'airpods-pro-2', 4, 1, 'A2698', 'APPLE-APP-PRO2-WHT',
'Беспроводные наушники Apple с активным шумоподавлением',
'Apple wireless earphones with active noise cancellation',
'Премиальные беспроводные наушники', 'Premium wireless earphones',
24990.00, 22990.00, 50.8, '30.9 x 21.8 x 24.0 мм', 12, true, 40, 10),

-- Зарядка iPhone
('Зарядка MagSafe', 'MagSafe Charger', 'magsafe-charger', 5, 1, 'A2140', 'APPLE-MAGS-CHR-WHT',
'Беспроводная зарядка MagSafe для iPhone с магнитным креплением',
'MagSafe wireless charger for iPhone with magnetic attachment',
'Удобная беспроводная зарядка', 'Convenient wireless charging',
4990.00, NULL, 164, 'Диаметр 55 мм', 12, false, 50, 10);

-- =============================================
-- БАНКИ ДЛЯ ОПЛАТЫ
-- =============================================

INSERT INTO banks (
  name, name_en, card_number, recipient_name, bank_name,
  payment_instructions_ru, payment_instructions_en, sort_order
) VALUES
('Сбербанк', 'Sberbank', '5469 3800 1234 5678', 'ООО "Мобильные Технологии"', 'ПАО СБЕРБАНК',
'Переведите указанную сумму на карту 5469 3800 1234 5678 получатель: ООО "Мобильные Технологии". После перевода загрузите скриншот чека.',
'Transfer the specified amount to card 5469 3800 1234 5678 recipient: Mobile Technologies LLC. After transfer upload receipt screenshot.', 1),

('Тинькофф', 'Tinkoff', '5536 9137 8765 4321', 'ООО "Мобильные Технологии"', 'АО "Тинькофф Банк"',
'Переведите сумму на карту Тинькофф 5536 9137 8765 4321. Получатель: ООО "Мобильные Технологии". Обязательно загрузите чек!',
'Transfer amount to Tinkoff card 5536 9137 8765 4321. Recipient: Mobile Technologies LLC. Upload receipt!', 2),

('Альфа-Банк', 'Alfa-Bank', '4154 8100 9876 5432', 'ООО "Мобильные Технологии"', 'АО "Альфа-Банк"',
'Перевод на карту Альфа-Банка 4154 8100 9876 5432. После оплаты обязательно загрузите скриншот чека в приложении.',
'Transfer to Alfa-Bank card 4154 8100 9876 5432. After payment upload receipt screenshot in app.', 3);

-- =============================================
-- ПРОМОКОДЫ
-- =============================================

INSERT INTO promo_codes (
  code, name_ru, name_en, description_ru, description_en,
  discount_type, discount_value, min_order_amount, usage_limit, 
  valid_from, valid_until
) VALUES
('WELCOME10', 'Скидка новичкам', 'Welcome Discount', 
'Скидка 10% для новых пользователей', 'New user 10% discount',
'percentage', 10.00, 5000.00, 100, 
'2025-01-01 00:00:00', '2025-12-31 23:59:59'),

('PHONE500', 'Скидка на телефоны', 'Phone Discount',
'Фиксированная скидка 500 рублей на смартфоны', 'Fixed 500 rubles discount on smartphones', 
'fixed_amount', 500.00, 10000.00, 50,
'2025-01-01 00:00:00', '2025-12-31 23:59:59'),

('FREESHIP', 'Бесплатная доставка', 'Free Shipping',
'Бесплатная доставка при заказе от 3000 рублей', 'Free shipping for orders over 3000 rubles',
'free_shipping', 0.00, 3000.00, NULL,
'2025-01-01 00:00:00', '2025-12-31 23:59:59');

-- =============================================
-- ПУНКТЫ САМОВЫВОЗА
-- =============================================

INSERT INTO pickup_points (
  name, name_en, address_ru, address_en, city, 
  latitude, longitude, phone, working_hours_ru, working_hours_en
) VALUES
('Магазин на Арбате', 'Arbat Store', 'ул. Арбат, д. 15', 'Arbat St., 15', 'Москва',
55.751244, 37.618423, '+7 (495) 123-45-67', 'Пн-Вс: 10:00-22:00', 'Mon-Sun: 10:00-22:00'),

('ТЦ Европейский', 'Evropeyskiy Mall', 'пл. Киевского Вокзала, д. 2', 'Kievskogo Vokzala Sq., 2', 'Москва', 
55.744094, 37.566533, '+7 (495) 987-65-43', 'Пн-Вс: 10:00-23:00', 'Mon-Sun: 10:00-23:00'),

('Магазин в Питере', 'SPb Store', 'Невский проспект, д. 28', 'Nevsky Prospect, 28', 'Санкт-Петербург',
59.934280, 30.335099, '+7 (812) 234-56-78', 'Пн-Пт: 10:00-21:00, Сб-Вс: 11:00-20:00', 'Mon-Fri: 10:00-21:00, Sat-Sun: 11:00-20:00');

-- =============================================
-- ТЕСТОВЫЕ ЗАКАЗЫ
-- =============================================

-- Создаем тестовый заказ для демонстрации
INSERT INTO orders (
  order_number, user_id, status, payment_status, delivery_type,
  subtotal, shipping_cost, total_amount, prepaid_amount, remaining_amount,
  payment_deadline, notes
) VALUES
('ORD20250920000001', 1, 'pending_payment', 'pending', 'delivery',
89990.00, 500.00, 90490.00, 9049.00, 81441.00,
DATE_ADD(NOW(), INTERVAL 30 MINUTE), 'Тестовый заказ iPhone 15 Pro');

-- Добавляем позицию заказа
INSERT INTO order_items (
  order_id, product_id, product_name_ru, product_name_en,
  quantity, unit_price, total_price
) VALUES
(1, 1, 'iPhone 15 Pro', 'iPhone 15 Pro', 1, 89990.00, 89990.00);

-- =============================================
-- ТЕСТОВЫЕ БОНУСЫ
-- =============================================

INSERT INTO bonus_transactions (
  user_id, transaction_type, amount, description_ru, description_en,
  expires_at
) VALUES
(1, 'earned', 500, 'Бонусы за регистрацию', 'Registration bonus', DATE_ADD(NOW(), INTERVAL 365 DAY)),
(1, 'earned', 1200, 'Бонусы за покупку iPhone', 'iPhone purchase bonus', DATE_ADD(NOW(), INTERVAL 365 DAY)),
(2, 'earned', 300, 'Бонусы за регистрацию', 'Registration bonus', DATE_ADD(NOW(), INTERVAL 365 DAY));

-- =============================================
-- ТЕСТОВЫЕ ДАННЫЕ В КОРЗИНЕ
-- =============================================

INSERT INTO cart_items (user_id, product_id, quantity, price) VALUES
(2, 2, 1, 74990.00), -- Samsung Galaxy S24 в корзине у Марии
(2, 5, 1, 24990.00), -- AirPods Pro в корзине у Марии  
(3, 3, 1, 54990.00); -- Xiaomi 14 в корзине у John

-- =============================================
-- ИЗБРАННОЕ И СРАВНЕНИЕ
-- =============================================

INSERT INTO wishlist_items (user_id, product_id) VALUES
(1, 2), -- Иван добавил Samsung в избранное
(1, 3), -- Иван добавил Xiaomi в избранное
(2, 1), -- Мария добавила iPhone в избранное
(2, 4); -- Мария добавила iPad в избранное

INSERT INTO product_comparisons (user_id, product_id) VALUES
(1, 1), -- Иван сравнивает iPhone
(1, 2), -- Иван сравнивает Samsung
(1, 3); -- Иван сравнивает Xiaomi

-- =============================================
-- ТЕСТОВЫЕ ОТЗЫВЫ
-- =============================================

INSERT INTO product_reviews (
  product_id, user_id, rating, title_ru, title_en, 
  content_ru, content_en, pros_ru, pros_en, cons_ru, cons_en,
  is_verified_purchase, is_approved
) VALUES
(1, 2, 5, 'Отличный телефон!', 'Great phone!',
'iPhone 15 Pro превзошел все ожидания. Камера просто супер, а производительность на высоте.',
'iPhone 15 Pro exceeded all expectations. Camera is amazing and performance is top notch.',
'Отличная камера, быстрая работа, премиальные материалы', 'Great camera, fast performance, premium materials',
'Высокая цена', 'High price', true, true),

(2, 1, 4, 'Хороший Android', 'Good Android',
'Samsung Galaxy S24 - отличный выбор для Android пользователей. AI функции впечатляют.',
'Samsung Galaxy S24 is great choice for Android users. AI features are impressive.',
'AI функции, хорошая камера, быстрая зарядка', 'AI features, good camera, fast charging',
'Иногда нагревается', 'Sometimes gets warm', true, true),

(3, 3, 5, 'Лучшее соотношение цена/качество', 'Best price/quality ratio',
'Xiaomi 14 - просто бомба за свои деньги! Все работает отлично.',
'Xiaomi 14 is amazing for the price! Everything works perfectly.',
'Отличная цена, хорошая производительность, качественная сборка', 'Great price, good performance, quality build',
'MIUI не всем нравится', 'MIUI not for everyone', false, true);

-- =============================================
-- ПОЛЕЗНОСТЬ ОТЗЫВОВ
-- =============================================

INSERT INTO review_helpfulness (review_id, user_id, is_helpful) VALUES
(1, 1, true),  -- Иван считает отзыв о iPhone полезным
(1, 3, true),  -- John тоже считает полезным
(2, 2, true),  -- Мария считает отзыв о Samsung полезным
(3, 1, true),  -- Иван считает отзыв о Xiaomi полезным
(3, 2, true);  -- Мария тоже считает полезным

-- Обновляем счетчики полезности
UPDATE product_reviews SET helpful_count = (
  SELECT COUNT(*) FROM review_helpfulness 
  WHERE review_id = product_reviews.id AND is_helpful = true
);

-- =============================================
-- ИНФОРМАЦИЯ О ВСТАВЛЕННЫХ ДАННЫХ
-- =============================================

SELECT 'Тестовые данные успешно добавлены!' as message;
SELECT 
  (SELECT COUNT(*) FROM users) as users_count,
  (SELECT COUNT(*) FROM categories) as categories_count,
  (SELECT COUNT(*) FROM brands) as brands_count,
  (SELECT COUNT(*) FROM products) as products_count,
  (SELECT COUNT(*) FROM banks) as banks_count,
  (SELECT COUNT(*) FROM promo_codes) as promo_codes_count,
  (SELECT COUNT(*) FROM orders) as orders_count,
  (SELECT COUNT(*) FROM cart_items) as cart_items_count,
  (SELECT COUNT(*) FROM wishlist_items) as wishlist_count,
  (SELECT COUNT(*) FROM product_reviews) as reviews_count;
