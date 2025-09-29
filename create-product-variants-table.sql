-- Создание таблицы product_variants если она не существует
CREATE TABLE IF NOT EXISTS product_variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    variantNameRu VARCHAR(255) NOT NULL,
    variantNameEn VARCHAR(255) NOT NULL,
    variantType ENUM('color', 'memory', 'storage', 'size', 'other') NOT NULL,
    variantValueRu VARCHAR(255) NOT NULL,
    variantValueEn VARCHAR(255) NOT NULL,
    colorCode VARCHAR(7) NULL,
    priceModifier DECIMAL(10,2) DEFAULT 0,
    stockQuantity INT DEFAULT 0,
    skuSuffix VARCHAR(50) NULL,
    isActive BOOLEAN DEFAULT TRUE,
    sortOrder INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Создание таблицы product_images если она не существует
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    imageUrl VARCHAR(500) NOT NULL,
    altTextRu VARCHAR(255) NULL,
    altTextEn VARCHAR(255) NULL,
    sortOrder INT DEFAULT 0,
    isPrimary BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Создание таблицы product_color_images если она не существует
CREATE TABLE IF NOT EXISTS product_color_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    variant_id INT NOT NULL,
    primary_image_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500) NULL,
    gallery_urls JSON NULL,
    color_code VARCHAR(7) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_variant (product_id, variant_id)
);
