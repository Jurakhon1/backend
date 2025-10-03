const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:3000';

// Тестовый base64 изображение (маленький PNG 1x1 пиксель)
const testBase64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

async function testReceiptBase64Upload() {
  try {
    console.log('🧪 Тестируем загрузку чека через base64...\n');

    // 1. Создаем тестовую транзакцию (предполагаем что она уже существует)
    const transactionId = 1; // Замените на реальный ID транзакции

    // 2. Загружаем чек через base64
    console.log('📤 Загружаем чек через base64...');
    const response = await axios.post(
      `${API_BASE_URL}/payment/transactions/${transactionId}/upload-receipt-base64`,
      {
        base64_image: testBase64Image,
        file_extension: 'png'
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Чек успешно загружен!');
    console.log('📋 Ответ сервера:', JSON.stringify(response.data, null, 2));

    // 3. Проверяем что файл создался
    const receiptImageUrl = response.data.receipt_image_url;
    const filename = receiptImageUrl.split('/').pop();
    const filePath = path.join(__dirname, 'uploads', 'receipts', filename);
    
    if (fs.existsSync(filePath)) {
      console.log('✅ Файл успешно сохранен:', filePath);
      console.log('📏 Размер файла:', fs.statSync(filePath).size, 'байт');
    } else {
      console.log('❌ Файл не найден:', filePath);
    }

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.response?.data || error.message);
  }
}

// Запускаем тест
testReceiptBase64Upload();
