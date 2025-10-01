const mysql = require('mysql2/promise');

class PerformanceTester {
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
  }

  async runTests() {
    console.log('🚀 Запуск тестов производительности базы данных...\n');

    try {
      // Тест 1: Простое подключение
      await this.testConnection();

      // Тест 2: Простые запросы
      await this.testSimpleQueries();

      // Тест 3: Сложные запросы с JOIN
      await this.testComplexQueries();

      // Тест 4: Транзакции
      await this.testTransactions();

      // Тест 5: Параллельные запросы
      await this.testConcurrentQueries();

      // Тест 6: Нагрузочное тестирование
      await this.testLoad();

      console.log('\n✅ Все тесты завершены успешно!');
    } catch (error) {
      console.error('\n❌ Ошибка в тестах:', error.message);
      throw error;
    }
  }

  async testConnection() {
    console.log('🔌 Тест 1: Подключение к базе данных...');
    const start = Date.now();

    const connection = await mysql.createConnection(this.config);
    await connection.ping();
    await connection.end();

    const duration = Date.now() - start;
    console.log(`   ✅ Подключение успешно за ${duration}ms\n`);
  }

  async testSimpleQueries() {
    console.log('📊 Тест 2: Простые запросы...');
    const connection = await mysql.createConnection(this.config);

    try {
      const queries = [
        'SELECT 1 as test',
        'SELECT COUNT(*) as count FROM products',
        'SELECT COUNT(*) as count FROM users',
        'SELECT COUNT(*) as count FROM orders',
        'SHOW STATUS LIKE "Threads_connected"',
      ];

      for (const query of queries) {
        const start = Date.now();
        const [rows] = await connection.execute(query);
        const duration = Date.now() - start;
        console.log(`   ✅ ${query}: ${duration}ms`);
      }
    } finally {
      await connection.end();
    }

    console.log('');
  }

  async testComplexQueries() {
    console.log('🔗 Тест 3: Сложные запросы с JOIN...');
    const connection = await mysql.createConnection(this.config);

    try {
      const queries = [
        `SELECT p.id, p.name_ru, c.name_ru as category_name, b.name as brand_name
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN brands b ON p.brand_id = b.id
         LIMIT 10`,
        `SELECT o.id, o.order_number, u.email, COUNT(oi.id) as items_count
         FROM orders o
         LEFT JOIN users u ON o.user_id = u.id
         LEFT JOIN order_items oi ON o.id = oi.order_id
         GROUP BY o.id
         LIMIT 10`,
      ];

      for (const query of queries) {
        const start = Date.now();
        const [rows] = await connection.execute(query);
        const duration = Date.now() - start;
        console.log(
          `   ✅ Сложный запрос: ${duration}ms (${rows.length} строк)`,
        );
      }
    } finally {
      await connection.end();
    }

    console.log('');
  }

  async testTransactions() {
    console.log('🔄 Тест 4: Транзакции...');
    const connection = await mysql.createConnection(this.config);

    try {
      await connection.beginTransaction();

      const start = Date.now();

      // Имитируем создание заказа
      await connection.execute('SELECT COUNT(*) FROM products WHERE id = 1');
      await connection.execute('SELECT COUNT(*) FROM users WHERE id = 1');
      await connection.execute(
        'INSERT INTO orders (order_number, user_id, status, total_amount) VALUES (?, ?, ?, ?)',
        ['TEST' + Date.now(), 1, 'PENDING_PAYMENT', 1000],
      );

      await connection.rollback(); // Откатываем тестовую транзакцию

      const duration = Date.now() - start;
      console.log(`   ✅ Транзакция выполнена за ${duration}ms\n`);
    } finally {
      await connection.end();
    }
  }

  async testConcurrentQueries() {
    console.log('⚡ Тест 5: Параллельные запросы...');

    const promises = [];
    const start = Date.now();

    // Создаем 10 параллельных подключений
    for (let i = 0; i < 10; i++) {
      promises.push(this.runConcurrentQuery(i));
    }

    await Promise.all(promises);

    const duration = Date.now() - start;
    console.log(`   ✅ 10 параллельных запросов выполнены за ${duration}ms\n`);
  }

  async runConcurrentQuery(id) {
    const connection = await mysql.createConnection(this.config);

    try {
      const start = Date.now();
      const [rows] = await connection.execute(
        'SELECT COUNT(*) as count FROM products',
      );
      const duration = Date.now() - start;
      console.log(`   📊 Запрос ${id + 1}: ${duration}ms`);
      return rows;
    } finally {
      await connection.end();
    }
  }

  async testLoad() {
    console.log('🔥 Тест 6: Нагрузочное тестирование...');

    const iterations = 50;
    const start = Date.now();
    const results = [];

    for (let i = 0; i < iterations; i++) {
      const queryStart = Date.now();
      const connection = await mysql.createConnection(this.config);

      try {
        await connection.execute('SELECT COUNT(*) as count FROM products');
        const queryDuration = Date.now() - queryStart;
        results.push(queryDuration);

        if (i % 10 === 0) {
          console.log(`   📊 Выполнено ${i + 1}/${iterations} запросов...`);
        }
      } finally {
        await connection.end();
      }
    }

    const totalDuration = Date.now() - start;
    const avgDuration = results.reduce((a, b) => a + b, 0) / results.length;
    const minDuration = Math.min(...results);
    const maxDuration = Math.max(...results);

    console.log(`   ✅ Нагрузочный тест завершен:`);
    console.log(`      📊 Всего запросов: ${iterations}`);
    console.log(`      ⏱️ Общее время: ${totalDuration}ms`);
    console.log(`      📈 Среднее время: ${avgDuration.toFixed(2)}ms`);
    console.log(`      🏃 Минимальное время: ${minDuration}ms`);
    console.log(`      🐌 Максимальное время: ${maxDuration}ms`);
    console.log(
      `      🚀 Запросов в секунду: ${(iterations / (totalDuration / 1000)).toFixed(2)}\n`,
    );
  }
}

// Запуск тестов
const tester = new PerformanceTester();
tester.runTests().catch(console.error);
