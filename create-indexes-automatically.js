const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

class IndexCreator {
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
    this.connection = null;
    this.logFile = path.join(__dirname, 'index-creation.log');
  }

  async createIndexes() {
    console.log('🚀 Запуск автоматического создания индексов...');
    console.log(`📝 Логи сохраняются в: ${this.logFile}`);

    try {
      this.connection = await mysql.createConnection(this.config);
      console.log('✅ Подключение к базе данных установлено');

      // Получаем список таблиц
      const tables = await this.getTables();
      console.log(`📋 Найдено таблиц: ${tables.length}`);

      // Создаем индексы для каждой таблицы
      for (const table of tables) {
        await this.createIndexesForTable(table);
      }

      // Проверяем созданные индексы
      await this.verifyIndexes();

      console.log('\n✅ Создание индексов завершено успешно!');
    } catch (error) {
      console.error('❌ Ошибка создания индексов:', error.message);
      this.log(`ERROR: ${error.message}`);
      throw error;
    } finally {
      if (this.connection) {
        await this.connection.end();
        console.log('🔌 Соединение закрыто');
      }
    }
  }

  async getTables() {
    const [tables] = await this.connection.execute(
      `
      SELECT TABLE_NAME 
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ? 
      AND TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `,
      [this.config.database],
    );

    return tables.map((row) => row.TABLE_NAME);
  }

  async createIndexesForTable(tableName) {
    console.log(`\n🔧 Создание индексов для таблицы: ${tableName}`);

    const indexes = this.getIndexDefinitions(tableName);

    for (const index of indexes) {
      try {
        await this.createIndex(index);
        console.log(`   ✅ ${index.name} - создан`);
        this.log(`SUCCESS: Created index ${index.name} on table ${tableName}`);
      } catch (error) {
        if (error.code === 'ER_DUP_KEYNAME') {
          console.log(`   ⚠️ ${index.name} - уже существует`);
          this.log(
            `WARNING: Index ${index.name} already exists on table ${tableName}`,
          );
        } else {
          console.error(`   ❌ ${index.name} - ошибка: ${error.message}`);
          this.log(
            `ERROR: Failed to create index ${index.name} on table ${tableName}: ${error.message}`,
          );
        }
      }
    }
  }

  getIndexDefinitions(tableName) {
    const indexDefinitions = {
      products: [
        { name: 'idx_products_category_id', columns: ['category_id'] },
        { name: 'idx_products_brand_id', columns: ['brand_id'] },
        { name: 'idx_products_slug', columns: ['slug'] },
        { name: 'idx_products_stock_quantity', columns: ['stock_quantity'] },
        { name: 'idx_products_is_active', columns: ['is_active'] },
        { name: 'idx_products_created_at', columns: ['created_at'] },
        { name: 'idx_products_base_price', columns: ['base_price'] },
        {
          name: 'idx_products_category_active',
          columns: ['category_id', 'is_active'],
        },
        {
          name: 'idx_products_brand_active',
          columns: ['brand_id', 'is_active'],
        },
      ],
      orders: [
        { name: 'idx_orders_user_id', columns: ['user_id'] },
        { name: 'idx_orders_status', columns: ['status'] },
        { name: 'idx_orders_payment_status', columns: ['payment_status'] },
        { name: 'idx_orders_created_at', columns: ['created_at'] },
        { name: 'idx_orders_payment_deadline', columns: ['payment_deadline'] },
        { name: 'idx_orders_order_number', columns: ['order_number'] },
        { name: 'idx_orders_user_status', columns: ['user_id', 'status'] },
        {
          name: 'idx_orders_status_created',
          columns: ['status', 'created_at'],
        },
      ],
      order_items: [
        { name: 'idx_order_items_order_id', columns: ['order_id'] },
        { name: 'idx_order_items_product_id', columns: ['product_id'] },
      ],
      cart_items: [
        { name: 'idx_cart_items_user_id', columns: ['user_id'] },
        { name: 'idx_cart_items_product_id', columns: ['product_id'] },
        {
          name: 'idx_cart_items_user_product',
          columns: ['user_id', 'product_id'],
        },
      ],
      users: [
        { name: 'idx_users_email', columns: ['email'] },
        { name: 'idx_users_phone', columns: ['phone'] },
        { name: 'idx_users_is_active', columns: ['is_active'] },
      ],
      product_variants: [
        { name: 'idx_product_variants_product_id', columns: ['product_id'] },
        {
          name: 'idx_product_variants_variant_type',
          columns: ['variant_type'],
        },
        { name: 'idx_product_variants_is_active', columns: ['is_active'] },
      ],
      product_color_images: [
        {
          name: 'idx_product_color_images_product_id',
          columns: ['product_id'],
        },
        {
          name: 'idx_product_color_images_variant_id',
          columns: ['variant_id'],
        },
        { name: 'idx_product_color_images_is_active', columns: ['is_active'] },
      ],
      categories: [
        { name: 'idx_categories_slug', columns: ['slug'] },
        { name: 'idx_categories_is_active', columns: ['is_active'] },
      ],
      brands: [
        { name: 'idx_brands_slug', columns: ['slug'] },
        { name: 'idx_brands_is_active', columns: ['is_active'] },
      ],
      reviews: [
        { name: 'idx_reviews_product_id', columns: ['product_id'] },
        { name: 'idx_reviews_user_id', columns: ['user_id'] },
        { name: 'idx_reviews_rating', columns: ['rating'] },
        { name: 'idx_reviews_is_active', columns: ['is_active'] },
        {
          name: 'idx_reviews_product_active',
          columns: ['product_id', 'is_active'],
        },
      ],
      wishlist_items: [
        { name: 'idx_wishlist_items_user_id', columns: ['user_id'] },
        { name: 'idx_wishlist_items_product_id', columns: ['product_id'] },
        {
          name: 'idx_wishlist_items_user_product',
          columns: ['user_id', 'product_id'],
        },
      ],
      payment_transactions: [
        { name: 'idx_payment_transactions_order_id', columns: ['order_id'] },
        { name: 'idx_payment_transactions_status', columns: ['status'] },
        {
          name: 'idx_payment_transactions_created_at',
          columns: ['created_at'],
        },
      ],
      bonus_transactions: [
        { name: 'idx_bonus_transactions_user_id', columns: ['user_id'] },
        { name: 'idx_bonus_transactions_type', columns: ['type'] },
        { name: 'idx_bonus_transactions_created_at', columns: ['created_at'] },
      ],
      promo_codes: [
        { name: 'idx_promo_codes_code', columns: ['code'] },
        { name: 'idx_promo_codes_is_active', columns: ['is_active'] },
        { name: 'idx_promo_codes_expires_at', columns: ['expires_at'] },
      ],
      notifications: [
        { name: 'idx_notifications_user_id', columns: ['user_id'] },
        { name: 'idx_notifications_type', columns: ['type'] },
        { name: 'idx_notifications_is_read', columns: ['is_read'] },
        { name: 'idx_notifications_created_at', columns: ['created_at'] },
      ],
      user_addresses: [
        { name: 'idx_user_addresses_user_id', columns: ['user_id'] },
        { name: 'idx_user_addresses_is_default', columns: ['is_default'] },
      ],
    };

    return indexDefinitions[tableName] || [];
  }

  async createIndex(indexDef) {
    const columns = indexDef.columns.join(', ');
    const sql = `CREATE INDEX ${indexDef.name} ON ${indexDef.table || 'products'} (${columns})`;

    await this.connection.execute(sql);
  }

  async verifyIndexes() {
    console.log('\n🔍 Проверка созданных индексов...');

    const [indexes] = await this.connection.execute(
      `
      SELECT 
        TABLE_NAME,
        INDEX_NAME,
        COLUMN_NAME,
        SEQ_IN_INDEX,
        NON_UNIQUE
      FROM information_schema.STATISTICS 
      WHERE TABLE_SCHEMA = ?
      AND INDEX_NAME LIKE 'idx_%'
      ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX
    `,
      [this.config.database],
    );

    const indexCount = {};
    indexes.forEach((index) => {
      if (!indexCount[index.TABLE_NAME]) {
        indexCount[index.TABLE_NAME] = new Set();
      }
      indexCount[index.TABLE_NAME].add(index.INDEX_NAME);
    });

    console.log('\n📊 Созданные индексы по таблицам:');
    Object.keys(indexCount).forEach((table) => {
      console.log(`   ${table}: ${indexCount[table].size} индексов`);
    });

    const totalIndexes = Object.values(indexCount).reduce(
      (sum, set) => sum + set.size,
      0,
    );
    console.log(`\n✅ Всего создано индексов: ${totalIndexes}`);

    this.log(
      `VERIFICATION: Created ${totalIndexes} indexes across ${Object.keys(indexCount).length} tables`,
    );
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
}

// Запуск создания индексов
const indexCreator = new IndexCreator();
indexCreator.createIndexes().catch(console.error);
