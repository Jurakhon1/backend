const axios = require('axios');

const API_BASE = 'http://localhost:3000';

// Тестовое Base64 изображение (1x1 пиксель PNG)
const testImageBase64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

async function testBase64Images() {
  console.log('🧪 Тестирование Base64 изображений...\n');

  try {
    // 1. Создание варианта (цвета) продукта
    console.log('1. Создание варианта (цвета) продукта...');
    const variantResponse = await axios.post(
      `${API_BASE}/products/1/variants`,
      {
        product_id: 1,
        name: 'Красный',
        colorCode: '#FF0000',
        colorName: 'red',
        price_adjustment: 0,
        stock_quantity: 50,
        is_active: true,
      },
    );

    console.log('✅ Вариант создан:', variantResponse.data);
    const variantId = variantResponse.data.id;

    // 2. Создание изображения для варианта через Base64
    console.log('\n2. Создание изображения для варианта через Base64...');
    const createResponse = await axios.post(
      `${API_BASE}/products/1/images/base64`,
      {
        product_id: 1,
        variant_id: variantId,
        primary_image_base64: testImageBase64,
        color_code: '#FF0000',
        is_active: true,
      },
    );

    console.log('✅ Изображение создано:', createResponse.data);
    const imageId = createResponse.data.id;

    // 3. Обновление изображения
    console.log('\n3. Обновление изображения...');
    const updateResponse = await axios.put(
      `${API_BASE}/products/images/base64/${imageId}`,
      {
        color_code: '#00FF00',
        is_active: false,
      },
    );

    console.log('✅ Изображение обновлено:', updateResponse.data);

    // 4. Получение всех вариантов продукта
    console.log('\n4. Получение всех вариантов продукта...');
    const variantsResponse = await axios.get(`${API_BASE}/products/1/variants`);

    console.log('✅ Варианты получены:', variantsResponse.data);

    // 5. Получение всех изображений продукта
    console.log('\n5. Получение всех изображений продукта...');
    const imagesResponse = await axios.get(
      `${API_BASE}/products/1/color-images`,
    );

    console.log('✅ Изображения получены:', imagesResponse.data);

    console.log('\n🎉 Все тесты Base64 прошли успешно!');
  } catch (error) {
    console.error('❌ Ошибка:', error.response?.data || error.message);
  }
}

// Запуск тестов
testBase64Images();
