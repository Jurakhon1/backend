-- =============================================
-- СОЗДАНИЕ БАЗЫ ДАННЫХ ДЛЯ МОБИЛЬНОГО ПРИЛОЖЕНИЯ ПРОДАЖИ ТЕЛЕФОНОВ
-- =============================================

-- Очистка существующих таблиц (если нужно)
-- DROP TABLE IF EXISTS review_helpfulness CASCADE;
-- DROP TABLE IF EXISTS product_reviews CASCADE;
-- DROP TABLE IF EXISTS promo_code_usage CASCADE;
-- DROP TABLE IF EXISTS promo_codes CASCADE;
-- DROP TABLE IF EXISTS bonus_transactions CASCADE;
-- DROP TABLE IF EXISTS product_comparisons CASCADE;
-- DROP TABLE IF EXISTS wishlist_items CASCADE;
-- DROP TABLE IF EXISTS payment_transactions CASCADE;
-- DROP TABLE IF EXISTS banks CASCADE;
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS cart_items CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS brands CASCADE;
-- DROP TABLE IF EXISTS categories CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- =============================================
-- ТАБЛИЦЫ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ
-- =============================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    language_preference VARCHAR(2) DEFAULT 'ru' CHECK (language_preference IN ('ru', 'en')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ТАБЛИЦЫ ДЛЯ ТОВАРОВ И КАТЕГОРИЙ
-- =============================================

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name_ru VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description_ru TEXT,
    description_en TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description_ru TEXT,
    description_en TEXT,
    logo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name_ru VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category_id INTEGER NOT NULL REFERENCES categories(id),
    brand_id INTEGER NOT NULL REFERENCES brands(id),
    base_price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ТАБЛИЦЫ ДЛЯ КОРЗИНЫ И ЗАКАЗОВ
-- =============================================

CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending_payment' CHECK (status IN (
        'pending_payment', 'payment_confirmed', 'processing', 
        'shipped', 'delivered', 'cancelled', 'refunded', 'payment_expired'
    )),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'prepaid', 'paid', 'failed', 'refunded'
    )),
    delivery_type VARCHAR(10) NOT NULL CHECK (delivery_type IN ('delivery', 'pickup')),
    shipping_address JSONB,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    shipping_cost DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    bonus_points_used INTEGER DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    prepaid_amount DECIMAL(10,2) DEFAULT 0,
    remaining_amount DECIMAL(10,2) DEFAULT 0,
    payment_deadline TIMESTAMP,
    notes TEXT,
    tracking_number VARCHAR(100),
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    product_name_ru VARCHAR(255) NOT NULL,
    product_name_en VARCHAR(255) NOT NULL,
    variant_info_ru VARCHAR(500),
    variant_info_en VARCHAR(500),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ТАБЛИЦЫ ДЛЯ СИСТЕМЫ ОПЛАТЫ
-- =============================================

CREATE TABLE IF NOT EXISTS banks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    card_number VARCHAR(20) NOT NULL,
    account_number VARCHAR(50),
    recipient_name VARCHAR(255) NOT NULL,
    recipient_inn VARCHAR(20),
    bank_bik VARCHAR(20),
    bank_name VARCHAR(255) NOT NULL,
    bank_address TEXT,
    payment_instructions_ru TEXT NOT NULL,
    payment_instructions_en TEXT NOT NULL,
    payment_steps_ru JSON,
    payment_steps_en JSON,
    screenshot_urls JSON,
    prepayment_percent DECIMAL(5,2) DEFAULT 10.0,
    payment_timeout_minutes INTEGER DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    bank_id INTEGER NOT NULL REFERENCES banks(id),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN (
        'prepayment', 'full_payment', 'refund'
    )),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'rejected', 'expired'
    )),
    receipt_image_url VARCHAR(500),
    admin_notes TEXT,
    confirmed_by INTEGER,
    confirmed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ТАБЛИЦЫ ДЛЯ ИЗБРАННОГО И СРАВНЕНИЯ
-- =============================================

CREATE TABLE IF NOT EXISTS wishlist_items (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS product_comparisons (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- =============================================
-- ТАБЛИЦЫ ДЛЯ БОНУСНОЙ СИСТЕМЫ
-- =============================================

CREATE TABLE IF NOT EXISTS bonus_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN (
        'earned', 'spent', 'expired', 'refunded'
    )),
    amount INTEGER NOT NULL,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    description_ru VARCHAR(500),
    description_en VARCHAR(500),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ТАБЛИЦЫ ДЛЯ ПРОМОКОДОВ
-- =============================================

CREATE TABLE IF NOT EXISTS promo_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name_ru VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_ru TEXT,
    description_en TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN (
        'percentage', 'fixed_amount', 'free_shipping'
    )),
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount_amount DECIMAL(10,2),
    usage_limit INTEGER,
    usage_limit_per_user INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS promo_code_usage (
    id SERIAL PRIMARY KEY,
    promo_code_id INTEGER NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, promo_code_id, order_id)
);

-- =============================================
-- ТАБЛИЦЫ ДЛЯ ОТЗЫВОВ
-- =============================================

CREATE TABLE IF NOT EXISTS product_reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title_ru VARCHAR(255),
    title_en VARCHAR(255),
    content_ru TEXT,
    content_en TEXT,
    pros_ru TEXT,
    pros_en TEXT,
    cons_ru TEXT,
    cons_en TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS review_helpfulness (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL REFERENCES product_reviews(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, review_id)
);

-- =============================================
-- ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
-- =============================================

-- Пользователи
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Продукты
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_base_price ON products(base_price);

-- Категории и бренды
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_is_active ON brands(is_active);

-- Корзина
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

-- Заказы
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_deadline ON orders(payment_deadline);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Позиции заказов
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Платежи
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_bank_id ON payment_transactions(bank_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_banks_is_active ON banks(is_active);
CREATE INDEX IF NOT EXISTS idx_banks_sort_order ON banks(sort_order);

-- Избранное и сравнение
CREATE INDEX IF NOT EXISTS idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_product_id ON wishlist_items(product_id);
CREATE INDEX IF NOT EXISTS idx_product_comparisons_user_id ON product_comparisons(user_id);
CREATE INDEX IF NOT EXISTS idx_product_comparisons_product_id ON product_comparisons(product_id);

-- Бонусы
CREATE INDEX IF NOT EXISTS idx_bonus_transactions_user_id ON bonus_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bonus_transactions_type ON bonus_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_bonus_transactions_created_at ON bonus_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_bonus_transactions_expires_at ON bonus_transactions(expires_at);

-- Промокоды
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_is_active ON promo_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_codes_valid_from ON promo_codes(valid_from);
CREATE INDEX IF NOT EXISTS idx_promo_codes_valid_until ON promo_codes(valid_until);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_promo_code_id ON promo_code_usage(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_user_id ON promo_code_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_order_id ON promo_code_usage(order_id);

-- Отзывы
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_is_approved ON product_reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_review_helpfulness_review_id ON review_helpfulness(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpfulness_user_id ON review_helpfulness(user_id);

-- =============================================
-- ТРИГГЕРЫ ДЛЯ АВТОМАТИЧЕСКОГО ОБНОВЛЕНИЯ updated_at
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Применяем триггер к таблицам с updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banks_updated_at BEFORE UPDATE ON banks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON payment_transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ФУНКЦИЯ ДЛЯ ГЕНЕРАЦИИ НОМЕРА ЗАКАЗА
-- =============================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    prefix TEXT := 'ORD';
    date_part TEXT;
    sequence_part TEXT;
    counter INTEGER := 1;
    order_number TEXT;
BEGIN
    date_part := TO_CHAR(NOW(), 'YYYYMMDD');
    
    -- Получаем следующий номер в последовательности для сегодняшнего дня
    SELECT COALESCE(MAX(CAST(SUBSTRING(orders.order_number, 12) AS INTEGER)), 0) + 1 
    INTO counter
    FROM orders 
    WHERE orders.order_number LIKE prefix || date_part || '%';
    
    sequence_part := LPAD(counter::TEXT, 6, '0');
    order_number := prefix || date_part || sequence_part;
    
    RETURN order_number;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- ТЕСТОВЫЕ ДАННЫЕ (ОПЦИОНАЛЬНО)
-- =============================================

-- Вставляем тестовые категории
INSERT INTO categories (name_ru, name_en, slug, description_ru, description_en) VALUES
('Смартфоны', 'Smartphones', 'smartphones', 'Мобильные телефоны и смартфоны', 'Mobile phones and smartphones'),
('Планшеты', 'Tablets', 'tablets', 'Планшетные компьютеры', 'Tablet computers'),
('Аксессуары', 'Accessories', 'accessories', 'Аксессуары для мобильных устройств', 'Mobile device accessories')
ON CONFLICT (slug) DO NOTHING;

-- Вставляем тестовые бренды
INSERT INTO brands (name, slug, description_ru, description_en) VALUES
('Apple', 'apple', 'Американская технологическая компания', 'American technology company'),
('Samsung', 'samsung', 'Южнокорейская технологическая компания', 'South Korean technology company'),
('Xiaomi', 'xiaomi', 'Китайская технологическая компания', 'Chinese technology company')
ON CONFLICT (slug) DO NOTHING;

-- Вставляем тестовый банк для оплаты
INSERT INTO banks (
    name, name_en, card_number, recipient_name, bank_name, 
    payment_instructions_ru, payment_instructions_en, sort_order
) VALUES (
    'Сбербанк', 'Sberbank', '5469 3800 1234 5678', 'ООО "Мобильные Технологии"', 
    'ПАО СБЕРБАНК', 
    'Переведите указанную сумму на карту 5469 3800 1234 5678 и загрузите скриншот чека',
    'Transfer the specified amount to card 5469 3800 1234 5678 and upload a screenshot of the receipt',
    1
) ON CONFLICT DO NOTHING;

COMMIT;

-- Информационные сообщения
SELECT 'База данных успешно создана!' as message;
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public';
