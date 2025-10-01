import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { DatabaseErrorFilter } from './database/database-error.filter';
import { ServiceErrorFilter } from './database/service-error.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Глобальные Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS для мобильного приложения
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Статические файлы для изображений
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Глобальные фильтры для обработки ошибок
  app.useGlobalFilters(new DatabaseErrorFilter(), new ServiceErrorFilter());

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle('📱 Mobile Phone Store API')
    .setDescription(
      'Backend API для мобильного приложения продажи телефонов и аксессуаров',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT токен',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('auth', 'Аутентификация и авторизация')
    .addTag('users', 'Управление пользователями')
    .addTag('products', 'Каталог товаров')
    .addTag('cart', 'Корзина покупок')
    .addTag('orders', 'Заказы с предоплатой')
    .addTag('payment', 'Система оплаты')
    .addTag('wishlist', 'Избранное и сравнение')
    .addTag('bonus', 'Бонусная система')
    .addTag('promo', 'Промокоды и скидки')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`🚀 Сервер запущен на http://localhost:${port}`);
  console.log(`📚 Swagger документация: http://localhost:${port}/api`);
}
bootstrap();
