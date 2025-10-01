const mysql = require('mysql2/promise');

async function updateImageFields() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'mobile_store'
  });

  try {
    console.log('🔄 Обновляем поля изображений...');
    
    // Обновляем primary_image_url
    await connection.execute(`
      ALTER TABLE product_color_images 
      MODIFY COLUMN primary_image_url TEXT NOT NULL
    `);
    console.log('✅ primary_image_url обновлен на TEXT');

    // Обновляем thumbnail_url
    await connection.execute(`
      ALTER TABLE product_color_images 
      MODIFY COLUMN thumbnail_url TEXT NULL
    `);
    console.log('✅ thumbnail_url обновлен на TEXT');

    console.log('🎉 Все поля успешно обновлены!');
  } catch (error) {
    console.error('❌ Ошибка при обновлении полей:', error.message);
  } finally {
    await connection.end();
  }
}

updateImageFields();
