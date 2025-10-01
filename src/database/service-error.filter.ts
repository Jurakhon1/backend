import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ServiceUnavailableException } from '@nestjs/common';

@Catch(ServiceUnavailableException)
export class ServiceErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ServiceErrorFilter.name);

  catch(exception: ServiceUnavailableException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Логируем детали ошибки
    this.logger.warn('Service unavailable error', {
      error: exception.message,
      url: request.url,
      method: request.method,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
      stack: exception.stack,
    });

    response.status(HttpStatus.SERVICE_UNAVAILABLE).json({
      statusCode: HttpStatus.SERVICE_UNAVAILABLE,
      message:
        exception.message || 'Сервис временно недоступен. Попробуйте позже.',
      error: 'Service Unavailable',
      timestamp: new Date().toISOString(),
    });
  }
}
