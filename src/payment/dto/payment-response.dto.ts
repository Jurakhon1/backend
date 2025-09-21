import {
  TransactionType,
  TransactionStatus,
} from '../../entities/payment-transaction.entity';

export class BankResponseDto {
  id: number;
  name: string;
  name_en: string;
  logo_url?: string;
  card_number: string;
  recipient_name: string;
  payment_instructions_ru: string;
  payment_instructions_en: string;
  sort_order: number;

  constructor(partial: Partial<BankResponseDto>) {
    Object.assign(this, partial);
  }
}

export class PaymentTransactionResponseDto {
  id: number;
  order_id: number;
  bank: BankResponseDto;
  transaction_type: TransactionType;
  amount: number;
  status: TransactionStatus;
  receipt_image_url?: string;
  admin_notes?: string | null;
  confirmed_at?: Date;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<PaymentTransactionResponseDto>) {
    Object.assign(this, partial);
  }
}
