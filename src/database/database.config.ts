import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || '147.45.157.26',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'gen_user',
  password: process.env.DB_PASSWORD || '4rX&cHtw:uy&,l',
  database: process.env.DB_DATABASE || 'phone_store_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Автоматическое создание таблиц
  logging: true,
  charset: 'utf8mb4',
  timezone: '+00:00',
};
