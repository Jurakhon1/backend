const mysql = require('mysql2/promise');

async function addThumbnailUrlColumn() {
  const connection = await mysql.createConnection({
    host: '147.45.157.26',
    user: 'gen_user',
    password: '4rX&cHtw:uy&,l',
    database: 'phone_store_db'
  });

  try {
    console.log('🔗 Подключение к базе данных установлено');
    
    // Проверяем, существует ли уже колонка thumbnail_url
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'phone_store_db' 
      AND TABLE_NAME = 'product_color_images' 
      AND COLUMN_NAME = 'thumbnail_url'
    `);

    if (columns.length > 0) {
      console.log('✅ Колонка thumbnail_url уже существует');
      return;
    }

    // Добавляем колонку thumbnail_url
    console.log('🔄 Добавляем колонку thumbnail_url в таблицу product_color_images...');
    await connection.execute(`
      ALTER TABLE product_color_images 
      ADD COLUMN thumbnail_url TEXT NULL 
      AFTER primary_image_url
    `);

    console.log('✅ Колонка thumbnail_url успешно добавлена');
    
    // Проверяем результат
    const [result] = await connection.execute(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_TYPE 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'phone_store_db' 
      AND TABLE_NAME = 'product_color_images'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('\n📋 Текущая структура таблицы product_color_images:');
    result.forEach(col => {
      console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE} (${col.IS_NULLABLE === 'YES' ? 'nullable' : 'not null'})`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка при выполнении миграции:', error.message);
    console.error('Детали:', error);
  } finally {
    await connection.end();
    console.log('\n🔌 Соединение с базой данных закрыто');
  }
}

addThumbnailUrlColumn();

