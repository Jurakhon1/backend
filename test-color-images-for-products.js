const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Данные о продуктах из JSON
const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max 256GB',
    colorVariants: [
      { id: 1, color: 'Натуральный титан', colorCode: '#E5E5E7' },
      { id: 2, color: 'Синий титан', colorCode: '#5E6B73' },
      { id: 3, color: 'Белый титан', colorCode: '#F5F5DC' },
      { id: 4, color: 'Черный титан', colorCode: '#1C1C1E' },
    ],
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra 512GB',
    colorVariants: [
      { id: 8, color: 'Титан черный', colorCode: '#2C2C2E' },
      { id: 9, color: 'Титан серый', colorCode: '#8E8E93' },
      { id: 10, color: 'Титан фиолетовый', colorCode: '#8E44AD' },
      { id: 11, color: 'Титан желтый', colorCode: '#FFD700' },
    ],
  },
  {
    id: 3,
    name: 'Xiaomi 14 Ultra 1TB',
    colorVariants: [
      { id: 15, color: 'Черный', colorCode: '#000000' },
      { id: 16, color: 'Белый', colorCode: '#FFFFFF' },
      { id: 17, color: 'Зеленый', colorCode: '#00FF7F' },
      { id: 18, color: 'Коричневый', colorCode: '#8B4513' },
    ],
  },
];

// Функция для создания цветового изображения
async function createColorImage(productId, variantId, colorName, colorCode) {
  const colorImageData = {
    product_id: productId,
    variant_id: variantId,
    primary_image_url: `https://via.placeholder.com/400x400${colorCode.replace('#', '')}/FFFFFF?text=${encodeURIComponent(colorName)}`,
    thumbnail_url: `https://via.placeholder.com/200x200${colorCode.replace('#', '')}/FFFFFF?text=${encodeURIComponent(colorName)}`,
    gallery_urls: [
      `https://via.placeholder.com/600x400${colorCode.replace('#', '')}/FFFFFF?text=${encodeURIComponent(colorName)}+1`,
      `https://via.placeholder.com/600x400${colorCode.replace('#', '')}/FFFFFF?text=${encodeURIComponent(colorName)}+2`,
      `https://via.placeholder.com/600x400${colorCode.replace('#', '')}/FFFFFF?text=${encodeURIComponent(colorName)}+3`,
    ],
    color_code: colorCode,
    is_active: true,
  };

  try {
    const response = await axios.post(
      `${BASE_URL}/products/${productId}/color-images`,
      colorImageData,
    );
    return response.data;
  } catch (error) {
    console.error(
      `❌ Ошибка создания цветового изображения для ${colorName}:`,
      error.response?.data || error.message,
    );
    return null;
  }
}

// Основная функция
async function createColorImagesForAllProducts() {
  console.log('🎨 Создание цветовых изображений для всех продуктов...\n');

  for (const product of products) {
    console.log(`📱 Обработка продукта: ${product.name} (ID: ${product.id})`);

    for (const variant of product.colorVariants) {
      console.log(
        `  🎨 Создание изображения для цвета: ${variant.color} (${variant.colorCode})`,
      );

      const result = await createColorImage(
        product.id,
        variant.id,
        variant.color,
        variant.colorCode,
      );

      if (result) {
        console.log(`    ✅ Успешно создано! ID: ${result.id}`);
      } else {
        console.log(`    ❌ Не удалось создать изображение`);
      }

      // Небольшая пауза между запросами
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log(''); // Пустая строка для разделения продуктов
  }

  console.log('🎉 Процесс создания цветовых изображений завершен!');
}

// Функция для проверки созданных изображений
async function checkCreatedImages() {
  console.log('\n🔍 Проверка созданных цветовых изображений...\n');

  for (const product of products) {
    try {
      const response = await axios.get(
        `${BASE_URL}/products/${product.id}/color-images`,
      );
      console.log(`📱 ${product.name}:`);
      console.log(`   Найдено цветовых изображений: ${response.data.length}`);

      response.data.forEach((image, index) => {
        console.log(
          `   ${index + 1}. Цвет: ${image.color_code} | Активно: ${image.is_active}`,
        );
      });
      console.log('');
    } catch (error) {
      console.error(
        `❌ Ошибка получения изображений для ${product.name}:`,
        error.response?.data || error.message,
      );
    }
  }
}

// Запуск скрипта
async function main() {
  try {
    await createColorImagesForAllProducts();
    await checkCreatedImages();
  } catch (error) {
    console.error('❌ Общая ошибка:', error.message);
  }
}

main();
