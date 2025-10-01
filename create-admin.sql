-- Создание супер-админа
-- Сначала создаем пользователя в таблице users (для совместимости)
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
) VALUES (
  'super-admin@phone-store.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2C', -- пароль: super123
  'Super',
  'Admin',
  true,
  true,
  'ru',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Создаем админа в таблице admins
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
) VALUES (
  'super-admin@phone-store.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8Qz8K2C', -- пароль: super123
  'Super',
  'Admin',
  'super_admin',
  '["users:create","users:view","users:edit","users:delete","products:create","products:view","products:edit","products:delete","orders:view","orders:edit","orders:delete","admin:create","admin:view","admin:edit","admin:delete","settings:view","settings:edit"]',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Проверяем создание
SELECT 
  u.id as user_id, 
  u.email, 
  u.first_name, 
  u.last_name,
  a.id as admin_id,
  a.role,
  a.permissions
FROM users u 
LEFT JOIN admins a ON u.email = a.email 
WHERE u.email = 'super-admin@phone-store.com';

