const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function createAdminUser() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'mobile_store',
    user: 'postgres',
    password: 'postgres',
  });

  try {
    await client.connect();
    console.log('🔌 Подключение к базе данных установлено');

    // Проверяем, существует ли уже пользователь
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['super-admin@phone-store.com'],
    );

    if (existingUser.rows.length > 0) {
      console.log('⚠️ Пользователь super-admin@phone-store.com уже существует');
      return;
    }

    // Хешируем пароль
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash('super123', saltRounds);

    // Создаем админа
    const result = await client.query(
      `
      INSERT INTO users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        is_active, 
        is_verified, 
        language_preference,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, email, first_name, last_name
    `,
      [
        'super-admin@phone-store.com',
        passwordHash,
        'Super',
        'Admin',
        true,
        true,
        'ru',
      ],
    );

    console.log('✅ Админ пользователь создан:', result.rows[0]);

    // Также создаем запись в таблице admins для совместимости
    const adminResult = await client.query(
      `
      INSERT INTO admins (
        email,
        password_hash,
        first_name,
        last_name,
        role,
        permissions,
        is_active,
        created_at,
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, email, first_name, last_name, role
    `,
      [
        'super-admin@phone-store.com',
        passwordHash,
        'Super',
        'Admin',
        'super_admin',
        JSON.stringify([
          'users:create',
          'users:view',
          'users:edit',
          'users:delete',
          'products:create',
          'products:view',
          'products:edit',
          'products:delete',
          'orders:view',
          'orders:edit',
          'orders:delete',
          'admin:create',
          'admin:view',
          'admin:edit',
          'admin:delete',
          'settings:view',
          'settings:edit',
        ]),
        true,
      ],
    );

    console.log('✅ Админ запись создана:', adminResult.rows[0]);
  } catch (error) {
    console.error('❌ Ошибка при создании админа:', error);
  } finally {
    await client.end();
    console.log('🔌 Соединение с базой данных закрыто');
  }
}

createAdminUser();

