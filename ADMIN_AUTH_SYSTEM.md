# Система аутентификации админов

## Обзор

Создана отдельная система аутентификации для админов, которая обеспечивает безопасность и изоляцию от обычных пользователей.

## Архитектура

### Модули

- **AdminAuthModule** - основной модуль аутентификации админов
- **AdminAuthController** - контроллер с эндпоинтами
- **AdminAuthService** - сервис для обработки логики аутентификации

### Сущности

- **Admin** - основная сущность админа
- **AdminRefreshToken** - токены обновления для админов

### DTO

- **AdminLoginDto** - данные для входа
- **AdminAuthResponseDto** - ответ с токенами и информацией об админе
- **AdminRefreshTokenDto** - данные для обновления токенов

## Эндпоинты

### POST /admin/auth/login

Вход в админ панель

```json
{
  "email": "super-admin@phone-store.com",
  "password": "super123"
}
```

**Ответ:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": 1,
    "email": "super-admin@phone-store.com",
    "firstName": "Super",
    "lastName": "Admin",
    "role": "super_admin",
    "permissions": ["users:create", "users:view", ...],
    "isActive": true,
    "lastLoginAt": "2025-01-29T10:00:00.000Z"
  }
}
```

### POST /admin/auth/refresh

Обновление токенов

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### POST /admin/auth/logout

Выход из системы

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### GET /admin/auth/me

Получение информации о текущем админе (требует токен)

### GET /admin/auth/verify

Проверка валидности токена (требует токен)

## Безопасность

### JWT Payload для админов

```typescript
interface AdminJwtPayload {
  sub: number; // ID админа
  email: string; // Email админа
  role: string; // Роль админа
  permissions: string[]; // Разрешения
  iat?: number; // Время создания
  exp?: number; // Время истечения
}
```

### Роли админов

- **super_admin** - супер администратор (все права)
- **admin** - администратор
- **manager** - менеджер
- **support** - поддержка

### Разрешения

- `users:*` - управление пользователями
- `products:*` - управление продуктами
- `orders:*` - управление заказами
- `admin:*` - управление админами
- `settings:*` - настройки системы

## Установка

### 1. Создание админа в базе данных

```sql
-- Выполните скрипт create-admin.sql
psql -d mobile_store -f create-admin.sql
```

### 2. Перезапуск бэкенда

```bash
npm run start:dev
```

### 3. Тестирование

```bash
curl -X POST http://localhost:3000/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "super-admin@phone-store.com",
    "password": "super123"
  }'
```

## Преимущества

✅ **Изоляция** - отдельная система для админов
✅ **Безопасность** - отдельные токены и refresh токены
✅ **Масштабируемость** - легко добавлять новые роли и разрешения
✅ **Аудит** - отслеживание действий админов
✅ **Гибкость** - настраиваемые разрешения для каждой роли

## Миграция с обычной аутентификации

Фронтенд автоматически переключился на новые эндпоинты:

- `/auth/login` → `/admin/auth/login`
- `/auth/refresh` → `/admin/auth/refresh`
- `/auth/logout` → `/admin/auth/logout`

Старые эндпоинты остаются для обычных пользователей.

