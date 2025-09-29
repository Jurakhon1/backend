const axios = require('axios');

async function testSwagger() {
  try {
    console.log('🔍 Проверка Swagger документации...');
    const response = await axios.get('http://localhost:3000/api');
    console.log('✅ Swagger доступен:', response.status);

    // Проверим, есть ли наши новые эндпоинты в документации
    if (response.data.includes('colors-fast')) {
      console.log('✅ Эндпоинт colors-fast найден в документации');
    } else {
      console.log('❌ Эндпоинт colors-fast не найден в документации');
    }

    if (response.data.includes('color/:colorId/images')) {
      console.log('✅ Эндпоинт color/:colorId/images найден в документации');
    } else {
      console.log('❌ Эндпоинт color/:colorId/images не найден в документации');
    }
  } catch (error) {
    console.log('❌ Swagger недоступен:', error.message);
  }
}

testSwagger();
