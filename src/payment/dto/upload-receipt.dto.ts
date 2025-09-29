import { IsString, IsNotEmpty } from 'class-validator';

export class UploadReceiptDto {
  @IsString()
  @IsNotEmpty()
  receipt_image_url: string;
}

