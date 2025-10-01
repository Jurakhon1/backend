-- Создание оптимизированной таблицы для быстрого доступа к изображениям цветов
CREATE TABLE IF NOT EXISTS product_color_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  variant_id INT NOT NULL,
  primary_image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  gallery_urls JSON,
  color_code VARCHAR(7),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_product_variant (product_id, variant_id),
  INDEX idx_product_variant (product_id, variant_id),
  INDEX idx_active (is_active),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
);

-- Добавление тестовых данных для iPhone 15 Pro Max
INSERT INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code) VALUES
(1, 1, 'https://cdn.example.com/iphone-15-pro-max-natural-titanium-primary.jpg', 'https://cdn.example.com/iphone-15-pro-max-natural-titanium-thumb.jpg', 
 '["https://cdn.example.com/natural-1.jpg","https://cdn.example.com/natural-2.jpg","https://cdn.example.com/natural-3.jpg","https://cdn.example.com/natural-4.jpg","https://cdn.example.com/natural-5.jpg"]', '#E5E5E7'),

(1, 2, 'https://cdn.example.com/iphone-15-pro-max-blue-titanium-primary.jpg', 'https://cdn.example.com/iphone-15-pro-max-blue-titanium-thumb.jpg',
 '["https://cdn.example.com/blue-1.jpg","https://cdn.example.com/blue-2.jpg","https://cdn.example.com/blue-3.jpg","https://cdn.example.com/blue-4.jpg"]', '#5E6B73'),

(1, 3, 'https://cdn.example.com/iphone-15-pro-max-white-titanium-primary.jpg', 'https://cdn.example.com/iphone-15-pro-max-white-titanium-thumb.jpg',
 '["https://cdn.example.com/white-1.jpg","https://cdn.example.com/white-2.jpg","https://cdn.example.com/white-3.jpg"]', '#F5F5DC'),

(1, 4, 'https://cdn.example.com/iphone-15-pro-max-black-titanium-primary.jpg', 'https://cdn.example.com/iphone-15-pro-max-black-titanium-thumb.jpg',
 '["https://cdn.example.com/black-1.jpg","https://cdn.example.com/black-2.jpg","https://cdn.example.com/black-3.jpg"]', '#1C1C1E');

-- Добавление данных для Samsung Galaxy S24 Ultra
INSERT INTO product_color_images (product_id, variant_id, primary_image_url, thumbnail_url, gallery_urls, color_code) VALUES
(2, 5, 'https://cdn.example.com/samsung-galaxy-s24-ultra-titanium-gray-primary.jpg', 'https://cdn.example.com/samsung-galaxy-s24-ultra-titanium-gray-thumb.jpg',
 '["https://cdn.example.com/gray-1.jpg","https://cdn.example.com/gray-2.jpg","https://cdn.example.com/gray-3.jpg","https://cdn.example.com/gray-4.jpg"]', '#8E8E93'),

(2, 6, 'https://cdn.example.com/samsung-galaxy-s24-ultra-titanium-black-primary.jpg', 'https://cdn.example.com/samsung-galaxy-s24-ultra-titanium-black-thumb.jpg',
 '["https://cdn.example.com/black-1.jpg","https://cdn.example.com/black-2.jpg","https://cdn.example.com/black-3.jpg"]', '#1C1C1E'),

(2, 7, 'https://cdn.example.com/samsung-galaxy-s24-ultra-titanium-violet-primary.jpg', 'https://cdn.example.com/samsung-galaxy-s24-ultra-titanium-violet-thumb.jpg',
 '["https://cdn.example.com/violet-1.jpg","https://cdn.example.com/violet-2.jpg","https://cdn.example.com/violet-3.jpg","https://cdn.example.com/violet-4.jpg","https://cdn.example.com/violet-5.jpg"]', '#8E44AD'),

(2, 8, 'https://cdn.example.com/samsung-galaxy-s24-ultra-titanium-yellow-primary.jpg', 'https://cdn.example.com/samsung-galaxy-s24-ultra-titanium-yellow-thumb.jpg',
 '["https://cdn.example.com/yellow-1.jpg","https://cdn.example.com/yellow-2.jpg","https://cdn.example.com/yellow-3.jpg"]', '#F1C40F');
