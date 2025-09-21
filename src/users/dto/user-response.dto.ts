import { Exclude } from 'class-transformer';
import { UserRole } from '../../entities/user.entity';

export class UserResponseDto {
  id: number;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
  isActive: boolean;
  isVerified: boolean;
  languagePreference: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  passwordHash: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
