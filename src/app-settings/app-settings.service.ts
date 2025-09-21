import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppSetting, SettingType } from '../entities/app-setting.entity';
import {
  CreateAppSettingDto,
  UpdateAppSettingDto,
  AppSettingResponseDto,
} from './dto/app-setting.dto';

@Injectable()
export class AppSettingsService {
  constructor(
    @InjectRepository(AppSetting)
    private readonly appSettingRepository: Repository<AppSetting>,
  ) {}

  async create(createDto: CreateAppSettingDto): Promise<AppSettingResponseDto> {
    // Проверяем уникальность ключа
    const existingSetting = await this.appSettingRepository.findOne({
      where: { settingKey: createDto.settingKey },
    });

    if (existingSetting) {
      throw new ConflictException('Настройка с таким ключом уже существует');
    }

    const setting = this.appSettingRepository.create({
      settingKey: createDto.settingKey,
      settingValue: createDto.settingValue,
      settingType: createDto.settingType,
      descriptionRu: createDto.descriptionRu,
      descriptionEn: createDto.descriptionEn,
      isPublic: createDto.isPublic ?? false,
    });

    const savedSetting = await this.appSettingRepository.save(setting);
    return this.mapToResponseDto(savedSetting);
  }

  async findAll(publicOnly = false): Promise<AppSettingResponseDto[]> {
    const queryBuilder =
      this.appSettingRepository.createQueryBuilder('setting');

    if (publicOnly) {
      queryBuilder.where('setting.is_public = :isPublic', { isPublic: true });
    }

    const settings = await queryBuilder
      .orderBy('setting.setting_key', 'ASC')
      .getMany();

    return settings.map((setting) => this.mapToResponseDto(setting));
  }

  async findByKey(key: string): Promise<AppSettingResponseDto> {
    const setting = await this.appSettingRepository.findOne({
      where: { settingKey: key },
    });

    if (!setting) {
      throw new NotFoundException('Настройка не найдена');
    }

    return this.mapToResponseDto(setting);
  }

  async update(
    key: string,
    updateDto: UpdateAppSettingDto,
  ): Promise<AppSettingResponseDto> {
    const setting = await this.appSettingRepository.findOne({
      where: { settingKey: key },
    });

    if (!setting) {
      throw new NotFoundException('Настройка не найдена');
    }

    Object.assign(setting, updateDto);
    const updatedSetting = await this.appSettingRepository.save(setting);
    return this.mapToResponseDto(updatedSetting);
  }

  async remove(key: string): Promise<void> {
    const setting = await this.appSettingRepository.findOne({
      where: { settingKey: key },
    });

    if (!setting) {
      throw new NotFoundException('Настройка не найдена');
    }

    await this.appSettingRepository.remove(setting);
  }

  // Утилитарные методы для получения типизированных значений
  async getString(key: string, defaultValue?: string): Promise<string> {
    try {
      const setting = await this.findByKey(key);
      return setting.settingValue;
    } catch {
      return defaultValue || '';
    }
  }

  async getNumber(key: string, defaultValue?: number): Promise<number> {
    try {
      const setting = await this.findByKey(key);
      return parseFloat(setting.settingValue) || defaultValue || 0;
    } catch {
      return defaultValue || 0;
    }
  }

  async getBoolean(key: string, defaultValue?: boolean): Promise<boolean> {
    try {
      const setting = await this.findByKey(key);
      return setting.settingValue.toLowerCase() === 'true';
    } catch {
      return defaultValue || false;
    }
  }

  async getJson(key: string, defaultValue?: any): Promise<any> {
    try {
      const setting = await this.findByKey(key);
      return JSON.parse(setting.settingValue);
    } catch {
      return defaultValue || {};
    }
  }

  // Методы для инициализации настроек по умолчанию
  async initializeDefaultSettings(): Promise<void> {
    const defaultSettings = [
      {
        settingKey: 'app_name_ru',
        settingValue: 'Магазин мобильных телефонов',
        settingType: SettingType.STRING,
        descriptionRu: 'Название приложения на русском',
        descriptionEn: 'Application name in Russian',
        isPublic: true,
      },
      {
        settingKey: 'app_name_en',
        settingValue: 'Mobile Phone Store',
        settingType: SettingType.STRING,
        descriptionRu: 'Название приложения на английском',
        descriptionEn: 'Application name in English',
        isPublic: true,
      },
      {
        settingKey: 'prepayment_percentage',
        settingValue: '10',
        settingType: SettingType.NUMBER,
        descriptionRu: 'Процент предоплаты',
        descriptionEn: 'Prepayment percentage',
        isPublic: true,
      },
      {
        settingKey: 'payment_timeout_minutes',
        settingValue: '30',
        settingType: SettingType.NUMBER,
        descriptionRu: 'Таймаут оплаты в минутах',
        descriptionEn: 'Payment timeout in minutes',
        isPublic: true,
      },
      {
        settingKey: 'bonus_earn_percentage',
        settingValue: '5',
        settingType: SettingType.NUMBER,
        descriptionRu: 'Процент начисления бонусов',
        descriptionEn: 'Bonus earning percentage',
        isPublic: false,
      },
      {
        settingKey: 'free_shipping_threshold',
        settingValue: '5000',
        settingType: SettingType.NUMBER,
        descriptionRu: 'Сумма для бесплатной доставки',
        descriptionEn: 'Free shipping threshold',
        isPublic: true,
      },
      {
        settingKey: 'maintenance_mode',
        settingValue: 'false',
        settingType: SettingType.BOOLEAN,
        descriptionRu: 'Режим обслуживания',
        descriptionEn: 'Maintenance mode',
        isPublic: true,
      },
    ];

    for (const settingData of defaultSettings) {
      const existing = await this.appSettingRepository.findOne({
        where: { settingKey: settingData.settingKey },
      });

      if (!existing) {
        const setting = this.appSettingRepository.create(settingData);
        await this.appSettingRepository.save(setting);
      }
    }
  }

  private mapToResponseDto(setting: AppSetting): AppSettingResponseDto {
    return {
      id: setting.id,
      settingKey: setting.settingKey,
      settingValue: setting.settingValue,
      settingType: setting.settingType,
      descriptionRu: setting.descriptionRu,
      descriptionEn: setting.descriptionEn,
      isPublic: setting.isPublic,
      updatedAt: setting.updatedAt,
    };
  }
}
