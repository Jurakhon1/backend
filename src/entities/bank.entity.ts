import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('banks')
export class Bank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'name_en' })
  nameEn: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ name: 'card_number' })
  cardNumber: string;

  @Column({ name: 'account_number', nullable: true })
  accountNumber: string;

  @Column({ name: 'recipient_name' })
  recipientName: string;

  @Column({ name: 'recipient_inn', nullable: true })
  recipientInn: string;

  @Column({ name: 'bank_bik', nullable: true })
  bankBik: string;

  @Column({ name: 'bank_name' })
  bankName: string;

  @Column({ type: 'text', nullable: true, name: 'bank_address' })
  bankAddress: string;

  @Column({ type: 'text', name: 'payment_instructions_ru' })
  paymentInstructionsRu: string;

  @Column({ type: 'text', name: 'payment_instructions_en' })
  paymentInstructionsEn: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
