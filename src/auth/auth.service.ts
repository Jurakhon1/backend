import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      if (!user.isActive) {
        throw new UnauthorizedException('Аккаунт деактивирован');
      }
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user);

    return new AuthResponseDto({
      accessToken,
      refreshToken: refreshToken.token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        isVerified: user.isVerified,
        languagePreference: user.languagePreference,
      },
    });
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    // Проверяем существование пользователя
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Создаем пользователя
    const createUserDto = {
      email: registerDto.email,
      phone: registerDto.phone,
      password: registerDto.password,
      first_name: registerDto.firstName,
      last_name: registerDto.lastName,
      language_preference: registerDto.languagePreference || 'ru',
    };

    const newUser = await this.usersService.create(createUserDto);

    // Автоматически логиним пользователя
    const payload: JwtPayload = {
      sub: newUser.id,
      email: newUser.email,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken({
      id: newUser.id,
      email: newUser.email,
    });

    return new AuthResponseDto({
      accessToken,
      refreshToken: refreshToken.token,
      user: {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        isActive: newUser.isActive,
        isVerified: newUser.isVerified,
        languagePreference: newUser.languagePreference,
      },
    });
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponseDto> {
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, isRevoked: false },
      relations: ['user'],
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Недействительный refresh token');
    }

    // Отзываем старый токен
    tokenRecord.isRevoked = true;
    await this.refreshTokenRepository.save(tokenRecord);

    // Создаем новые токены
    const user = tokenRecord.user;
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = await this.generateRefreshToken(user);

    return new AuthResponseDto({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        isVerified: user.isVerified,
        languagePreference: user.languagePreference,
      },
    });
  }

  async logout(refreshToken: string): Promise<void> {
    await this.refreshTokenRepository.update(
      { token: refreshToken },
      { isRevoked: true },
    );
  }

  private async generateRefreshToken(user: {
    id: number;
    email: string;
  }): Promise<RefreshToken> {
    const token = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '7d' },
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokenRepository.create({
      token,
      user: { id: user.id } as User,
      expiresAt,
    });

    return await this.refreshTokenRepository.save(refreshToken);
  }

  async cleanupExpiredTokens(): Promise<void> {
    await this.refreshTokenRepository.delete({
      expiresAt: new Date(),
    });
  }
}
