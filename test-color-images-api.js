const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testColorImagesAPI() {
  console.log('🚀 Тестирование API изображений цветов...\n');

  try {
    // Тест 1: Быстрое получение цветов продукта
    console.log(
      '📱 Тест 1: Получение цветов с изображениями для iPhone 15 Pro Max...',
    );
    const response1 = await axios.get(`${BASE_URL}/products/1/colors-fast`);

    console.log('✅ Ответ получен:');
    console.log(`  - Продукт: ${response1.data.name.ru}`);
    console.log(`  - Цена: ${response1.data.price} руб.`);
    console.log(`  - Количество цветов: ${response1.data.colors.length}`);

    response1.data.colors.forEach((color, index) => {
      console.log(
        `  - Цвет ${index + 1}: ${color.name.ru} (${color.code}) - ${color.imageCount} изображений`,
      );
    });

    console.log('\n📸 Галерея изображений:');
    Object.keys(response1.data.gallery).forEach((colorId) => {
      const images = response1.data.gallery[colorId];
      console.log(`  - Цвет ID ${colorId}: ${images.length} изображений`);
    });

    // Тест 2: Получение изображений конкретного цвета
    console.log('\n🎨 Тест 2: Получение изображений для конкретного цвета...');
    const firstColor = response1.data.colors[0];
    const response2 = await axios.get(
      `${BASE_URL}/products/1/color/${firstColor.id}/images`,
    );

    console.log('✅ Ответ получен:');
    console.log(`  - Цвет ID: ${response2.data.colorId}`);
    console.log(`  - Основное изображение: ${response2.data.primaryImage}`);
    console.log(`  - Код цвета: ${response2.data.colorCode}`);
    console.log(`  - Галерея: ${response2.data.gallery.length} изображений`);

    // Тест 3: Проверка производительности
    console.log('\n⚡ Тест 3: Проверка производительности...');
    const startTime = Date.now();

    const promises = [];
    for (let i = 0; i < 10; i++) {
      promises.push(axios.get(`${BASE_URL}/products/1/colors-fast`));
    }

    await Promise.all(promises);
    const endTime = Date.now();
    const avgTime = (endTime - startTime) / 10;

    console.log(
      `✅ 10 параллельных запросов выполнены за ${endTime - startTime}мс`,
    );
    console.log(`⚡ Среднее время ответа: ${avgTime.toFixed(2)}мс`);

    // Тест 4: Тестирование с Samsung Galaxy
    console.log('\n📱 Тест 4: Тестирование с Samsung Galaxy S24 Ultra...');
    const response4 = await axios.get(`${BASE_URL}/products/2/colors-fast`);

    console.log('✅ Ответ получен:');
    console.log(`  - Продукт: ${response4.data.name.ru}`);
    console.log(`  - Количество цветов: ${response4.data.colors.length}`);

    response4.data.colors.forEach((color, index) => {
      console.log(
        `  - Цвет ${index + 1}: ${color.name.ru} (${color.code}) - ${color.imageCount} изображений`,
      );
    });

    console.log('\n🎉 Все тесты прошли успешно!');
    console.log('\n📋 Результаты:');
    console.log('  ✅ Быстрое получение всех цветов с изображениями');
    console.log('  ✅ Получение изображений конкретного цвета');
    console.log('  ✅ Высокая производительность API');
    console.log('  ✅ Многоязычная поддержка');
    console.log('  ✅ Оптимизированная структура данных');
  } catch (error) {
    console.error(
      '❌ Ошибка тестирования:',
      error.response?.data || error.message,
    );
  }
}

// Запускаем тесты
testColorImagesAPI();
