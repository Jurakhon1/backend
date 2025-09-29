import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Проверяем существование пользователя с таким email
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Хешируем пароль
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    // Создаем пользователя
    const {
      password,
      first_name,
      last_name,
      language_preference,
      ...userData
    } = createUserDto;
    const userDataWithHash = {
      ...userData,
      passwordHash,
      firstName: first_name,
      lastName: last_name,
      languagePreference: language_preference,
    };

    const user = this.usersRepository.create(userDataWithHash);
    const savedUser = await this.usersRepository.save(user);

    return new UserResponseDto(savedUser);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => new UserResponseDto(user));
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return new UserResponseDto(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { phone } });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    console.log('UsersService.update: Получены данные:', updateUserDto);
    console.log('UsersService.update: Тип данных:', typeof updateUserDto);
    console.log('UsersService.update: Ключи:', Object.keys(updateUserDto));
    console.log('UsersService.update: first_name:', updateUserDto.first_name);
    console.log('UsersService.update: last_name:', updateUserDto.last_name);
    
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Проверяем уникальность email при обновлении
    if (
      'email' in updateUserDto &&
      updateUserDto.email &&
      updateUserDto.email !== user.email
    ) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException(
          'Пользователь с таким email уже существует',
        );
      }
    }

    console.log('UsersService.update: Обновляем пользователя с ID:', id);
    console.log('UsersService.update: Данные для обновления:', updateUserDto);
    
    // Преобразуем поля из snake_case в camelCase для TypeORM
    const updateData: any = {};
    if ('first_name' in updateUserDto) updateData.firstName = updateUserDto.first_name;
    if ('last_name' in updateUserDto) updateData.lastName = updateUserDto.last_name;
    if ('language_preference' in updateUserDto) updateData.languagePreference = updateUserDto.language_preference;
    if ('is_active' in updateUserDto) updateData.isActive = updateUserDto.is_active;
    if ('is_verified' in updateUserDto) updateData.isVerified = updateUserDto.is_verified;
    if ('email' in updateUserDto) updateData.email = updateUserDto.email;
    if ('phone' in updateUserDto) updateData.phone = updateUserDto.phone;
    
    console.log('UsersService.update: Преобразованные данные для TypeORM:', updateData);
    console.log('UsersService.update: firstName в updateData:', updateData.firstName);
    console.log('UsersService.update: lastName в updateData:', updateData.lastName);
    
    const updateResult = await this.usersRepository.update(id, updateData);
    console.log('UsersService.update: Результат обновления:', updateResult);
    
    const updatedUser = await this.usersRepository.findOne({ where: { id } });
    console.log('UsersService.update: Пользователь после обновления:', updatedUser);
    
    if (!updatedUser) {
      throw new NotFoundException('Пользователь не найден после обновления');
    }
    
    const response = new UserResponseDto(updatedUser);
    console.log('UsersService.update: Ответ для клиента:', response);
    return response;
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Пользователь не найден');
    }
  }

  async verifyPassword(user: User, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.passwordHash);
  }

  async changePassword(id: number, newPassword: string): Promise<void> {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    const result = await this.usersRepository.update(id, { passwordHash });
    if (result.affected === 0) {
      throw new NotFoundException('Пользователь не найден');
    }
  }
}
