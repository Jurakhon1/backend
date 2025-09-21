# 🎉 ФИНАЛЬНАЯ ДОКУМЕНТАЦИЯ API

## 📱 Мобильное приложение продажи телефонов - Backend API

### ✅ **ПОЛНОСТЬЮ ГОТОВ К РАБОТЕ**

---

## 🔐 **АУТЕНТИФИКАЦИЯ**

### **Auth Endpoints:**

```
POST   /auth/register    - Регистрация пользователя
POST   /auth/login       - Вход в систему
POST   /auth/refresh     - Обновление токенов
POST   /auth/logout      - Выход из системы
```

### **JWT Token Format:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "Иван",
    "lastName": "Иванов",
    "isVerified": false,
    "languagePreference": "ru"
  }
}
```

### **Защищенные роуты:**

- 🔒 **Все эндпоинты защищены JWT по умолчанию**
- 🔓 **Публичные эндпоинты помечены @Public()**

---

## 📊 **API ENDPOINTS**

### 🔓 **1. Публичные (без авторизации):**

```
POST   /auth/register           - Регистрация
POST   /auth/login             - Вход
POST   /auth/refresh           - Обновление токенов
GET    /products               - Каталог товаров
GET    /products/:id           - Карточка товара
GET    /products/slug/:slug    - Поиск по slug
GET    /promo                  - Активные промокоды
```

### 🔒 **2. Защищенные (требуют JWT):**

#### **👥 Users:**

```
GET    /users                  - Список пользователей (админ)
GET    /users/:id              - Профиль пользователя
PUT    /users/:id              - Обновление профиля
DELETE /users/:id              - Удаление аккаунта
PUT    /users/:id/change-password - Смена пароля
POST   /auth/logout            - Выход
```

#### **🛒 Cart (исправлено - без userId в URL):**

```
POST   /cart                   - Добавить в корзину
GET    /cart                   - Получить корзину
PUT    /cart/items/:itemId     - Обновить количество
DELETE /cart/items/:itemId     - Удалить из корзины
DELETE /cart                   - Очистить корзину
```

#### **📋 Orders:**

```
POST   /orders/user/:userId             - Создать заказ
GET    /orders/user/:userId             - История заказов
GET    /orders/user/:userId/:orderId    - Детали заказа
PUT    /orders/:orderId/confirm-payment - Подтвердить оплату
```

#### **💳 Payment:**

```
GET    /payment/banks                           - Список банков
POST   /payment/transactions                    - Загрузить чек
GET    /payment/orders/:orderId/transactions    - Транзакции заказа
PUT    /payment/transactions/:id/confirm        - Подтвердить (админ)
PUT    /payment/transactions/:id/reject         - Отклонить (админ)
```

#### **❤️ Wishlist:**

```
POST   /wishlist/:userId/products/:productId          - В избранное
DELETE /wishlist/:userId/products/:productId          - Из избранного
GET    /wishlist/:userId                              - Список избранного
POST   /wishlist/:userId/comparison/:productId        - В сравнение
GET    /wishlist/:userId/comparison                   - Список сравнения
```

#### **🎁 Bonus:**

```
GET    /bonus/users/:userId/balance      - Баланс бонусов
GET    /bonus/users/:userId/transactions - История бонусов
POST   /bonus/spend                      - Потратить бонусы
POST   /bonus/orders/:orderId/earn       - Начислить за заказ
```

#### **🏷️ Promo:**

```
POST   /promo/validate                   - Проверить промокод
POST   /promo/apply                      - Применить промокод
GET    /promo/users/:userId/usage        - История использования
```

---

## 🔄 **БИЗНЕС-ПРОЦЕССЫ**

### **1. 📝 Регистрация и вход:**

```
1. POST /auth/register → получить JWT токены
2. Сохранить accessToken для API запросов
3. Использовать refreshToken для обновления
```

### **2. 🛒 Работа с корзиной:**

```
1. POST /cart (с JWT) → добавить товар
2. GET /cart (с JWT) → получить корзину
3. PUT /cart/items/:id (с JWT) → изменить количество
```

### **3. 📦 Оформление заказа:**

```
1. POST /orders/user/:userId → создать заказ (10% предоплата)
2. GET /payment/banks → выбрать банк
3. POST /payment/transactions → загрузить чек
4. Админ: PUT /payment/transactions/:id/confirm → подтвердить
```

### **4. 🎁 Бонусы:**

```
1. GET /bonus/users/:userId/balance → проверить баланс
2. POST /bonus/spend → потратить при заказе
3. Автоматически: POST /bonus/orders/:id/earn → начислить 5%
```

---

## 🔧 **ТЕХНИЧЕСКИЕ ДЕТАЛИ**

### **JWT Configuration:**

- **Access Token**: 1 час
- **Refresh Token**: 7 дней
- **Secret**: настраивается в ENV

### **Database:**

- **synchronize: true** - автосоздание таблиц
- **SSL: true** - для Neon DB
- **camelCase** naming в коде
- **snake_case** в БД

### **Validation:**

- **Глобальные ValidationPipes** включены
- **transform: true** - автопреобразование типов
- **whitelist: true** - фильтрация лишних полей

### **CORS:**

- **Включен** для мобильного приложения
- **credentials: true** - поддержка cookies

---

## 🚀 **ЗАПУСК ПРОЕКТА**

### **1. Установка:**

```bash
cd backend
npm install
```

### **2. Настройка ENV:**

```env
DB_HOST=ep-wispy-scene-ad9kw2ak-pooler.c-2.us-east-1.aws.neon.tech
DB_USERNAME=neondb_owner
DB_PASSWORD=npg_8wrJUQdLS7vu
DB_DATABASE=neondb
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
```

### **3. Запуск:**

```bash
npm run start:dev
```

### **4. Проверка:**

```bash
curl http://localhost:3000/products
```

---

## 📱 **ДЛЯ FLUTTER РАЗРАБОТЧИКА**

### **API Base URL:**

```dart
const String baseUrl = 'http://localhost:3000';
```

### **Заголовки для защищенных роутов:**

```dart
{
  'Authorization': 'Bearer $accessToken',
  'Content-Type': 'application/json',
}
```

### **Пример регистрации:**

```dart
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "Иван",
  "lastName": "Иванов",
  "phone": "+79123456789",
  "languagePreference": "ru"
}
```

### **Пример работы с корзиной:**

```dart
// Добавить в корзину (с JWT)
POST /cart
{
  "product_id": 1,
  "quantity": 2
}

// Получить корзину (с JWT)
GET /cart
```

---

## ✅ **ГОТОВЫЕ ФИЧИ**

- 🔐 **JWT аутентификация** с refresh токенами
- 🛒 **Корзина** с авторизацией через JWT
- 📦 **Заказы с предоплатой 10%** и таймером
- 💳 **Система оплаты** через банки
- 🎁 **Бонусная система** с автоначислением
- 🏷️ **Промокоды** с валидацией
- ❤️ **Избранное и сравнение**
- 🔧 **Глобальная валидация** данных
- 📊 **camelCase** naming convention

---

**🚀 Backend полностью готов к интеграции с Flutter приложением!**

_Все эндпоинты протестированы, JWT работает, база данных настроена_ ✨
