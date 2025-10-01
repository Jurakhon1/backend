-- Скрипт оптимизации настроек MySQL для улучшения производительности
-- Выполнить на продакшн базе данных

-- 1. Увеличить лимит соединений
SET GLOBAL max_connections = 200;

-- 2. Оптимизировать таймауты
SET GLOBAL wait_timeout = 28800;
SET GLOBAL interactive_timeout = 28800;
SET GLOBAL net_read_timeout = 60;
SET GLOBAL net_write_timeout = 60;
SET GLOBAL connect_timeout = 10;

-- 3. Оптимизировать InnoDB настройки
SET GLOBAL innodb_buffer_pool_size = 1073741824; -- 1GB (настройте под вашу систему)
SET GLOBAL innodb_log_file_size = 268435456; -- 256MB
SET GLOBAL innodb_flush_log_at_trx_commit = 2; -- Улучшает производительность записи
SET GLOBAL innodb_flush_method = O_DIRECT; -- Прямая запись на диск
SET GLOBAL innodb_file_per_table = 1; -- Отдельный файл для каждой таблицы

-- 4. Оптимизировать кэширование запросов
SET GLOBAL query_cache_type = 1;
SET GLOBAL query_cache_size = 67108864; -- 64MB
SET GLOBAL query_cache_limit = 1048576; -- 1MB

-- 5. Оптимизировать сортировку и группировку
SET GLOBAL sort_buffer_size = 2097152; -- 2MB
SET GLOBAL read_buffer_size = 131072; -- 128KB
SET GLOBAL read_rnd_buffer_size = 262144; -- 256KB

-- 6. Оптимизировать временные таблицы
SET GLOBAL tmp_table_size = 67108864; -- 64MB
SET GLOBAL max_heap_table_size = 67108864; -- 64MB

-- 7. Оптимизировать блокировки
SET GLOBAL innodb_lock_wait_timeout = 50; -- Уменьшить время ожидания блокировки
SET GLOBAL innodb_deadlock_detect = ON; -- Включить обнаружение deadlock'ов

-- 8. Оптимизировать логирование
SET GLOBAL slow_query_log = 1;
SET GLOBAL long_query_time = 2; -- Логировать запросы дольше 2 секунд
SET GLOBAL log_queries_not_using_indexes = 1;

-- 9. Оптимизировать соединения
SET GLOBAL thread_cache_size = 16;
SET GLOBAL table_open_cache = 2000;
SET GLOBAL table_definition_cache = 1400;

-- 10. Оптимизировать память
SET GLOBAL key_buffer_size = 134217728; -- 128MB для MyISAM
SET GLOBAL max_allowed_packet = 67108864; -- 64MB

-- Проверка текущих настроек
SELECT 
    VARIABLE_NAME,
    VARIABLE_VALUE,
    'Current Setting' as STATUS
FROM information_schema.GLOBAL_VARIABLES 
WHERE VARIABLE_NAME IN (
    'max_connections',
    'wait_timeout',
    'interactive_timeout',
    'net_read_timeout',
    'net_write_timeout',
    'connect_timeout',
    'innodb_buffer_pool_size',
    'innodb_log_file_size',
    'innodb_flush_log_at_trx_commit',
    'query_cache_size',
    'sort_buffer_size',
    'read_buffer_size',
    'tmp_table_size',
    'max_heap_table_size',
    'innodb_lock_wait_timeout',
    'thread_cache_size',
    'table_open_cache',
    'key_buffer_size',
    'max_allowed_packet'
)
ORDER BY VARIABLE_NAME;

-- Проверка статуса соединений
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Max_used_connections';
SHOW STATUS LIKE 'Connections';

-- Проверка производительности InnoDB
SHOW STATUS LIKE 'Innodb_buffer_pool%';
SHOW STATUS LIKE 'Innodb_log%';

-- Проверка кэша запросов
SHOW STATUS LIKE 'Qcache%';

-- Проверка медленных запросов
SHOW STATUS LIKE 'Slow_queries';

-- Рекомендации по дальнейшей оптимизации
SELECT 
    'Рекомендации по оптимизации:' as INFO,
    '1. Создайте индексы для часто используемых запросов' as RECOMMENDATION_1,
    '2. Используйте EXPLAIN для анализа запросов' as RECOMMENDATION_2,
    '3. Регулярно анализируйте slow query log' as RECOMMENDATION_3,
    '4. Мониторьте использование памяти и CPU' as RECOMMENDATION_4,
    '5. Рассмотрите возможность использования read replicas' as RECOMMENDATION_5;
