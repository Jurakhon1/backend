const mysql = require('mysql2/promise');

async function fixImageFields() {
  let connection;

  try {
    // Подключение к базе данных
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '', // Замените на ваш пароль
      database: 'mobile_store',
    });

    console.log('🔌 Подключение к базе данных установлено');

    // Проверяем текущую структуру таблицы
    console.log('📋 Проверяем текущую структуру таблицы...');
    const [columns] = await connection.execute('DESCRIBE product_color_images');

    console.log('Текущие типы полей:');
    columns.forEach((col) => {
      if (col.Field === 'primary_image_url' || col.Field === 'thumbnail_url') {
        console.log(`  ${col.Field}: ${col.Type}`);
      }
    });

    // Изменяем тип полей
    console.log('🔧 Изменяем тип полей с VARCHAR(500) на TEXT...');

    await connection.execute(`
      ALTER TABLE product_color_images 
      MODIFY COLUMN primary_image_url TEXT NOT NULL
    `);
    console.log('✅ primary_image_url обновлен на TEXT');

    await connection.execute(`
      ALTER TABLE product_color_images 
      MODIFY COLUMN thumbnail_url TEXT NULL
    `);
    console.log('✅ thumbnail_url обновлен на TEXT');

    // Проверяем обновленную структуру
    console.log('📋 Проверяем обновленную структуру таблицы...');
    const [updatedColumns] = await connection.execute(
      'DESCRIBE product_color_images',
    );

    console.log('Обновленные типы полей:');
    updatedColumns.forEach((col) => {
      if (col.Field === 'primary_image_url' || col.Field === 'thumbnail_url') {
        console.log(`  ${col.Field}: ${col.Type}`);
      }
    });

    console.log('🎉 Поля изображений успешно обновлены на TEXT!');
    console.log(
      'Теперь base64 изображения не будут обрезаться до 500 символов.',
    );
  } catch (error) {
    console.error('❌ Ошибка при обновлении полей:', error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Соединение с базой данных закрыто');
    }
  }
}

// Запускаем функцию
fixImageFields()
  .then(() => {
    console.log('✅ Скрипт выполнен успешно');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Ошибка выполнения скрипта:', error);
    process.exit(1);
  });
