const axios = require('axios');

async function testPublicAPI() {
  try {
    console.log('🔍 Тестирование публичных эндпоинтов...\n');

    // Тест 1: Получение всех продуктов
    console.log('📱 Тест 1: Получение всех продуктов...');
    const response1 = await axios.get('http://localhost:3000/products');
    console.log('✅ Продукты получены:', response1.data.length, 'шт.');

    if (response1.data.length > 0) {
      const firstProduct = response1.data[0];
      console.log(
        '  - Первый продукт:',
        firstProduct.name?.ru || firstProduct.name_ru,
      );

      // Тест 2: Быстрое получение цветов
      console.log('\n🎨 Тест 2: Быстрое получение цветов...');
      const response2 = await axios.get(
        `http://localhost:3000/products/${firstProduct.id}/colors-fast`,
      );
      console.log('✅ Цвета получены:');
      console.log(
        '  - Продукт:',
        response2.data.name?.ru || response2.data.name,
      );
      console.log('  - Количество цветов:', response2.data.colors?.length || 0);

      if (response2.data.colors && response2.data.colors.length > 0) {
        console.log(
          '  - Первый цвет:',
          response2.data.colors[0].name?.ru || response2.data.colors[0].name,
        );

        // Тест 3: Изображения конкретного цвета
        console.log('\n📸 Тест 3: Изображения конкретного цвета...');
        const colorId = response2.data.colors[0].id;
        const response3 = await axios.get(
          `http://localhost:3000/products/${firstProduct.id}/color/${colorId}/images`,
        );
        console.log('✅ Изображения получены:');
        console.log(
          '  - Основное изображение:',
          response3.data.primaryImage ? '✅' : '❌',
        );
        console.log(
          '  - Галерея:',
          response3.data.gallery?.length || 0,
          'изображений',
        );
      }
    }

    console.log('\n🎉 Все тесты прошли успешно!');
  } catch (error) {
    console.error('❌ Ошибка:', error.response?.data || error.message);
  }
}

testPublicAPI();
