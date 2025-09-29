import { ApiProperty } from '@nestjs/swagger';
import { AddressType } from '../../entities/user-address.entity';

export class AddressResponseDto {
  @ApiProperty({ description: 'ID адреса' })
  id: number;

  @ApiProperty({ enum: AddressType, description: 'Тип адреса' })
  addressType: AddressType;

  @ApiProperty({ description: 'Страна' })
  country: string;

  @ApiProperty({ description: 'Город' })
  city: string;

  @ApiProperty({ description: 'Улица' })
  street: string;

  @ApiProperty({ description: 'Номер дома' })
  houseNumber: string;

  @ApiProperty({ description: 'Квартира', required: false })
  apartment?: string;

  @ApiProperty({ description: 'Почтовый индекс', required: false })
  postalCode?: string;

  @ApiProperty({ description: 'Адрес по умолчанию' })
  isDefault: boolean;

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;

  constructor(partial: Partial<AddressResponseDto>) {
    Object.assign(this, partial);
  }
}
