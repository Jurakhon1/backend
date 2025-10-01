const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function createAdmin() {
  const connection = await mysql.createConnection({
    host: '147.45.157.26',
    user: 'gen_user',
    password: '4rX&cHtw:uy&,l',
    database: 'phone_store_db',
  });

  try {
    console.log('🔌 Подключение к базе данных установлено');

    // Хешируем пароль
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash('super123', saltRounds);

    // Создаем пользователя
    await connection.execute(
      `
      INSERT IGNORE INTO users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        is_active, 
        is_verified, 
        language_preference,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
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

    console.log('✅ Пользователь создан');

    // Создаем админа
    await connection.execute(
      `
      INSERT IGNORE INTO admins (
        email,
        password_hash,
        first_name,
        last_name,
        role,
        permissions,
        is_active,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
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

    console.log('✅ Админ создан');

    // Проверяем создание
    const [users] = await connection.execute(
      'SELECT id, email, first_name, last_name FROM users WHERE email = ?',
      ['super-admin@phone-store.com'],
    );

    const [admins] = await connection.execute(
      'SELECT id, email, role, permissions FROM admins WHERE email = ?',
      ['super-admin@phone-store.com'],
    );

    console.log('📋 Результат:');
    console.log('Пользователь:', users[0]);
    console.log('Админ:', admins[0]);
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await connection.end();
    console.log('🔌 Соединение закрыто');
  }
}

createAdmin();

