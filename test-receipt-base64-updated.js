const axios = require('axios');

// Тестовый скрипт для проверки загрузки чека в base64 формате
async function testReceiptBase64Upload() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('🧪 Тестирование загрузки чека в base64 формате...\n');

    // 1. Создаем тестовую транзакцию
    console.log('1. Создание тестовой транзакции...');
    const createTransactionResponse = await axios.post(`${baseUrl}/payment/transactions`, {
      order_id: 1, // Предполагаем, что заказ с ID 1 существует
      bank_id: 1   // Предполагаем, что банк с ID 1 существует
    });
    
    const transactionId = createTransactionResponse.data.id;
    console.log(`✅ Транзакция создана с ID: ${transactionId}\n`);

    // 2. Создаем тестовое base64 изображение (1x1 пиксель PNG)
    const testBase64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    
    // 3. Загружаем чек в base64 формате
    console.log('2. Загрузка чека в base64 формате...');
    const uploadResponse = await axios.post(
      `${baseUrl}/payment/transactions/${transactionId}/upload-receipt-base64`,
      {
        base64_image: testBase64Image,
        file_extension: 'png',
        mime_type: 'image/png'
      }
    );
    
    console.log('✅ Чек успешно загружен в base64 формате');
    console.log('📊 Данные ответа:');
    console.log(`   - ID транзакции: ${uploadResponse.data.id}`);
    console.log(`   - Статус: ${uploadResponse.data.status}`);
    console.log(`   - URL чека: ${uploadResponse.data.receipt_image_url || 'null'}`);
    console.log(`   - Base64 данные: ${uploadResponse.data.receipt_image_base64 ? 'присутствуют' : 'отсутствуют'}`);
    console.log(`   - Размер base64: ${uploadResponse.data.receipt_image_base64 ? uploadResponse.data.receipt_image_base64.length : 0} символов\n`);

    // 4. Проверяем получение транзакции
    console.log('3. Проверка получения данных транзакции...');
    const getTransactionResponse = await axios.get(`${baseUrl}/payment/orders/1/transactions`);
    
    const transaction = getTransactionResponse.data.find(t => t.id === transactionId);
    if (transaction) {
      console.log('✅ Транзакция найдена');
      console.log(`   - Base64 данные сохранены: ${transaction.receipt_image_base64 ? 'да' : 'нет'}`);
      console.log(`   - URL чека: ${transaction.receipt_image_url || 'null'}`);
    } else {
      console.log('❌ Транзакция не найдена');
    }

    console.log('\n🎉 Тест завершен успешно!');

  } catch (error) {
    console.error('❌ Ошибка при тестировании:');
    if (error.response) {
      console.error(`   Статус: ${error.response.status}`);
      console.error(`   Данные: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.error(`   Сообщение: ${error.message}`);
    }
  }
}

// Запускаем тест
testReceiptBase64Upload();
