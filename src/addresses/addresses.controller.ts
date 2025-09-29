import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressResponseDto } from './dto/address-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('addresses')
@ApiBearerAuth('JWT-auth')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все адреса пользователя' })
  @ApiResponse({ status: 200, description: 'Список адресов', type: [AddressResponseDto] })
  async getUserAddresses(@CurrentUser() user: any): Promise<AddressResponseDto[]> {
    return await this.addressesService.getUserAddresses(user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать новый адрес' })
  @ApiResponse({ status: 201, description: 'Адрес создан', type: AddressResponseDto })
  async createAddress(
    @CurrentUser() user: any,
    @Body(ValidationPipe) createAddressDto: CreateAddressDto,
  ): Promise<AddressResponseDto> {
    return await this.addressesService.createAddress(user.id, createAddressDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить адрес по ID' })
  @ApiResponse({ status: 200, description: 'Адрес найден', type: AddressResponseDto })
  async getAddress(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AddressResponseDto> {
    return await this.addressesService.getAddress(user.id, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить адрес' })
  @ApiResponse({ status: 200, description: 'Адрес обновлен', type: AddressResponseDto })
  async updateAddress(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateAddressDto: UpdateAddressDto,
  ): Promise<AddressResponseDto> {
    return await this.addressesService.updateAddress(user.id, id, updateAddressDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить адрес' })
  @ApiResponse({ status: 204, description: 'Адрес удален' })
  async deleteAddress(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return await this.addressesService.deleteAddress(user.id, id);
  }

  @Put(':id/set-default')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Установить адрес по умолчанию' })
  @ApiResponse({ status: 204, description: 'Адрес установлен по умолчанию' })
  async setDefaultAddress(
    @CurrentUser() user: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return await this.addressesService.setDefaultAddress(user.id, id);
  }
}
