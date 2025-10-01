import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseErrorFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Логируем детали ошибки
    this.logger.error('Database error occurred', {
      error: exception.message,
      code: (exception as any).code,
      sqlState: (exception as any).sqlState,
      errno: (exception as any).errno,
      query: (exception as any).query,
      parameters: (exception as any).parameters,
      url: request.url,
      method: request.method,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    });

    // Проверяем различные типы ошибок подключения
    const isConnectionError =
      exception.message.includes('Connection lost') ||
      exception.message.includes('PROTOCOL_CONNECTION_LOST') ||
      exception.message.includes('ECONNRESET') ||
      exception.message.includes('ECONNREFUSED') ||
      exception.message.includes('ETIMEDOUT') ||
      exception.message.includes('Connection timeout') ||
      exception.message.includes('Connection closed') ||
      (exception as any).code === 'ECONNRESET' ||
      (exception as any).code === 'ECONNREFUSED' ||
      (exception as any).code === 'ETIMEDOUT' ||
      (exception as any).errno === -104 ||
      (exception as any).errno === -111 ||
      (exception as any).errno === -110;

    // Проверяем ошибки блокировки
    const isLockError =
      exception.message.includes('Lock wait timeout') ||
      exception.message.includes('Deadlock found') ||
      exception.message.includes('innodb_lock_wait_timeout') ||
      (exception as any).code === 'ER_LOCK_WAIT_TIMEOUT' ||
      (exception as any).code === 'ER_LOCK_DEADLOCK';

    // Проверяем ошибки переполнения пула соединений
    const isPoolError =
      exception.message.includes('Too many connections') ||
      exception.message.includes('Connection pool exhausted') ||
      (exception as any).code === 'ER_CON_COUNT_ERROR';

    if (isConnectionError) {
      this.logger.warn('Database connection error detected', {
        error: exception.message,
        code: (exception as any).code,
        errno: (exception as any).errno,
      });

      response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Сервис временно недоступен. Попробуйте позже.',
        error: 'Service Unavailable',
        timestamp: new Date().toISOString(),
        details: 'Проблема с подключением к базе данных',
      });
    } else if (isLockError) {
      this.logger.warn('Database lock error detected', {
        error: exception.message,
        code: (exception as any).code,
      });

      response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Сервис временно недоступен. Попробуйте позже.',
        error: 'Service Unavailable',
        timestamp: new Date().toISOString(),
        details: 'Временная блокировка базы данных',
      });
    } else if (isPoolError) {
      this.logger.warn('Database connection pool error detected', {
        error: exception.message,
        code: (exception as any).code,
      });

      response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Сервис временно недоступен. Попробуйте позже.',
        error: 'Service Unavailable',
        timestamp: new Date().toISOString(),
        details: 'Превышен лимит подключений к базе данных',
      });
    } else {
      // Для других ошибок базы данных
      this.logger.error('Database query error', {
        error: exception.message,
        code: (exception as any).code,
        query: (exception as any).query,
      });

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Внутренняя ошибка сервера',
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        details: 'Ошибка выполнения запроса к базе данных',
      });
    }
  }
}
