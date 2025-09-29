const axios = require('axios');

async function cleanupStuckOrders() {
  try {
    console.log('Очищаем зависшие заказы...');
    const response = await axios.post('http://localhost:3000/orders/cleanup-stuck');
    console.log('Зависшие заказы очищены успешно');
  } catch (error) {
    console.error('Ошибка при очистке заказов:', error.message);
  }
}

cleanupStuckOrders();
