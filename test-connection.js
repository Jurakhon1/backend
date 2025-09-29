const axios = require('axios');

async function testConnection() {
  try {
    console.log('🔍 Проверка подключения к серверу...');
    const response = await axios.get('http://localhost:3000', {
      timeout: 5000,
    });
    console.log('✅ Сервер отвечает:', response.status);
  } catch (error) {
    console.log('❌ Сервер не отвечает:', error.message);

    // Проверим, запущен ли процесс
    const { exec } = require('child_process');
    exec('netstat -an | findstr :3000', (error, stdout, stderr) => {
      if (stdout.includes('3000')) {
        console.log('🔍 Порт 3000 занят, но сервер не отвечает');
      } else {
        console.log('🔍 Порт 3000 свободен');
      }
    });
  }
}

testConnection();
