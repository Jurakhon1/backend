import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../entities/user.entity';
import { PERMISSIONS_KEY, Permission } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    
    if (!requiredPermissions) {
      return true; // Если разрешения не указаны, доступ разрешен
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      return false; // Пользователь не авторизован
    }

    // Супер админ имеет все разрешения
    if (user.role === UserRole.SUPER_ADMIN) {
      return true;
    }

    // Получаем разрешения пользователя
    const userPermissions = this.getUserPermissions(user.role, user.permissions || []);
    
    // Проверяем, есть ли у пользователя все требуемые разрешения
    return requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );
  }

  private getUserPermissions(role: UserRole, customPermissions: string[]): string[] {
    const rolePermissions = this.getRolePermissions(role);
    return [...rolePermissions, ...customPermissions];
  }

  private getRolePermissions(role: UserRole): string[] {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return Object.values(Permission); // Все разрешения
        
      case UserRole.ADMIN:
        return [
          Permission.USERS_READ,
          Permission.USERS_WRITE,
          Permission.PRODUCTS_READ,
          Permission.PRODUCTS_WRITE,
          Permission.ORDERS_READ,
          Permission.ORDERS_WRITE,
          Permission.ORDERS_CONFIRM_PAYMENT,
          Permission.REVIEWS_READ,
          Permission.REVIEWS_MODERATE,
          Permission.PROMO_CODES_READ,
          Permission.PROMO_CODES_WRITE,
          Permission.BONUS_READ,
          Permission.BONUS_WRITE,
          Permission.ANALYTICS_READ,
          Permission.NOTIFICATIONS_SEND,
        ];
        
      case UserRole.MANAGER:
        return [
          Permission.USERS_READ,
          Permission.PRODUCTS_READ,
          Permission.ORDERS_READ,
          Permission.ORDERS_WRITE,
          Permission.ORDERS_CONFIRM_PAYMENT,
          Permission.REVIEWS_READ,
          Permission.REVIEWS_MODERATE,
          Permission.PROMO_CODES_READ,
          Permission.BONUS_READ,
          Permission.ANALYTICS_READ,
        ];
        
      case UserRole.SUPPORT:
        return [
          Permission.USERS_READ,
          Permission.ORDERS_READ,
          Permission.REVIEWS_READ,
          Permission.BONUS_READ,
        ];
        
      case UserRole.PREMIUM:
      case UserRole.USER:
      default:
        return []; // Обычные пользователи не имеют административных разрешений
    }
  }
}
