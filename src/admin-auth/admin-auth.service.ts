import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Admin } from '../entities/admin.entity';
import { AdminRefreshToken } from '../entities/admin-refresh-token.entity';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminAuthResponseDto } from './dto/admin-auth-response.dto';

export interface AdminJwtPayload {
  sub: number;
  email: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(AdminRefreshToken)
    private readonly refreshTokenRepository: Repository<AdminRefreshToken>,
    private readonly jwtService: JwtService,
  ) {}

  async validateAdmin(email: string, password: string): Promise<Admin | null> {
    const admin = await this.adminRepository.findOne({
      where: { email, isActive: true },
    });

    if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
      return admin;
    }
    return null;
  }

  async login(loginDto: AdminLoginDto): Promise<AdminAuthResponseDto> {
    const admin = await this.validateAdmin(loginDto.email, loginDto.password);
    if (!admin) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Обновляем время последнего входа
    admin.lastLoginAt = new Date();
    await this.adminRepository.save(admin);

    const payload: AdminJwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions || [],
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = await this.generateRefreshToken(admin);

    return new AdminAuthResponseDto({
      accessToken,
      refreshToken: refreshToken.token,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        permissions: admin.permissions || [],
        isActive: admin.isActive,
        lastLoginAt: admin.lastLoginAt,
      },
    });
  }

  async refreshTokens(refreshToken: string): Promise<AdminAuthResponseDto> {
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken, isRevoked: false },
      relations: ['admin'],
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Недействительный refresh token');
    }

    // Отзываем старый токен
    tokenRecord.isRevoked = true;
    await this.refreshTokenRepository.save(tokenRecord);

    // Создаем новые токены
    const admin = tokenRecord.admin;
    const payload: AdminJwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions || [],
    };

    const newAccessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const newRefreshToken = await this.generateRefreshToken(admin);

    return new AdminAuthResponseDto({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: admin.role,
        permissions: admin.permissions || [],
        isActive: admin.isActive,
        lastLoginAt: admin.lastLoginAt,
      },
    });
  }

  async logout(refreshToken: string): Promise<void> {
    const tokenRecord = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });

    if (tokenRecord) {
      tokenRecord.isRevoked = true;
      await this.refreshTokenRepository.save(tokenRecord);
    }
  }

  private async generateRefreshToken(admin: Admin): Promise<AdminRefreshToken> {
    const token = this.jwtService.sign(
      { sub: admin.id, type: 'refresh' },
      { expiresIn: '7d' },
    );

    const refreshToken = this.refreshTokenRepository.create({
      token,
      admin,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
    });

    return await this.refreshTokenRepository.save(refreshToken);
  }

  async getAdminById(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({
      where: { id, isActive: true },
    });

    if (!admin) {
      throw new NotFoundException('Админ не найден');
    }

    return admin;
  }
}

