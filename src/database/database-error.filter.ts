import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseErrorFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    // Проверяем, является ли ошибка проблемой подключения
    if (exception.message.includes('Connection lost') || 
        exception.message.includes('PROTOCOL_CONNECTION_LOST') ||
        exception.message.includes('ECONNRESET')) {
      
      console.error('Database connection error:', exception.message);
      
      response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        message: 'Сервис временно недоступен. Попробуйте позже.',
        error: 'Service Unavailable',
        timestamp: new Date().toISOString(),
      });
    } else {
      // Для других ошибок базы данных
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Внутренняя ошибка сервера',
        error: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
