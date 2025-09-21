# 📱 Mobile Phone Store API Documentation

## 🚀 Обзор

Backend API для мобильного приложения продажи телефонов и аксессуаров, созданный на NestJS с TypeScript и PostgreSQL.

## 🏗️ Архитектура

- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL (Neon DB)
- **ORM**: TypeORM
- **Authentication**: bcrypt для хеширования паролей

## 📊 Основные модули

### 1. 👥 Users (Пользователи)

```
POST   /users                     - Создание пользователя
GET    /users                     - Список пользователей
GET    /users/:id                 - Получение пользователя
PUT    /users/:id                 - Обновление пользователя
DELETE /users/:id                 - Удаление пользователя
PUT    /users/:id/change-password - Смена пароля
```

### 2. 📦 Products (Товары)

```
POST   /products            - Создание продукта
GET    /products            - Каталог продуктов
GET    /products/:id        - Карточка продукта
GET    /products/slug/:slug - Поиск по slug
PUT    /products/:id        - Обновление продукта
DELETE /products/:id        - Удаление продукта
PUT    /products/:id/stock  - Обновление остатков
```

### 3. 🛒 Cart (Корзина)

```
POST   /cart/:userId                    - Добавить в корзину
GET    /cart/:userId                    - Получить корзину
PUT    /cart/:userId/items/:itemId      - Обновить количество
DELETE /cart/:userId/items/:itemId      - Удалить из корзины
DELETE /cart/:userId                    - Очистить корзину
```

### 4. 📋 Orders (Заказы с предоплатой 10%)

```
POST   /orders/user/:userId             - Создать заказ
GET    /orders/user/:userId             - История заказов
GET    /orders/user/:userId/:orderId    - Детали заказа
PUT    /orders/:orderId/confirm-payment - Подтвердить оплату
POST   /orders/cancel-expired           - Отменить просроченные
```

### 5. 💳 Payment (Оплата)

```
GET    /payment/banks                           - Список банков
GET    /payment/banks/:bankId                   - Детали банка
POST   /payment/transactions                    - Загрузить чек
GET    /payment/orders/:orderId/transactions    - Транзакции заказа
GET    /payment/transactions/pending            - Ожидающие проверки
PUT    /payment/transactions/:id/confirm        - Подтвердить оплату (админ)
PUT    /payment/transactions/:id/reject         - Отклонить оплату (админ)
```

### 6. ❤️ Wishlist (Избранное и Сравнение)

```
POST   /wishlist/:userId/products/:productId          - В избранное
DELETE /wishlist/:userId/products/:productId          - Из избранного
GET    /wishlist/:userId                              - Список избранного
GET    /wishlist/:userId/products/:productId/check    - Проверить в избранном

POST   /wishlist/:userId/comparison/:productId        - В сравнение
DELETE /wishlist/:userId/comparison/:productId        - Из сравнения
GET    /wishlist/:userId/comparison                   - Список сравнения
DELETE /wishlist/:userId/comparison                   - Очистить сравнение
```

### 7. 🎁 Bonus (Бонусная система)

```
GET    /bonus/users/:userId/balance                   - Баланс бонусов
GET    /bonus/users/:userId/transactions              - История бонусов
POST   /bonus/spend                                   - Потратить бонусы
POST   /bonus/earn                                    - Начислить бонусы
POST   /bonus/orders/:orderId/earn                    - Начислить за заказ
POST   /bonus/orders/:orderId/refund                  - Возврат бонусов
POST   /bonus/expire                                  - Списать просроченные
```

### 8. 🏷️ Promo (Промокоды)

```
POST   /promo                                         - Создать промокод
GET    /promo                                         - Активные промокоды
GET    /promo/:id                                     - Детали промокода
PUT    /promo/:id                                     - Обновить промокод
DELETE /promo/:id                                     - Удалить промокод
POST   /promo/validate                                - Проверить промокод
POST   /promo/apply                                   - Применить промокод
GET    /promo/users/:userId/usage                     - История использования
```

## 🔄 Бизнес-логика предоплаты

### Процесс оформления заказа:

1. **Создание заказа** → статус `pending_payment`
2. **Расчет предоплаты** → 10% от суммы заказа
3. **Таймер оплаты** → 30 минут на загрузку чека
4. **Выбор банка** → клиент выбирает банк для перевода
5. **Загрузка чека** → создается транзакция со статусом `pending`
6. **Проверка админом** → подтверждение или отклонение
7. **Подтверждение** → статус заказа `payment_confirmed`

### Автоматическая отмена:

- Заказы без оплаты отменяются через 30 минут
- Товары возвращаются на склад
- Статус: `payment_expired`

## 📋 Модели данных

### User

```typescript
{
  id: number
  email: string (unique)
  phone?: string
  password_hash: string
  first_name: string
  last_name: string
  is_active: boolean
  is_verified: boolean
  language_preference: 'ru' | 'en'
  created_at: Date
  updated_at: Date
}
```

### Product

```typescript
{
  id: number;
  name_ru: string;
  name_en: string;
  slug: string(unique);
  category: Category;
  brand: Brand;
  base_price: number;
  stock_quantity: number;
  is_active: boolean;
  created_at: Date;
}
```

### Order

```typescript
{
  id: number
  order_number: string (unique)
  user: User
  status: OrderStatus
  payment_status: PaymentStatus
  delivery_type: 'delivery' | 'pickup'
  shipping_address?: object
  subtotal: number
  shipping_cost: number
  discount_amount: number
  total_amount: number
  prepaid_amount: number (10%)
  remaining_amount: number
  payment_deadline: Date
  items: OrderItem[]
  created_at: Date
}
```

## 🚀 Запуск проекта

```bash
# Установка зависимостей
npm install

# Компиляция
npm run build

# Запуск в режиме разработки
npm run start:dev

# Запуск в продакшене
npm run start:prod
```

## 🔧 Переменные окружения

```env
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=your-database
DB_SSL=true
NODE_ENV=development
PORT=3000
```

## 📈 Статусы

### OrderStatus

- `pending_payment` - Ожидает оплаты
- `payment_confirmed` - Оплата подтверждена
- `processing` - В обработке
- `shipped` - Отправлен
- `delivered` - Доставлен
- `cancelled` - Отменен
- `payment_expired` - Срок оплаты истек

### PaymentStatus

- `pending` - Ожидает оплаты
- `prepaid` - Предоплата внесена
- `paid` - Полностью оплачен
- `failed` - Оплата не прошла
- `refunded` - Возврат

### TransactionStatus

- `pending` - Ожидает проверки
- `confirmed` - Подтверждена
- `rejected` - Отклонена
- `expired` - Просрочена

## 🎯 Готовые фичи

✅ **Управление пользователями** с хешированием паролей  
✅ **Каталог товаров** с категориями и брендами  
✅ **Корзина** с проверкой остатков  
✅ **Заказы с предоплатой 10%** и таймером  
✅ **Система оплаты** через банковские переводы  
✅ **Избранное и сравнение** товаров (до 3 шт)  
✅ **Бонусная система** с начислением и списанием  
✅ **Промокоды** с валидацией и применением  
✅ **Автоматическая отмена** просроченных заказов

## 🔜 Планируется добавить

- ⭐ Отзывы и рейтинги
- 📱 Push-уведомления
- 👨‍💼 Админ-панель
- ⚙️ Системные настройки

---

**Создано для мобильного приложения продажи телефонов и аксессуаров** 📱
