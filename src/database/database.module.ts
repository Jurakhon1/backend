import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Category } from '../entities/category.entity';
import { Brand } from '../entities/brand.entity';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductSpecification } from '../entities/product-specification.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import { ProductVariantCombination } from '../entities/product-variant-combination.entity';
import { ProductColorImage } from '../entities/product-color-image.entity';
import { ProductRelation } from '../entities/product-relation.entity';
import { UserAddress } from '../entities/user-address.entity';
import { UserSocialAccount } from '../entities/user-social-account.entity';
import { CartItem } from '../entities/cart-item.entity';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Bank } from '../entities/bank.entity';
import { PickupPoint } from '../entities/pickup-point.entity';
import { PaymentTransaction } from '../entities/payment-transaction.entity';
import { BonusTransaction } from '../entities/bonus-transaction.entity';
import { PromoCode } from '../entities/promo-code.entity';
import { PromoCodeUsage } from '../entities/promo-code-usage.entity';
import { Review } from '../entities/review.entity';
import { ReviewHelpfulness } from '../entities/review-helpfulness.entity';
import { WishlistItem } from '../entities/wishlist-item.entity';
import { ProductComparison } from '../entities/product-comparison.entity';
import { Notification } from '../entities/notification.entity';
import { Admin } from '../entities/admin.entity';
import { AppSetting } from '../entities/app-setting.entity';
import { RefreshToken } from '../entities/refresh-token.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '147.45.157.26',
      port: 3306,
      username: 'gen_user',
      password: '4rX&cHtw:uy&,l',
      database: 'phone_store_db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false, // Отключаем автоматическое создание таблиц
      logging: true,
      charset: 'utf8mb4',
      timezone: '+00:00',
      // Настройки для стабильности соединения
      extra: {
        connectionLimit: 10,
        acquireTimeout: 60000,
        timeout: 60000,
        reconnect: true,
        idleTimeout: 300000,
        keepAliveInitialDelay: 0,
        enableKeepAlive: true,
      },
      // Автоматическое переподключение
      retryAttempts: 5,
      retryDelay: 5000,
      autoLoadEntities: true,
    }),
  ],
})
export class DatabaseModule {}
