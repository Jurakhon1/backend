# Установка тестовых данных для изображений телефонов

## Пошаговая инструкция

### 1. Создание таблиц (если не существуют)
Выполните SQL скрипт для создания необходимых таблиц:
```sql
-- Выполните содержимое файла create-product-variants-table.sql
```

### 2. Создание тестовых категорий и брендов
```sql
-- Создаем категорию "Смартфоны"
INSERT IGNORE INTO categories (id, name_ru, name_en, slug) VALUES
(1, 'Смартфоны', 'Smartphones', 'smartphones');

-- Создаем бренды
INSERT IGNORE INTO brands (id, name, slug) VALUES
(1, 'Apple', 'apple'),
(2, 'Samsung', 'samsung'),
(3, 'Google', 'google');
```

### 3. Выполнение основного скрипта
Выполните содержимое файла `test-phone-images.sql`

### 4. Создание папки для изображений
```bash
mkdir -p uploads/phones
```

### 5. Загрузка тестовых изображений
Поместите тестовые изображения в папку `uploads/phones/` согласно структуре из `README_TEST_IMAGES.md`

## Структура файлов изображений

### iPhone 15 Pro
- `iphone-15-pro-blue-main.jpg` - основной синий
- `iphone-15-pro-blue-thumb.jpg` - миниатюра синий
- `iphone-15-pro-blue-1.jpg`, `iphone-15-pro-blue-2.jpg`, `iphone-15-pro-blue-3.jpg` - галерея синий

- `iphone-15-pro-white-main.jpg` - основной белый
- `iphone-15-pro-white-thumb.jpg` - миниатюра белый
- `iphone-15-pro-white-1.jpg`, `iphone-15-pro-white-2.jpg`, `iphone-15-pro-white-3.jpg` - галерея белый

- `iphone-15-pro-black-main.jpg` - основной черный
- `iphone-15-pro-black-thumb.jpg` - миниатюра черный
- `iphone-15-pro-black-1.jpg`, `iphone-15-pro-black-2.jpg`, `iphone-15-pro-black-3.jpg` - галерея черный

- `iphone-15-pro-natural-main.jpg` - основной природный
- `iphone-15-pro-natural-thumb.jpg` - миниатюра природный
- `iphone-15-pro-natural-1.jpg`, `iphone-15-pro-natural-2.jpg`, `iphone-15-pro-natural-3.jpg` - галерея природный

### Samsung Galaxy S24
- `samsung-s24-black-main.jpg` - основной черный
- `samsung-s24-gray-main.jpg` - основной серый
- `samsung-s24-violet-main.jpg` - основной фиолетовый
- `samsung-s24-yellow-main.jpg` - основной желтый

### Google Pixel 8
- `pixel-8-black-main.jpg` - основной черный
- `pixel-8-brown-main.jpg` - основной коричневый
- `pixel-8-pink-main.jpg` - основной розовый
- `pixel-8-mint-main.jpg` - основной мятный

## Проверка установки

После выполнения всех шагов проверьте:

1. **В базе данных:**
   ```sql
   SELECT COUNT(*) FROM products; -- должно быть 3
   SELECT COUNT(*) FROM product_variants; -- должно быть 12
   SELECT COUNT(*) FROM product_color_images; -- должно быть 12
   SELECT COUNT(*) FROM product_images; -- должно быть 3
   ```

2. **В приложении:**
   - Откройте каталог товаров
   - Выберите любой из тестовых телефонов
   - Проверьте переключение цветов
   - Добавьте товар в корзину и проверьте отображение изображения

## Устранение проблем

### Ошибка "Неизвестный столбец"
Если получаете ошибки о неизвестных столбцах, убедитесь что:
1. Выполнили `create-product-variants-table.sql`
2. Используете правильные имена столбцов (camelCase, не snake_case)

### Изображения не отображаются
1. Проверьте что файлы загружены в `uploads/phones/`
2. Убедитесь что пути в базе данных соответствуют реальным файлам
3. Проверьте права доступа к папке `uploads/`

### Ошибки в консоли
Проверьте что:
1. Backend сервер запущен
2. Статические файлы обслуживаются корректно
3. CORS настроен правильно
