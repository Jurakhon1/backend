import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  order_id: number;

  @IsNumber()
  bank_id: number;

  @IsOptional()
  @IsString()
  receipt_image_url?: string;
}
