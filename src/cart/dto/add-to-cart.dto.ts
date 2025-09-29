import { IsNumber, IsPositive, Min } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  @IsPositive()
  product_id: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;
}
