-- Очистка PENDING транзакций (для тестирования)

-- 1. Показать все PENDING транзакции
SELECT 
    pt.id,
    pt.order_id,
    pt.amount,
    pt.status,
    pt.receipt_image_url,
    pt.created_at,
    o.order_number
FROM payment_transactions pt
LEFT JOIN orders o ON pt.order_id = o.id
WHERE pt.status = 'pending'
ORDER BY pt.created_at DESC;

-- 2. Удалить все PENDING транзакции (ОСТОРОЖНО!)
DELETE FROM payment_transactions WHERE status = 'pending';

-- 3. Показать результат
SELECT COUNT(*) as remaining_pending_transactions 
FROM payment_transactions 
WHERE status = 'pending';
