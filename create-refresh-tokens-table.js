const mysql = require('mysql2/promise');

async function createRefreshTokensTable() {
  const connection = await mysql.createConnection({
    host: '147.45.157.26',
    user: 'gen_user',
    password: '4rX&cHtw:uy&,l',
    database: 'phone_store_db',
  });

  try {
    console.log('🔌 Подключение к базе данных установлено');

    // Создаем таблицу admin_refresh_tokens
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS admin_refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        token VARCHAR(500) NOT NULL UNIQUE,
        admin_id INT NOT NULL,
        expires_at DATETIME NOT NULL,
        is_revoked BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE,
        INDEX idx_admin_id (admin_id),
        INDEX idx_token (token),
        INDEX idx_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Таблица admin_refresh_tokens создана');

    // Проверяем, что таблица создана
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'admin_refresh_tokens'",
    );

    if (tables.length > 0) {
      console.log('✅ Таблица admin_refresh_tokens существует');
    } else {
      console.log('❌ Таблица admin_refresh_tokens не найдена');
    }
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await connection.end();
    console.log('🔌 Соединение закрыто');
  }
}

createRefreshTokensTable();

