import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('pickup_points')
export class PickupPoint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nameEn: string;

  @Column()
  addressRu: string;

  @Column()
  addressEn: string;

  @Column()
  city: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  workingHoursRu: string;

  @Column({ nullable: true })
  workingHoursEn: string;

  @Column({ type: 'text', nullable: true })
  descriptionRu: string;

  @Column({ type: 'text', nullable: true })
  descriptionEn: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
