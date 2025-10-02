import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class UploadReceiptBase64Dto {
  @IsString()
  @IsNotEmpty()
  base64_image: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(jpg|jpeg|png|gif)$/i, {
    message: 'Поддерживаются только форматы: jpg, jpeg, png, gif'
  })
  file_extension: string; // jpg, png, jpeg, gif

  @IsOptional()
  @IsString()
  mime_type?: string; // image/jpeg, image/png, etc.
}
