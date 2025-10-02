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
  account_number?: string;
  recipient_name: string;
  recipient_inn?: string;
  bank_bik?: string;
  bank_name: string;
  bank_address?: string;
  payment_instructions_ru: string;
  payment_instructions_en: string;
  payment_steps_ru?: string[];
  payment_steps_en?: string[];
  screenshot_urls?: string[];
  prepayment_percent?: number;
  payment_timeout_minutes?: number;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;

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
  receipt_image_url?: string | null;
  receipt_image_base64?: string | null;
  admin_notes?: string | null;
  confirmed_at?: Date;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<PaymentTransactionResponseDto>) {
    Object.assign(this, partial);
  }
}
