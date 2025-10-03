-- Проверка состояния платежных транзакций и чеков

-- 1. Показать все транзакции с их статусами
SELECT 
    pt.id as transaction_id,
    pt.order_id,
    pt.bank_id,
    pt.transaction_type,
    pt.amount,
    pt.status,
    pt.receipt_image_url,
    pt.created_at,
    o.order_number,
    o.status as order_status,
    b.name as bank_name
FROM payment_transactions pt
LEFT JOIN orders o ON pt.order_id = o.id
LEFT JOIN banks b ON pt.bank_id = b.id
ORDER BY pt.created_at DESC;

-- 2. Показать только PENDING транзакции (ожидающие проверки)
SELECT 
    pt.id as transaction_id,
    pt.order_id,
    pt.amount,
    pt.receipt_image_url,
    pt.created_at,
    o.order_number,
    b.name as bank_name
FROM payment_transactions pt
LEFT JOIN orders o ON pt.order_id = o.id
LEFT JOIN banks b ON pt.bank_id = b.id
WHERE pt.status = 'pending'
ORDER BY pt.created_at DESC;

-- 3. Показать транзакции с загруженными чеками
SELECT 
    pt.id as transaction_id,
    pt.order_id,
    pt.amount,
    pt.receipt_image_url,
    pt.status,
    pt.created_at,
    o.order_number
FROM payment_transactions pt
LEFT JOIN orders o ON pt.order_id = o.id
WHERE pt.receipt_image_url IS NOT NULL
ORDER BY pt.created_at DESC;

-- 4. Показать последние заказы и их транзакции
SELECT 
    o.id as order_id,
    o.order_number,
    o.status as order_status,
    o.total_amount,
    o.created_at as order_created,
    pt.id as transaction_id,
    pt.status as transaction_status,
    pt.receipt_image_url,
    pt.created_at as transaction_created
FROM orders o
LEFT JOIN payment_transactions pt ON o.id = pt.order_id
ORDER BY o.created_at DESC
LIMIT 10;

-- 5. Очистить PENDING транзакции (ОСТОРОЖНО! Только для тестирования)
-- DELETE FROM payment_transactions WHERE status = 'pending';

-- 6. Обновить статус PENDING транзакций на EXPIRED (если нужно)
-- UPDATE payment_transactions 
-- SET status = 'expired' 
-- WHERE status = 'pending' 
-- AND created_at < NOW() - INTERVAL '1 hour';
