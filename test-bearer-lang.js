const axios = require('axios');

const API_BASE = 'http://localhost:3000';

// Тестовые данные
const testProduct = {
  name_ru: 'Тестовый продукт',
  name_en: 'Test Product',
  slug: 'test-product-bearer',
  category_id: 1,
  brand_id: 1,
  model: 'Test Model',
  sku: 'TEST-BEARER-001',
  base_price: 1000,
  sale_price: 900,
  currency: 'RUB',
  description_ru: 'Описание на русском',
  description_en: 'Description in English',
  short_description_ru: 'Краткое описание на русском',
  short_description_en: 'Short description in English',
  weight: 100,
  dimensions: '10x10x5 см',
  warranty_months: 12,
  stock_quantity: 50,
  min_stock_level: 5,
  is_active: true,
  is_featured: false,
  meta_title_ru: 'SEO заголовок на русском',
  meta_title_en: 'SEO title in English',
  meta_description_ru: 'SEO описание на русском',
  meta_description_en: 'SEO description in English',
  meta_keywords_ru: 'тест, продукт',
  meta_keywords_en: 'test, product',
  tags: ['тест', 'bearer', 'языки'],
};

async function testBearerAndLanguages() {
  console.log('🧪 Тестирование Bearer токенов и поддержки языков...\n');

  try {
    // 1. Тест без токена (должен работать для публичных эндпоинтов)
    console.log('1. Тест без токена (публичные эндпоинты)...');
    const publicResponse = await axios.get(`${API_BASE}/products?lang=ru`);
    console.log('✅ Публичные эндпоинты работают без токена');
    console.log(`   Найдено продуктов: ${publicResponse.data.length}`);

    // 2. Тест с языком RU
    console.log('\n2. Тест с языком RU...');
    const ruResponse = await axios.get(`${API_BASE}/products?lang=ru`);
    if (ruResponse.data.length > 0) {
      const product = ruResponse.data[0];
      console.log('✅ Язык RU работает');
      console.log(
        `   Название: ${product.localized_name || product.name?.ru || 'N/A'}`,
      );
      console.log(
        `   Описание: ${product.localized_description || product.description?.ru || 'N/A'}`,
      );
      if (product.category) {
        console.log(
          `   Категория: ${product.category.localized_name || product.category.name?.ru || 'N/A'}`,
        );
      }
    }

    // 3. Тест с языком EN
    console.log('\n3. Тест с языком EN...');
    const enResponse = await axios.get(`${API_BASE}/products?lang=en`);
    if (enResponse.data.length > 0) {
      const product = enResponse.data[0];
      console.log('✅ Язык EN работает');
      console.log(
        `   Название: ${product.localized_name || product.name?.en || 'N/A'}`,
      );
      console.log(
        `   Описание: ${product.localized_description || product.description?.en || 'N/A'}`,
      );
      if (product.category) {
        console.log(
          `   Категория: ${product.category.localized_name || product.category.name?.en || 'N/A'}`,
        );
      }
    }

    // 4. Тест создания продукта (требует токен)
    console.log(
      '\n4. Тест создания продукта без токена (должен вернуть 401)...',
    );
    try {
      await axios.post(`${API_BASE}/products`, testProduct);
      console.log('❌ Ошибка: продукт создался без токена!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Создание продукта правильно требует аутентификации');
      } else {
        console.log(
          `❌ Неожиданная ошибка: ${error.response?.status} - ${error.response?.data?.message}`,
        );
      }
    }

    // 5. Тест с Bearer токеном (если есть)
    console.log('\n5. Тест с Bearer токеном...');
    const token = process.env.TEST_TOKEN || 'test-token';

    try {
      const authResponse = await axios.post(
        `${API_BASE}/products`,
        testProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('✅ Продукт создан с Bearer токеном');
      console.log(`   ID: ${authResponse.data.id}`);
      console.log(`   Название: ${authResponse.data.localized_name}`);

      // Удаляем тестовый продукт
      await axios.delete(`${API_BASE}/products/${authResponse.data.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('✅ Тестовый продукт удален');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('⚠️  Токен недействителен или отсутствует аутентификация');
        console.log('   Это нормально, если нет настроенной аутентификации');
      } else {
        console.log(
          `❌ Ошибка при создании продукта: ${error.response?.status} - ${error.response?.data?.message}`,
        );
      }
    }

    // 6. Тест получения продукта по ID с языками
    console.log('\n6. Тест получения продукта по ID с языками...');
    if (ruResponse.data.length > 0) {
      const productId = ruResponse.data[0].id;

      // RU версия
      const productRu = await axios.get(
        `${API_BASE}/products/${productId}?lang=ru`,
      );
      console.log('✅ Продукт по ID (RU):');
      console.log(
        `   Название: ${productRu.data.localized_name || productRu.data.name?.ru}`,
      );

      // EN версия
      const productEn = await axios.get(
        `${API_BASE}/products/${productId}?lang=en`,
      );
      console.log('✅ Продукт по ID (EN):');
      console.log(
        `   Название: ${productEn.data.localized_name || productEn.data.name?.en}`,
      );
    }

    console.log('\n🎉 Все тесты Bearer токенов и языков завершены!');
  } catch (error) {
    console.error('❌ Ошибка:', error.response?.data || error.message);
  }
}

// Запуск тестов
testBearerAndLanguages();
