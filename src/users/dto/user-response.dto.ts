import { Exclude, Transform } from 'class-transformer';

export class UserResponseDto {
  id: number;
  email: string;
  phone?: string;
  
  @Transform(({ value, obj }) => obj.firstName || obj.first_name)
  firstName: string;
  
  @Transform(({ value, obj }) => obj.lastName || obj.last_name)
  lastName: string;
  
  @Transform(({ value, obj }) => obj.isActive ?? obj.is_active)
  isActive: boolean;
  
  @Transform(({ value, obj }) => obj.isVerified ?? obj.is_verified)
  isVerified: boolean;
  
  @Transform(({ value, obj }) => obj.languagePreference || obj.language_preference)
  languagePreference: string;
  
  @Transform(({ value, obj }) => obj.createdAt || obj.created_at)
  createdAt: Date;
  
  @Transform(({ value, obj }) => obj.updatedAt || obj.updated_at)
  updatedAt: Date;

  @Exclude()
  passwordHash: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
