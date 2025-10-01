const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:3000';

async function testImageUpload() {
  try {
    console.log('🧪 Тестирование загрузки изображений...\n');

    // 1. Получаем существующие продукты
    console.log('1. Получение существующих продуктов...');
    const productsResponse = await axios.get(`${API_BASE_URL}/products`);
    const products = productsResponse.data;
    
    if (products.length === 0) {
      console.log('❌ Нет продуктов для тестирования');
      return;
    }

    const product = products[0];
    console.log(`✅ Найден продукт: ${product.localized_name} (ID: ${product.id})`);

    // 2. Получаем варианты продукта
    console.log('\n2. Получение вариантов продукта...');
    const variantsResponse = await axios.get(`${API_BASE_URL}/products/${product.id}/variants`);
    const variants = variantsResponse.data;
    
    if (variants.length === 0) {
      console.log('❌ Нет вариантов для тестирования');
      return;
    }

    const variant = variants[0];
    console.log(`✅ Найден вариант: ${variant.variantValue.ru} (ID: ${variant.id})`);

    // 3. Загружаем изображение
    console.log('\n3. Загрузка изображения...');
    
    // Используем существующее тестовое изображение
    const imagePath = path.join(__dirname, 'uploads', 'phones', 'test-image.jpg');
    
    if (!fs.existsSync(imagePath)) {
      console.log('❌ Тестовое изображение не найдено:', imagePath);
      console.log('📁 Доступные файлы в uploads/phones/:');
      const files = fs.readdirSync(path.join(__dirname, 'uploads', 'phones'));
      files.forEach(file => console.log(`   - ${file}`));
      return;
    }

    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));

    const uploadResponse = await axios.post(
      `${API_BASE_URL}/products/${product.id}/color-images/upload?colorId=${variant.id}`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    console.log('✅ Изображение загружено успешно!');
    console.log('📸 URL изображения:', uploadResponse.data.primary_image_url);
    console.log('🖼️ URL миниатюры:', uploadResponse.data.thumbnail_url);

    // 4. Получаем быстрые цвета
    console.log('\n4. Получение быстрых цветов...');
    const colorsResponse = await axios.get(`${API_BASE_URL}/products/${product.id}/colors-fast`);
    console.log('✅ Цвета получены:', colorsResponse.data.colors.length, 'цветов');

    // 5. Получаем изображения конкретного цвета
    console.log('\n5. Получение изображений цвета...');
    const colorImagesResponse = await axios.get(`${API_BASE_URL}/products/${product.id}/color/${variant.id}/images`);
    console.log('✅ Изображения цвета получены:', colorImagesResponse.data);

    console.log('\n🎉 Все тесты прошли успешно!');

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      console.log('💡 Возможно, сервер не запущен. Запустите: npm run start:dev');
    }
  }
}

// Запускаем тест
testImageUpload();

