const mysql = require('mysql2/promise');

async function testDatabaseConnection() {
  console.log('🔍 Тестирование подключения к базе данных...');

  const config = {
    host: process.env.DB_HOST || '147.45.157.26',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME || 'gen_user',
    password: process.env.DB_PASSWORD || '4rX&cHtw:uy&,l',
    database: process.env.DB_DATABASE || 'phone_store_db',
    charset: 'utf8mb4',
    timezone: '+00:00',
    // Настройки для стабильности соединения
    connectionLimit: 10,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    idleTimeout: 300000,
    keepAliveInitialDelay: 0,
    enableKeepAlive: true,
  };

  console.log('📋 Конфигурация подключения:');
  console.log(`   Host: ${config.host}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Database: ${config.database}`);
  console.log(`   User: ${config.user}`);
  console.log(`   Connection Limit: ${config.connectionLimit}`);
  console.log(`   Timeout: ${config.timeout}ms`);
  console.log(`   Acquire Timeout: ${config.acquireTimeout}ms`);

  let connection;
  try {
    console.log('\n🔄 Попытка подключения...');
    connection = await mysql.createConnection(config);
    console.log('✅ Подключение к базе данных успешно!');

    // Тестируем простой запрос
    console.log('\n🔄 Тестирование запроса...');
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Запрос выполнен успешно:', rows);

    // Проверяем статус соединения
    console.log('\n🔄 Проверка статуса соединения...');
    const [status] = await connection.execute(
      'SHOW STATUS LIKE "Threads_connected"',
    );
    console.log('📊 Статус соединений:', status);

    // Проверяем переменные MySQL
    console.log('\n🔄 Проверка переменных MySQL...');
    const [variables] = await connection.execute(`
      SHOW VARIABLES WHERE Variable_name IN (
        'max_connections',
        'wait_timeout',
        'interactive_timeout',
        'connect_timeout',
        'net_read_timeout',
        'net_write_timeout'
      )
    `);
    console.log('📊 Переменные MySQL:');
    variables.forEach((v) => {
      console.log(`   ${v.Variable_name}: ${v.Value}`);
    });
  } catch (error) {
    console.error('❌ Ошибка подключения к базе данных:');
    console.error('   Код ошибки:', error.code);
    console.error('   Сообщение:', error.message);
    console.error('   SQL State:', error.sqlState);
    console.error('   Errno:', error.errno);

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Возможные причины:');
      console.log('   - Сервер базы данных не запущен');
      console.log('   - Неверный хост или порт');
      console.log('   - Файрвол блокирует подключение');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Возможные причины:');
      console.log('   - Неверные учетные данные');
      console.log('   - Пользователь не имеет прав доступа');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Возможные причины:');
      console.log('   - База данных не существует');
      console.log('   - Неверное имя базы данных');
    } else if (
      error.code === 'PROTOCOL_CONNECTION_LOST' ||
      error.message.includes('Connection lost')
    ) {
      console.log('\n💡 Возможные причины:');
      console.log('   - Соединение разорвано сервером');
      console.log('   - Превышен wait_timeout');
      console.log('   - Проблемы с сетью');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Соединение закрыто');
    }
  }
}

// Тестируем пул соединений
async function testConnectionPool() {
  console.log('\n🔄 Тестирование пула соединений...');

  const config = {
    host: process.env.DB_HOST || '147.45.157.26',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME || 'gen_user',
    password: process.env.DB_PASSWORD || '4rX&cHtw:uy&,l',
    database: process.env.DB_DATABASE || 'phone_store_db',
    charset: 'utf8mb4',
    timezone: '+00:00',
    connectionLimit: 5, // Меньший лимит для теста
    acquireTimeout: 10000,
    timeout: 10000,
    reconnect: true,
    idleTimeout: 300000,
  };

  const pool = mysql.createPool(config);

  try {
    // Тестируем несколько одновременных подключений
    const promises = [];
    for (let i = 0; i < 3; i++) {
      promises.push(
        pool
          .execute('SELECT ? as test_id, NOW() as timestamp', [i])
          .then(([rows]) => {
            console.log(`✅ Запрос ${i} выполнен:`, rows[0]);
            return rows[0];
          })
          .catch((error) => {
            console.error(`❌ Ошибка в запросе ${i}:`, error.message);
            throw error;
          }),
      );
    }

    await Promise.all(promises);
    console.log('✅ Пул соединений работает корректно');
  } catch (error) {
    console.error('❌ Ошибка в пуле соединений:', error.message);
  } finally {
    await pool.end();
    console.log('🔌 Пул соединений закрыт');
  }
}

async function main() {
  await testDatabaseConnection();
  await testConnectionPool();
}

main().catch(console.error);
