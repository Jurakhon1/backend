const axios = require('axios');

async function debugAPI() {
  try {
    console.log('🔍 Диагностика API...\n');

    // Тест 1: Проверим, что продукты загружаются
    console.log('📱 Тест 1: Получение продуктов...');
    const products = await axios.get('http://localhost:3000/products');
    console.log('✅ Продукты:', products.data.length, 'шт.');

    if (products.data.length > 0) {
      const product = products.data[0];
      console.log('  - ID:', product.id);
      console.log('  - Название:', product.name?.ru || product.name_ru);

      // Тест 2: Проверим, есть ли варианты у продукта
      console.log('\n🎨 Тест 2: Проверка вариантов продукта...');
      if (product.variants && product.variants.length > 0) {
        console.log('✅ Варианты найдены:', product.variants.length);
        product.variants.forEach((variant, i) => {
          console.log(
            `  - ${i + 1}. ${variant.variantName?.ru || variant.variantNameRu} (${variant.variantType})`,
          );
        });
      } else {
        console.log('❌ Варианты не найдены');
      }

      // Тест 3: Попробуем наш новый эндпоинт
      console.log('\n🚀 Тест 3: Тестирование нового эндпоинта...');
      try {
        const colors = await axios.get(
          `http://localhost:3000/products/${product.id}/colors-fast`,
        );
        console.log('✅ Эндпоинт работает!');
        console.log('  - Цвета:', colors.data.colors?.length || 0);
      } catch (error) {
        console.log(
          '❌ Ошибка в эндпоинте:',
          error.response?.data || error.message,
        );
      }
    }
  } catch (error) {
    console.error('❌ Критическая ошибка:', error.message);
  }
}

debugAPI();
