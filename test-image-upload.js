const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:3000';

async function testImageUpload() {
  try {
    console.log('🧪 Тестирование загрузки изображений...\n');

    // 1. Создаем тестовый продукт
    console.log('1. Создание тестового продукта...');
    const productData = {
      name_ru: 'iPhone 15 Pro Test',
      name_en: 'iPhone 15 Pro Test',
      slug: 'iphone-15-pro-test',
      category_id: 1,
      brand_id: 1,
      sku: 'IPHONE-15-PRO-TEST-001',
      base_price: 99999,
      description_ru: 'Тестовый продукт для проверки загрузки изображений',
      description_en: 'Test product for image upload testing',
      is_active: true,
      stock_quantity: 10,
    };

    const productResponse = await axios.post(
      `${API_BASE_URL}/products`,
      productData,
    );
    const productId = productResponse.data.id;
    console.log(`✅ Продукт создан с ID: ${productId}`);

    // 2. Создаем цветовой вариант
    console.log('\n2. Создание цветового варианта...');
    const variantData = {
      name: 'Черный',
      colorCode: '#000000',
      price_adjustment: 0,
      stock_quantity: 5,
      is_active: true,
    };

    const variantResponse = await axios.post(
      `${API_BASE_URL}/products/${productId}/variants`,
      variantData,
    );
    const variantId = variantResponse.data.id;
    console.log(`✅ Вариант создан с ID: ${variantId}`);

    // 3. Загружаем изображение
    console.log('\n3. Загрузка изображения...');

    // Используем существующее тестовое изображение
    const imagePath = path.join(
      __dirname,
      'uploads',
      'phones',
      'test-image.jpg',
    );

    if (!fs.existsSync(imagePath)) {
      console.log('❌ Тестовое изображение не найдено:', imagePath);
      return;
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));

    const uploadResponse = await axios.post(
      `${API_BASE_URL}/products/${productId}/color-images/upload?colorId=${variantId}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      },
    );

    console.log('✅ Изображение загружено успешно!');
    console.log('📸 URL изображения:', uploadResponse.data.primary_image_url);
    console.log('🖼️ URL миниатюры:', uploadResponse.data.thumbnail_url);

    // 4. Получаем быстрые цвета
    console.log('\n4. Получение быстрых цветов...');
    const colorsResponse = await axios.get(
      `${API_BASE_URL}/products/${productId}/colors-fast`,
    );
    console.log(
      '✅ Цвета получены:',
      colorsResponse.data.colors.length,
      'цветов',
    );

    // 5. Получаем изображения конкретного цвета
    console.log('\n5. Получение изображений цвета...');
    const colorImagesResponse = await axios.get(
      `${API_BASE_URL}/products/${productId}/color/${variantId}/images`,
    );
    console.log('✅ Изображения цвета получены:', colorImagesResponse.data);

    console.log('\n🎉 Все тесты прошли успешно!');
  } catch (error) {
    console.error(
      '❌ Ошибка при тестировании:',
      error.response?.data || error.message,
    );
  }
}

// Запускаем тест
testImageUpload();

