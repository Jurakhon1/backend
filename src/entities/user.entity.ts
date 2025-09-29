import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserAddress } from './user-address.entity';
import { Review } from './review.entity';
import { Notification } from './notification.entity';
import { UserSocialAccount } from './user-social-account.entity';
import { ProductComparison } from './product-comparison.entity';
import { Order } from './order.entity';
import { BonusTransaction } from './bonus-transaction.entity';
import { PromoCodeUsage } from './promo-code-usage.entity';
import { CartItem } from './cart-item.entity';
import { WishlistItem } from './wishlist-item.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: ['male', 'female', 'other'],
    nullable: true,
  })
  gender: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({
    name: 'language_preference',
    type: 'enum',
    enum: ['ru', 'en'],
    default: 'ru',
  })
  languagePreference: string;

  @Column({
    type: 'enum',
    enum: ['light', 'dark', 'auto'],
    default: 'auto',
  })
  themePreference: string;

  @OneToMany(() => UserAddress, (address) => address.user)
  addresses: UserAddress[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => UserSocialAccount, (socialAccount) => socialAccount.user)
  socialAccounts: UserSocialAccount[];

  @OneToMany(() => ProductComparison, (comparison) => comparison.user)
  productComparisons: ProductComparison[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(
    () => BonusTransaction,
    (bonusTransaction) => bonusTransaction.user,
  )
  bonusTransactions: BonusTransaction[];

  @OneToMany(() => PromoCodeUsage, (promoUsage) => promoUsage.user)
  promoCodeUsages: PromoCodeUsage[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.user)
  cartItems: CartItem[];

  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.user)
  wishlistItems: WishlistItem[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
