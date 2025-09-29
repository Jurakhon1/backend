# Тестовые изображения телефонов

## Описание
Этот набор тестовых изображений предназначен для демонстрации системы цветов и изображений в карточках товаров.

## Структура изображений

### iPhone 15 Pro
- **Титан синий** (`#4A90E2`)
  - `iphone-15-pro-blue-main.jpg` - основное изображение
  - `iphone-15-pro-blue-thumb.jpg` - миниатюра
  - `iphone-15-pro-blue-1.jpg`, `iphone-15-pro-blue-2.jpg`, `iphone-15-pro-blue-3.jpg` - галерея

- **Титан белый** (`#F5F5F5`)
  - `iphone-15-pro-white-main.jpg` - основное изображение
  - `iphone-15-pro-white-thumb.jpg` - миниатюра
  - `iphone-15-pro-white-1.jpg`, `iphone-15-pro-white-2.jpg`, `iphone-15-pro-white-3.jpg` - галерея

- **Титан черный** (`#2C2C2C`)
  - `iphone-15-pro-black-main.jpg` - основное изображение
  - `iphone-15-pro-black-thumb.jpg` - миниатюра
  - `iphone-15-pro-black-1.jpg`, `iphone-15-pro-black-2.jpg`, `iphone-15-pro-black-3.jpg` - галерея

- **Титан природный** (`#D4C4A8`)
  - `iphone-15-pro-natural-main.jpg` - основное изображение
  - `iphone-15-pro-natural-thumb.jpg` - миниатюра
  - `iphone-15-pro-natural-1.jpg`, `iphone-15-pro-natural-2.jpg`, `iphone-15-pro-natural-3.jpg` - галерея

### Samsung Galaxy S24
- **Оникс черный** (`#1A1A1A`)
  - `samsung-s24-black-main.jpg` - основное изображение
  - `samsung-s24-black-thumb.jpg` - миниатюра
  - `samsung-s24-black-1.jpg`, `samsung-s24-black-2.jpg`, `samsung-s24-black-3.jpg` - галерея

- **Мрамор серый** (`#8E8E93`)
  - `samsung-s24-gray-main.jpg` - основное изображение
  - `samsung-s24-gray-thumb.jpg` - миниатюра
  - `samsung-s24-gray-1.jpg`, `samsung-s24-gray-2.jpg`, `samsung-s24-gray-3.jpg` - галерея

- **Кобальт фиолетовый** (`#5856D6`)
  - `samsung-s24-violet-main.jpg` - основное изображение
  - `samsung-s24-violet-thumb.jpg` - миниатюра
  - `samsung-s24-violet-1.jpg`, `samsung-s24-violet-2.jpg`, `samsung-s24-violet-3.jpg` - галерея

- **Янтарный желтый** (`#FF9500`)
  - `samsung-s24-yellow-main.jpg` - основное изображение
  - `samsung-s24-yellow-thumb.jpg` - миниатюра
  - `samsung-s24-yellow-1.jpg`, `samsung-s24-yellow-2.jpg`, `samsung-s24-yellow-3.jpg` - галерея

### Google Pixel 8
- **Обсидиан черный** (`#000000`)
  - `pixel-8-black-main.jpg` - основное изображение
  - `pixel-8-black-thumb.jpg` - миниатюра
  - `pixel-8-black-1.jpg`, `pixel-8-black-2.jpg`, `pixel-8-black-3.jpg` - галерея

- **Хейзел коричневый** (`#8B4513`)
  - `pixel-8-brown-main.jpg` - основное изображение
  - `pixel-8-brown-thumb.jpg` - миниатюра
  - `pixel-8-brown-1.jpg`, `pixel-8-brown-2.jpg`, `pixel-8-brown-3.jpg` - галерея

- **Роза розовый** (`#FF69B4`)
  - `pixel-8-pink-main.jpg` - основное изображение
  - `pixel-8-pink-thumb.jpg` - миниатюра
  - `pixel-8-pink-1.jpg`, `pixel-8-pink-2.jpg`, `pixel-8-pink-3.jpg` - галерея

- **Мятный зеленый** (`#98FB98`)
  - `pixel-8-mint-main.jpg` - основное изображение
  - `pixel-8-mint-thumb.jpg` - миниатюра
  - `pixel-8-mint-1.jpg`, `pixel-8-mint-2.jpg`, `pixel-8-mint-3.jpg` - галерея

## Рекомендации по изображениям

### Технические требования:
- **Формат**: JPEG или PNG
- **Размер**: минимум 800x800 пикселей
- **Качество**: высокое разрешение для четкого отображения
- **Фон**: белый или прозрачный для лучшей интеграции

### Содержание изображений:
- Телефон должен быть в центре кадра
- Хорошее освещение без теней
- Показывать все стороны телефона (передняя, задняя, боковые)
- Для галереи: разные углы и детали

### Источники изображений:
1. **Официальные сайты производителей** (Apple, Samsung, Google)
2. **Стоковые фото** (Unsplash, Pexels, Pixabay)
3. **Обзоры техники** (с разрешением)
4. **Генераторы мокапов** (Placeholder.com, Mockup World)

## Установка

1. Создайте папку `uploads/phones/` в корне проекта
2. Загрузите все изображения в эту папку
3. Выполните SQL скрипт `test-phone-images.sql`
4. Проверьте отображение в приложении

## Тестирование

После добавления изображений проверьте:
- [ ] Отображение основного изображения в карточке товара
- [ ] Переключение цветов в селекторе
- [ ] Изменение изображения при выборе цвета
- [ ] Отображение изображений в корзине
- [ ] Галерея изображений в деталях товара
