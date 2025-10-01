const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

class PerformanceMonitor {
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
    this.metrics = {
      startTime: new Date(),
      totalQueries: 0,
      slowQueries: 0,
      connectionErrors: 0,
      avgResponseTime: 0,
      maxResponseTime: 0,
      minResponseTime: Infinity,
    };
    this.logFile = path.join(__dirname, 'performance-monitor.log');
  }

  async startMonitoring() {
    console.log('🚀 Запуск мониторинга производительности базы данных...');
    console.log(`📝 Логи сохраняются в: ${this.logFile}`);
    this.isMonitoring = true;

    // Заголовок лога
    this.log('=== НАЧАЛО МОНИТОРИНГА ПРОИЗВОДИТЕЛЬНОСТИ ===');

    while (this.isMonitoring) {
      try {
        await this.collectMetrics();
        await this.sleep(10000); // Проверяем каждые 10 секунд
      } catch (error) {
        console.error('❌ Ошибка мониторинга:', error.message);
        this.metrics.connectionErrors++;
        await this.sleep(5000); // При ошибке ждем 5 секунд
      }
    }
  }

  async collectMetrics() {
    const startTime = Date.now();

    try {
      if (!this.connection) {
        this.connection = await mysql.createConnection(this.config);
      }

      // Проверяем подключение
      await this.connection.ping();

      // Собираем метрики
      const metrics = await this.gatherDatabaseMetrics();

      // Обновляем общие метрики
      this.updateOverallMetrics(metrics, Date.now() - startTime);

      // Выводим текущий статус
      this.displayCurrentStatus(metrics);

      // Логируем метрики
      this.logMetrics(metrics);
    } catch (error) {
      console.error('❌ Ошибка сбора метрик:', error.message);
      this.metrics.connectionErrors++;
      this.connection = null; // Сбрасываем соединение при ошибке
      throw error;
    }
  }

  async gatherDatabaseMetrics() {
    const metrics = {};

    // Статистика соединений
    const [connections] = await this.connection.execute(
      'SHOW STATUS LIKE "Threads_connected"',
    );
    const [maxConnections] = await this.connection.execute(
      'SHOW VARIABLES LIKE "max_connections"',
    );
    const [maxUsedConnections] = await this.connection.execute(
      'SHOW STATUS LIKE "Max_used_connections"',
    );

    metrics.connections = {
      current: parseInt(connections[0].Value),
      max: parseInt(maxConnections[0].Value),
      maxUsed: parseInt(maxUsedConnections[0].Value),
      usage: (
        (parseInt(connections[0].Value) / parseInt(maxConnections[0].Value)) *
        100
      ).toFixed(2),
    };

    // Статистика запросов
    const [queries] = await this.connection.execute(
      'SHOW STATUS LIKE "Queries"',
    );
    const [slowQueries] = await this.connection.execute(
      'SHOW STATUS LIKE "Slow_queries"',
    );

    metrics.queries = {
      total: parseInt(queries[0].Value),
      slow: parseInt(slowQueries[0].Value),
      slowPercentage:
        queries[0].Value > 0
          ? (
              (parseInt(slowQueries[0].Value) / parseInt(queries[0].Value)) *
              100
            ).toFixed(2)
          : 0,
    };

    // Статистика InnoDB
    const [innodbBufferPool] = await this.connection.execute(
      'SHOW STATUS LIKE "Innodb_buffer_pool_pages_data"',
    );
    const [innodbBufferPoolTotal] = await this.connection.execute(
      'SHOW STATUS LIKE "Innodb_buffer_pool_pages_total"',
    );
    const [innodbBufferPoolHit] = await this.connection.execute(
      'SHOW STATUS LIKE "Innodb_buffer_pool_read_requests"',
    );
    const [innodbBufferPoolMiss] = await this.connection.execute(
      'SHOW STATUS LIKE "Innodb_buffer_pool_reads"',
    );

    metrics.innodb = {
      bufferPoolUsage:
        innodbBufferPoolTotal[0].Value > 0
          ? (
              (parseInt(innodbBufferPool[0].Value) /
                parseInt(innodbBufferPoolTotal[0].Value)) *
              100
            ).toFixed(2)
          : 0,
      hitRate:
        parseInt(innodbBufferPoolHit[0].Value) +
          parseInt(innodbBufferPoolMiss[0].Value) >
        0
          ? (
              (parseInt(innodbBufferPoolHit[0].Value) /
                (parseInt(innodbBufferPoolHit[0].Value) +
                  parseInt(innodbBufferPoolMiss[0].Value))) *
              100
            ).toFixed(2)
          : 0,
    };

    // Активные процессы
    const [processes] = await this.connection.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.processlist 
      WHERE command != 'Sleep'
    `);

    const [longProcesses] = await this.connection.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.processlist 
      WHERE time > 5 AND command != 'Sleep'
    `);

    metrics.processes = {
      active: parseInt(processes[0].count),
      longRunning: parseInt(longProcesses[0].count),
    };

    // Блокировки
    const [locks] = await this.connection.execute(`
      SELECT COUNT(*) as count 
      FROM information_schema.innodb_trx 
      WHERE trx_state = 'LOCK WAIT'
    `);

    metrics.locks = {
      waiting: parseInt(locks[0].count),
    };

    return metrics;
  }

  updateOverallMetrics(metrics, responseTime) {
    this.metrics.totalQueries++;
    this.metrics.slowQueries += metrics.queries.slow;
    this.metrics.maxResponseTime = Math.max(
      this.metrics.maxResponseTime,
      responseTime,
    );
    this.metrics.minResponseTime = Math.min(
      this.metrics.minResponseTime,
      responseTime,
    );

    // Обновляем среднее время ответа
    this.metrics.avgResponseTime =
      (this.metrics.avgResponseTime * (this.metrics.totalQueries - 1) +
        responseTime) /
      this.metrics.totalQueries;
  }

  displayCurrentStatus(metrics) {
    const timestamp = new Date().toISOString();
    const uptime = Math.floor(
      (Date.now() - this.metrics.startTime.getTime()) / 1000,
    );

    console.log(`\n📊 [${timestamp}] Статус БД (работает ${uptime}с):`);
    console.log(
      `   🔌 Соединения: ${metrics.connections.current}/${metrics.connections.max} (${metrics.connections.usage}%)`,
    );
    console.log(
      `   📈 Запросы: ${metrics.queries.total} (медленных: ${metrics.queries.slow}, ${metrics.queries.slowPercentage}%)`,
    );
    console.log(
      `   💾 InnoDB Buffer Pool: ${metrics.innodb.bufferPoolUsage}% (Hit Rate: ${metrics.innodb.hitRate}%)`,
    );
    console.log(
      `   ⚡ Активные процессы: ${metrics.processes.active} (долгих: ${metrics.processes.longRunning})`,
    );
    console.log(`   🔒 Блокировки: ${metrics.locks.waiting}`);

    // Предупреждения
    if (metrics.connections.usage > 80) {
      console.warn(
        `   ⚠️ ВЫСОКОЕ ИСПОЛЬЗОВАНИЕ СОЕДИНЕНИЙ: ${metrics.connections.usage}%`,
      );
    }
    if (metrics.queries.slowPercentage > 5) {
      console.warn(
        `   ⚠️ МНОГО МЕДЛЕННЫХ ЗАПРОСОВ: ${metrics.queries.slowPercentage}%`,
      );
    }
    if (metrics.processes.longRunning > 0) {
      console.warn(`   ⚠️ ДОЛГИЕ ПРОЦЕССЫ: ${metrics.processes.longRunning}`);
    }
    if (metrics.locks.waiting > 0) {
      console.warn(`   ⚠️ БЛОКИРОВКИ: ${metrics.locks.waiting}`);
    }
  }

  logMetrics(metrics) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      connections: metrics.connections,
      queries: metrics.queries,
      innodb: metrics.innodb,
      processes: metrics.processes,
      locks: metrics.locks,
      overall: {
        totalQueries: this.metrics.totalQueries,
        slowQueries: this.metrics.slowQueries,
        connectionErrors: this.metrics.connectionErrors,
        avgResponseTime: this.metrics.avgResponseTime.toFixed(2),
        maxResponseTime: this.metrics.maxResponseTime,
        minResponseTime:
          this.metrics.minResponseTime === Infinity
            ? 0
            : this.metrics.minResponseTime,
      },
    };

    this.log(JSON.stringify(logEntry));
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    try {
      fs.appendFileSync(this.logFile, logMessage);
    } catch (error) {
      console.error('Ошибка записи в лог:', error.message);
    }
  }

  async stopMonitoring() {
    console.log('\n🛑 Остановка мониторинга...');
    this.isMonitoring = false;

    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }

    // Финальная статистика
    const uptime = Math.floor(
      (Date.now() - this.metrics.startTime.getTime()) / 1000,
    );
    console.log('\n📊 ФИНАЛЬНАЯ СТАТИСТИКА:');
    console.log(`   ⏱️ Время работы: ${uptime} секунд`);
    console.log(`   📈 Всего запросов: ${this.metrics.totalQueries}`);
    console.log(`   🐌 Медленных запросов: ${this.metrics.slowQueries}`);
    console.log(`   ❌ Ошибок подключения: ${this.metrics.connectionErrors}`);
    console.log(
      `   ⚡ Среднее время ответа: ${this.metrics.avgResponseTime.toFixed(2)}ms`,
    );
    console.log(`   🏃 Максимальное время: ${this.metrics.maxResponseTime}ms`);
    console.log(
      `   🐌 Минимальное время: ${this.metrics.minResponseTime === Infinity ? 0 : this.metrics.minResponseTime}ms`,
    );

    this.log('=== КОНЕЦ МОНИТОРИНГА ПРОИЗВОДИТЕЛЬНОСТИ ===');
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Запуск мониторинга
const monitor = new PerformanceMonitor();

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
