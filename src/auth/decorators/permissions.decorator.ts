import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions);

// Список разрешений в системе
export enum Permission {
  // Управление пользователями
  USERS_READ = 'users:read',
  USERS_WRITE = 'users:write',
  USERS_DELETE = 'users:delete',
  
  // Управление товарами
  PRODUCTS_READ = 'products:read',
  PRODUCTS_WRITE = 'products:write',
  PRODUCTS_DELETE = 'products:delete',
  
  // Управление заказами
  ORDERS_READ = 'orders:read',
  ORDERS_WRITE = 'orders:write',
  ORDERS_CANCEL = 'orders:cancel',
  ORDERS_CONFIRM_PAYMENT = 'orders:confirm_payment',
  
  // Управление отзывами
  REVIEWS_READ = 'reviews:read',
  REVIEWS_MODERATE = 'reviews:moderate',
  REVIEWS_DELETE = 'reviews:delete',
  
  // Управление промокодами
  PROMO_CODES_READ = 'promo_codes:read',
  PROMO_CODES_WRITE = 'promo_codes:write',
  PROMO_CODES_DELETE = 'promo_codes:delete',
  
  // Управление бонусами
  BONUS_READ = 'bonus:read',
  BONUS_WRITE = 'bonus:write',
  
  // Управление настройками
  SETTINGS_READ = 'settings:read',
  SETTINGS_WRITE = 'settings:write',
  
  // Системная аналитика
  ANALYTICS_READ = 'analytics:read',
  
  // Управление уведомлениями
  NOTIFICATIONS_SEND = 'notifications:send',
}
