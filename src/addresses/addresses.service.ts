import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddress, AddressType } from '../entities/user-address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressResponseDto } from './dto/address-response.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(UserAddress)
    private addressesRepository: Repository<UserAddress>,
  ) {}

  async getUserAddresses(userId: number): Promise<AddressResponseDto[]> {
    const addresses = await this.addressesRepository.find({
      where: { user: { id: userId } },
      order: { isDefault: 'DESC', createdAt: 'DESC' },
    });

    return addresses.map((address) => new AddressResponseDto(address));
  }

  async createAddress(
    userId: number,
    createAddressDto: CreateAddressDto,
  ): Promise<AddressResponseDto> {
    // Если это первый адрес пользователя, делаем его адресом по умолчанию
    const existingAddresses = await this.addressesRepository.count({
      where: { user: { id: userId } },
    });

    const address = this.addressesRepository.create({
      ...createAddressDto,
      user: { id: userId },
      isDefault: existingAddresses === 0, // Первый адрес по умолчанию
    });

    const savedAddress = await this.addressesRepository.save(address);
    return new AddressResponseDto(savedAddress);
  }

  async getAddress(userId: number, addressId: number): Promise<AddressResponseDto> {
    const address = await this.addressesRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new NotFoundException('Адрес не найден');
    }

    return new AddressResponseDto(address);
  }

  async updateAddress(
    userId: number,
    addressId: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    const address = await this.addressesRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new NotFoundException('Адрес не найден');
    }

    // Обновляем поля
    Object.assign(address, updateAddressDto);
    const updatedAddress = await this.addressesRepository.save(address);

    return new AddressResponseDto(updatedAddress);
  }

  async deleteAddress(userId: number, addressId: number): Promise<void> {
    const address = await this.addressesRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new NotFoundException('Адрес не найден');
    }

    await this.addressesRepository.remove(address);
  }

  async setDefaultAddress(userId: number, addressId: number): Promise<void> {
    const address = await this.addressesRepository.findOne({
      where: { id: addressId, user: { id: userId } },
    });

    if (!address) {
      throw new NotFoundException('Адрес не найден');
    }

    // Снимаем флаг по умолчанию со всех адресов пользователя
    await this.addressesRepository.update(
      { user: { id: userId } },
      { isDefault: false },
    );

    // Устанавливаем флаг по умолчанию для выбранного адреса
    await this.addressesRepository.update(addressId, { isDefault: true });
  }
}
