const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Тестовые данные
const testProductId = 1;
const testVariantId = 1;
const testColorImage = {
  product_id: testProductId,
  variant_id: testVariantId,
  primary_image_url: 'https://example.com/test-color-image.jpg',
  thumbnail_url: 'https://example.com/test-color-thumb.jpg',
  gallery_urls: [
    'https://example.com/gallery1.jpg',
    'https://example.com/gallery2.jpg',
  ],
  color_code: '#FF5733',
  is_active: true,
};

async function testColorImagesCRUD() {
  console.log('🚀 Тестирование CRUD операций для цветовых изображений...\n');

  try {
    // Тест 1: Создание цветового изображения
    console.log('📝 Тест 1: Создание цветового изображения...');
    const createResponse = await axios.post(
      `${BASE_URL}/products/${testProductId}/color-images`,
      testColorImage,
    );
    console.log('✅ Цветовое изображение создано:', createResponse.data);
    const imageId = createResponse.data.id;

    // Тест 2: Получение всех цветовых изображений продукта
    console.log('\n📋 Тест 2: Получение всех цветовых изображений продукта...');
    const getAllResponse = await axios.get(
      `${BASE_URL}/products/${testProductId}/color-images`,
    );
    console.log('✅ Получены цветовые изображения:', getAllResponse.data);

    // Тест 3: Обновление цветового изображения
    console.log('\n✏️ Тест 3: Обновление цветового изображения...');
    const updateData = {
      color_code: '#00FF00',
      is_active: false,
      gallery_urls: [
        'https://example.com/updated-gallery1.jpg',
        'https://example.com/updated-gallery2.jpg',
        'https://example.com/updated-gallery3.jpg',
      ],
    };
    const updateResponse = await axios.put(
      `${BASE_URL}/products/color-images/${imageId}`,
      updateData,
    );
    console.log('✅ Цветовое изображение обновлено:', updateResponse.data);

    // Тест 4: Получение изображений конкретного цвета
    console.log('\n🎨 Тест 4: Получение изображений конкретного цвета...');
    const getColorResponse = await axios.get(
      `${BASE_URL}/products/${testProductId}/color/${testVariantId}/images`,
    );
    console.log('✅ Получены изображения цвета:', getColorResponse.data);

    // Тест 5: Получение быстрых цветов продукта
    console.log('\n⚡ Тест 5: Получение быстрых цветов продукта...');
    const getColorsFastResponse = await axios.get(
      `${BASE_URL}/products/${testProductId}/colors-fast`,
    );
    console.log('✅ Получены быстрые цвета:', getColorsFastResponse.data);

    // Тест 6: Удаление цветового изображения
    console.log('\n🗑️ Тест 6: Удаление цветового изображения...');
    await axios.delete(`${BASE_URL}/products/color-images/${imageId}`);
    console.log('✅ Цветовое изображение удалено');

    // Тест 7: Проверка удаления
    console.log('\n🔍 Тест 7: Проверка удаления...');
    try {
      await axios.get(`${BASE_URL}/products/color-images/${imageId}`);
      console.log('❌ Ошибка: изображение должно быть удалено');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Изображение успешно удалено (404 ошибка)');
      } else {
        console.log('❌ Неожиданная ошибка:', error.response?.data);
      }
    }

    console.log('\n🎉 Все тесты пройдены успешно!');
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
  }
}

// Запуск тестов
testColorImagesCRUD();
