import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddressType } from '../../entities/user-address.entity';

export class CreateAddressDto {
  @ApiProperty({ enum: AddressType, description: 'Тип адреса' })
  @IsEnum(AddressType)
  addressType: AddressType;

  @ApiProperty({ description: 'Страна' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'Город' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Улица' })
  @IsString()
  street: string;

  @ApiProperty({ description: 'Номер дома' })
  @IsString()
  houseNumber: string;

  @ApiProperty({ description: 'Квартира', required: false })
  @IsOptional()
  @IsString()
  apartment?: string;

  @ApiProperty({ description: 'Почтовый индекс', required: false })
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiProperty({ description: 'Адрес по умолчанию', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
