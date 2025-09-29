const mysql = require('mysql2/promise');
const fs = require('fs');

const config = {
  host: '147.45.157.26',
  user: 'gen_user',
  password: '4rX&cHtw:uy&,l',
  database: 'phone_store_db',
  port: 3306,
};

async function setupColorImages() {
  let connection;

  try {
    console.log('🔗 Подключение к базе данных...');
    connection = await mysql.createConnection(config);
    console.log('✅ Подключение установлено');

    // Читаем SQL файл
    console.log('📖 Чтение SQL файла...');
    const sqlContent = fs.readFileSync('create-color-images-table.sql', 'utf8');

    // Разбиваем на отдельные запросы
    const queries = sqlContent
      .split(';')
      .map((query) => query.trim())
      .filter((query) => query.length > 0);

    console.log(`📝 Найдено ${queries.length} SQL запросов`);

    // Выполняем каждый запрос
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      if (query.trim()) {
        try {
          console.log(`⏳ Выполнение запроса ${i + 1}/${queries.length}...`);
          await connection.execute(query);
          console.log(`✅ Запрос ${i + 1} выполнен успешно`);
        } catch (error) {
          if (
            error.code === 'ER_TABLE_EXISTS_ERROR' ||
            error.code === 'ER_DUP_ENTRY'
          ) {
            console.log(
              `⚠️  Запрос ${i + 1} пропущен (уже существует): ${error.message}`,
            );
          } else {
            console.error(`❌ Ошибка в запросе ${i + 1}:`, error.message);
          }
        }
      }
    }

    // Проверяем результат
    console.log('🔍 Проверка созданных данных...');
    const [rows] = await connection.execute(`
      SELECT 
        pci.id,
        p.name_ru as product_name,
        pv.variantValueRu as color_name,
        pci.primary_image_url,
        JSON_LENGTH(pci.gallery_urls) as gallery_count
      FROM product_color_images pci
      JOIN products p ON pci.product_id = p.id
      JOIN product_variants pv ON pci.variant_id = pv.id
      ORDER BY pci.id
    `);

    console.log('📊 Созданные записи:');
    rows.forEach((row) => {
      console.log(
        `  - ${row.product_name} (${row.color_name}): ${row.gallery_count} изображений`,
      );
    });

    console.log(
      `\n🎉 Успешно создано ${rows.length} записей изображений цветов!`,
    );
  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Соединение закрыто');
    }
  }
}

// Запускаем скрипт
setupColorImages();
