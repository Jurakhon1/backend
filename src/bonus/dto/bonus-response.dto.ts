import { BonusTransactionType } from '../../entities/bonus-transaction.entity';

export class BonusTransactionResponseDto {
  id: number;
  transaction_type: BonusTransactionType;
  amount: number;
  order_id?: number;
  description_ru?: string;
  description_en?: string;
  expires_at?: Date;
  created_at: Date;

  constructor(partial: Partial<BonusTransactionResponseDto>) {
    Object.assign(this, partial);
  }
}

export class BonusBalanceResponseDto {
  user_id: number;
  total_earned: number;
  total_spent: number;
  total_expired: number;
  current_balance: number;
  expiring_soon: number; // бонусы, которые скоро сгорят (в течение 30 дней)

  constructor(partial: Partial<BonusBalanceResponseDto>) {
    Object.assign(this, partial);
  }
}
