export class CreateUserDto {
  email: string;
  phone?: string;
  password: string;
  first_name: string;
  last_name: string;
  is_active?: boolean;
  is_verified?: boolean;
  language_preference?: 'ru' | 'en';
}
