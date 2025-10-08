const mysql = require('mysql2/promise');

async function fixThumbnailColumn() {
  let connection;
  
  try {
    console.log('Подключение к базе данных...');
    connection = await mysql.createConnection({
      host: '147.45.157.26',
      user: 'gen_user',
      password: '4rX&cHtw:uy&,l',
      database: 'phone_store_db'
    });
    console.log('Подключено успешно!');
    
    // Проверяем текущую структуру таблицы
    console.log('\nТекущая структура product_color_images:');
    const [columns] = await connection.execute(`
      SHOW COLUMNS FROM product_color_images
    `);
    
    columns.forEach(col => {
      console.log(`  ${col.Field} - ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'}`);
    });
    
    // Проверяем наличие thumbnail_url
    const hasThumbnail = columns.find(col => col.Field === 'thumbnail_url');
    
    if (hasThumbnail) {
      console.log('\n✅ Колонка thumbnail_url уже существует!');
    } else {
      console.log('\n⚠️  Колонка thumbnail_url отсутствует. Добавляем...');
      
      await connection.execute(`
        ALTER TABLE product_color_images 
        ADD COLUMN thumbnail_url TEXT NULL 
        AFTER primary_image_url
      `);
      
      console.log('✅ Колонка thumbnail_url добавлена успешно!');
      
      // Проверяем еще раз
      const [newColumns] = await connection.execute(`
        SHOW COLUMNS FROM product_color_images
      `);
      console.log('\nОбновленная структура:');
      newColumns.forEach(col => {
        console.log(`  ${col.Field} - ${col.Type}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Ошибка:', error.message);
    if (error.code) {
      console.error('Код ошибки:', error.code);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nСоединение закрыто.');
    }
  }
}

fixThumbnailColumn()
  .then(() => {
    console.log('\nГотово!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Критическая ошибка:', err);
    process.exit(1);
  });

