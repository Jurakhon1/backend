# 🔧 Исправление ошибки 500 при валидации Base64

## 🐛 Проблема

При попытке добавить base64 изображение возникала ошибка 500 (Internal Server Error).

## 🔍 Причина

### Проблема 1: Валидация base64

Метод `validateBase64` в `image.service.ts` ожидал **чистый base64 БЕЗ префикса**, но фронтенд мог отправлять данные с префиксом `data:image/jpeg;base64,`

**Старый код:**

```typescript
validateBase64(base64String: string): boolean {
  // Проверяем, что это валидный base64 (без data: префикса)
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  return base64Regex.test(base64String) && base64String.length > 0;
}
```

**Проблема:** Если base64 содержал префикс, валидация **ПАДАЛА** ❌

### Проблема 2: Двойное добавление префикса

В `products.service.ts` префикс добавлялся всегда:

```typescript
primary_image_url: `data:image/jpeg;base64,${createDto.primary_image_base64}`,
```

**Проблема:** Если `primary_image_base64` уже содержал префикс, получалось:

```
data:image/jpeg;base64,data:image/jpeg;base64,UklG... ❌
```

## ✅ Решение

### 1. Улучшена валидация Base64

**Файл:** `backend/src/services/image.service.ts`

**Новый код:**

```typescript
validateBase64(base64String: string): boolean {
  try {
    // Убираем data:image/...;base64, префикс если есть
    let cleanBase64 = base64String;
    if (base64String.startsWith('data:')) {
      const base64Match = base64String.match(/^data:image\/[a-z]+;base64,(.+)$/);
      if (base64Match && base64Match[1]) {
        cleanBase64 = base64Match[1];
      }
    }

    // Проверяем, что это валидный base64
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(cleanBase64) && cleanBase64.length > 0;
  } catch {
    return false;
  }
}
```

**Результат:**

- ✅ Принимает base64 с префиксом или без него
- ✅ Корректно валидирует оба формата
- ✅ Не падает с ошибкой 500

### 2. Добавлена функция ensureDataPrefix

**Файл:** `backend/src/products/products.service.ts`

**Новый код:**

```typescript
// Функция для добавления префикса data:image если его нет
const ensureDataPrefix = (base64: string): string => {
  if (!base64) return '';
  if (base64.startsWith('data:image/')) {
    return base64; // Уже есть префикс
  }
  return `data:image/jpeg;base64,${base64}`;
};

const newColorImage = this.colorImagesRepository.create({
  product_id: productId,
  variant_id: createDto.variant_id || null,
  primary_image_url: ensureDataPrefix(createDto.primary_image_base64),
  thumbnail_url: ensureDataPrefix(thumbnailBase64),
  gallery_urls: (createDto.gallery_base64 || []).map((base64) =>
    ensureDataPrefix(base64),
  ),
  // ...
});
```

**Результат:**

- ✅ Не добавляет префикс дважды
- ✅ Работает с данными с префиксом и без него
- ✅ Универсальное решение

## 📊 Тестовые сценарии

### Сценарий 1: Base64 без префикса

```json
{
  "primary_image_base64": "UklGRvgtAABXRUJQVlA4IOwtAAC..."
}
```

✅ Добавляется префикс → `data:image/jpeg;base64,UklGRvgtAABXRUJQVlA4IOwtAAC...`

### Сценарий 2: Base64 с префиксом

```json
{
  "primary_image_base64": "data:image/jpeg;base64,UklGRvgtAABXRUJQVlA4IOwtAAC..."
}
```

✅ Префикс не дублируется → `data:image/jpeg;base64,UklGRvgtAABXRUJQVlA4IOwtAAC...`

### Сценарий 3: Base64 с другим форматом

```json
{
  "primary_image_base64": "data:image/png;base64,iVBORw0KGgoAAA..."
}
```

✅ Сохраняется как есть → `data:image/png;base64,iVBORw0KGgoAAA...`

## 🎯 Результат

- ✅ Ошибка 500 исправлена
- ✅ Валидация работает с обоими форматами
- ✅ Префикс не дублируется
- ✅ Поддержка разных форматов изображений (jpeg, png, webp)

## 📁 Измененные файлы

1. `backend/src/services/image.service.ts` - улучшена валидация
2. `backend/src/products/products.service.ts` - добавлена функция ensureDataPrefix
