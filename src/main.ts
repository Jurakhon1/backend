import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  await app.listen(3000, '192.168.2.102');

  console.log(`🚀 Сервер запущен на http://localhost:${port}`);
  console.log(`📚 Swagger документация: http://localhost:${port}/api`);
}
bootstrap();
