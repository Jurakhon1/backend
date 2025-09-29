const axios = require('axios');

async function simpleTest() {
  try {
    console.log('🔍 Простой тест API...');

    // Тест 1: Проверим корневой эндпоинт
    console.log('📱 Тест 1: Корневой эндпоинт...');
    try {
      const response = await axios.get('http://localhost:3000/');
      console.log('✅ Корневой эндпоинт:', response.status);
    } catch (error) {
      console.log(
        '❌ Корневой эндпоинт:',
        error.response?.status || error.message,
      );
    }

    // Тест 2: Проверим продукты
    console.log('\n📱 Тест 2: Продукты...');
    try {
      const response = await axios.get('http://localhost:3000/products');
      console.log(
        '✅ Продукты:',
        response.status,
        '-',
        response.data.length,
        'шт.',
      );
    } catch (error) {
      console.log('❌ Продукты:', error.response?.status || error.message);
    }

    // Тест 3: Проверим наш новый эндпоинт
    console.log('\n🎨 Тест 3: Цвета продукта...');
    try {
      const response = await axios.get(
        'http://localhost:3000/products/1/colors-fast',
      );
      console.log('✅ Цвета:', response.status);
      console.log('  - Цветов:', response.data.colors?.length || 0);
    } catch (error) {
      console.log('❌ Цвета:', error.response?.status || error.message);
      if (error.response?.data) {
        console.log('  - Детали:', error.response.data);
      }
    }
  } catch (error) {
    console.error('❌ Критическая ошибка:', error.message);
  }
}

simpleTest();
