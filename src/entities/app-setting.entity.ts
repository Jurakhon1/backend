import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

export enum SettingType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  JSON = 'json',
}

@Entity('app_settings')
export class AppSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, name: 'setting_key' })
  settingKey: string;

  @Column({ type: 'text', name: 'setting_value' })
  settingValue: string;

  @Column({
    type: 'enum',
    enum: SettingType,
    default: SettingType.STRING,
    name: 'setting_type',
  })
  settingType: SettingType;

  @Column({ nullable: true, name: 'description_ru' })
  descriptionRu: string;

  @Column({ nullable: true, name: 'description_en' })
  descriptionEn: string;

  @Column({ name: 'is_public', default: false })
  isPublic: boolean; // доступно ли клиентскому приложению

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
