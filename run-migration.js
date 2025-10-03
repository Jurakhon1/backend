const mysql = require('mysql2/promise');

async function runMigration() {
  const connection = await mysql.createConnection({
    host: '147.45.157.26',
    user: 'gen_user',
    password: '4rX&cHtw:uy&,l',
    database: 'phone_store_db'
  });

  try {
    console.log('🔗 Подключение к базе данных установлено');
    
    // Проверяем, существует ли уже колонка
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'phone_store_db' 
      AND TABLE_NAME = 'payment_transactions' 
      AND COLUMN_NAME = 'receipt_image_base64'
    `);

    if (columns.length > 0) {
      console.log('✅ Колонка receipt_image_base64 уже существует');
      return;
    }

    // Добавляем колонку
    console.log('🔄 Добавляем колонку receipt_image_base64...');
    await connection.execute(`
      ALTER TABLE payment_transactions 
      ADD COLUMN receipt_image_base64 LONGTEXT NULL 
      COMMENT 'Base64 данные изображения чека'
    `);

    console.log('✅ Колонка receipt_image_base64 успешно добавлена');
    
  } catch (error) {
    console.error('❌ Ошибка при выполнении миграции:', error.message);
  } finally {
    await connection.end();
    console.log('🔌 Соединение с базой данных закрыто');
  }
}

runMigration();
