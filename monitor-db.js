const mysql = require('mysql2/promise');

class DatabaseMonitor {
  constructor() {
    this.config = {
      host: process.env.DB_HOST || '147.45.157.26',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USERNAME || 'gen_user',
      password: process.env.DB_PASSWORD || '4rX&cHtw:uy&,l',
      database: process.env.DB_DATABASE || 'phone_store_db',
      charset: 'utf8mb4',
      timezone: '+00:00',
    };
    this.isMonitoring = false;
    this.connection = null;
  }

  async startMonitoring() {
    console.log('🔍 Запуск мониторинга базы данных...');
    this.isMonitoring = true;

    while (this.isMonitoring) {
      try {
        await this.checkDatabaseHealth();
        await this.sleep(30000); // Проверяем каждые 30 секунд
      } catch (error) {
        console.error('❌ Ошибка мониторинга:', error.message);
        await this.sleep(10000); // При ошибке ждем 10 секунд
      }
    }
  }

  async checkDatabaseHealth() {
    try {
      if (!this.connection) {
        this.connection = await mysql.createConnection(this.config);
      }

      // Проверяем подключение
      await this.connection.ping();

      // Получаем статистику соединений
      const [connections] = await this.connection.execute(
        'SHOW STATUS LIKE "Threads_connected"',
      );
      const [maxConnections] = await this.connection.execute(
        'SHOW VARIABLES LIKE "max_connections"',
      );

      const currentConnections = parseInt(connections[0].Value);
      const maxConn = parseInt(maxConnections[0].Value);
      const connectionUsage = ((currentConnections / maxConn) * 100).toFixed(2);

      console.log(
        `📊 Статус БД: ${currentConnections}/${maxConn} соединений (${connectionUsage}%)`,
      );

      // Проверяем, не превышен ли лимит соединений
      if (connectionUsage > 80) {
        console.warn(
          `⚠️ Высокое использование соединений: ${connectionUsage}%`,
        );
      }

      // Проверяем долгие запросы
      const [longQueries] = await this.connection.execute(`
        SELECT COUNT(*) as count 
        FROM information_schema.processlist 
        WHERE time > 30 AND command != 'Sleep'
      `);

      if (longQueries[0].count > 0) {
        console.warn(
          `⚠️ Найдено ${longQueries[0].count} долгих запросов (>30 сек)`,
        );
      }

      // Проверяем блокировки
      const [locks] = await this.connection.execute(`
        SELECT COUNT(*) as count 
        FROM information_schema.innodb_trx 
        WHERE trx_state = 'LOCK WAIT'
      `);

      if (locks[0].count > 0) {
        console.warn(`⚠️ Найдено ${locks[0].count} заблокированных транзакций`);
      }
    } catch (error) {
      console.error('❌ Ошибка проверки БД:', error.message);
      this.connection = null; // Сбрасываем соединение при ошибке
      throw error;
    }
  }

  async stopMonitoring() {
    console.log('🛑 Остановка мониторинга...');
    this.isMonitoring = false;
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Запуск мониторинга
const monitor = new DatabaseMonitor();

// Обработка сигналов завершения
process.on('SIGINT', async () => {
  console.log('\n🛑 Получен сигнал SIGINT, завершение...');
  await monitor.stopMonitoring();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Получен сигнал SIGTERM, завершение...');
  await monitor.stopMonitoring();
  process.exit(0);
});

// Запуск
monitor.startMonitoring().catch(console.error);
