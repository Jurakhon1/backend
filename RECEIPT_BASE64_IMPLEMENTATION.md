# Реализация загрузки чеков в формате Base64

## Обзор изменений

Система загрузки чеков была обновлена для сохранения изображений в формате Base64 непосредственно в базе данных вместо сохранения файлов на диске.

## Внесенные изменения

### 1. Сущность PaymentTransaction
- **Файл**: `src/entities/payment-transaction.entity.ts`
- **Изменение**: Добавлено поле `receiptImageBase64` типа `LONGTEXT`
- **Назначение**: Хранение Base64 данных изображения чека

```typescript
@Column({ type: 'longtext', nullable: true, name: 'receipt_image_base64' })
receiptImageBase64: string | null;
```

### 2. PaymentService
- **Файл**: `src/payment/payment.service.ts`
- **Изменения**:
  - Обновлен метод `uploadReceiptBase64()` для сохранения Base64 в БД
  - Добавлена валидация Base64 данных
  - Убрана логика сохранения файлов на диск
  - Обновлен метод `buildTransactionResponse()` для включения Base64 данных

### 3. DTO обновления
- **Файл**: `src/payment/dto/upload-receipt-base64.dto.ts`
- **Изменения**:
  - Добавлена валидация расширения файла через regex
  - Добавлено опциональное поле `mime_type`

- **Файл**: `src/payment/dto/payment-response.dto.ts`
- **Изменения**:
  - Добавлено поле `receipt_image_base64` в `PaymentTransactionResponseDto`

### 4. PaymentController
- **Файл**: `src/payment/payment.controller.ts`
- **Изменения**:
  - Добавлен endpoint `POST /payment/transactions/:transactionId/upload-receipt-base64`
  - Импортирован `UploadReceiptBase64Dto`

### 5. База данных
- **Файл**: `add-receipt-image-base64-field.sql`
- **Изменение**: SQL скрипт для добавления поля `receipt_image_base64`

```sql
ALTER TABLE payment_transactions 
ADD COLUMN receipt_image_base64 LONGTEXT NULL 
COMMENT 'Base64 данные изображения чека';
```

## API Endpoints

### Загрузка чека в Base64 формате
```
POST /payment/transactions/:transactionId/upload-receipt-base64
```

**Тело запроса:**
```json
{
  "base64_image": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "file_extension": "png",
  "mime_type": "image/png"
}
```

**Ответ:**
```json
{
  "id": 1,
  "order_id": 1,
  "bank": { ... },
  "transaction_type": "prepayment",
  "amount": 1000.00,
  "status": "pending",
  "receipt_image_url": null,
  "receipt_image_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "admin_notes": null,
  "confirmed_at": null,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## Валидация

1. **Расширение файла**: Только jpg, jpeg, png, gif
2. **Base64 данные**: Проверка корректности формата
3. **Статус транзакции**: Только PENDING транзакции могут иметь чеки

## Преимущества

1. **Упрощение**: Нет необходимости в файловой системе
2. **Портативность**: Данные хранятся в БД
3. **Безопасность**: Нет риска потери файлов
4. **Производительность**: Прямой доступ к данным через API

## Тестирование

Используйте тестовый скрипт:
```bash
node test-receipt-base64-updated.js
```

## Миграция

Выполните SQL скрипт для добавления нового поля:
```bash
mysql -u username -p database_name < add-receipt-image-base64-field.sql
```

## Обратная совместимость

- Старые транзакции с `receipt_image_url` продолжают работать
- Новые транзакции используют `receipt_image_base64`
- API поддерживает оба формата в ответах
