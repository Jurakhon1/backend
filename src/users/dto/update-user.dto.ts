import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const)
) {
  // Все поля из CreateUserDto становятся опциональными, кроме password
  // password исключен из обновления по соображениям безопасности
}
