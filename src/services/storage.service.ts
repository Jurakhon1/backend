import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { storageConfig } from '../config/storage.config';

@Injectable()
export class StorageService {
  private readonly uploadPath: string;
  private readonly baseUrl: string;

  constructor() {
    this.uploadPath = path.join(process.cwd(), storageConfig.local.uploadPath);
    this.baseUrl = storageConfig.local.baseUrl;
    this.ensureUploadDirectory();
  }

  private ensureUploadDirectory(): void {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async uploadFile(
    file: any,
    folder: string = 'general'
  ): Promise<{ url: string; filename: string; size: number }> {
    // Валидация файла
    this.validateFile(file);

    // Создаем папку для файла
    const folderPath = path.join(this.uploadPath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Генерируем уникальное имя файла
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExtension}`;
    const filePath = path.join(folderPath, fileName);

    // Сохраняем файл
    fs.writeFileSync(filePath, file.buffer);

    // Возвращаем информацию о файле
    return {
      url: `${this.baseUrl}/uploads/${folder}/${fileName}`,
      filename: fileName,
      size: file.size
    };
  }

  async uploadMultipleFiles(
    files: any[],
    folder: string = 'general'
  ): Promise<{ url: string; filename: string; size: number }[]> {
    const results: { url: string; filename: string; size: number }[] = [];
    for (const file of files) {
      const result = await this.uploadFile(file, folder);
      results.push(result);
    }
    return results;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const relativePath = fileUrl.replace(`${this.baseUrl}/uploads/`, '');
      const filePath = path.join(this.uploadPath, relativePath);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  private validateFile(file: any): void {
    // Проверяем размер файла
    if (file.size > storageConfig.local.maxFileSize) {
      throw new BadRequestException(
        `Файл слишком большой. Максимальный размер: ${storageConfig.local.maxFileSize / 1024 / 1024}MB`
      );
    }

    // Проверяем тип файла
    if (!storageConfig.local.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Неподдерживаемый тип файла. Разрешены: ${storageConfig.local.allowedMimeTypes.join(', ')}`
      );
    }
  }

  // Метод для получения информации о файле
  getFileInfo(fileUrl: string): { exists: boolean; size?: number; path?: string } {
    try {
      const relativePath = fileUrl.replace(`${this.baseUrl}/uploads/`, '');
      const filePath = path.join(this.uploadPath, relativePath);
      
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        return {
          exists: true,
          size: stats.size,
          path: filePath
        };
      }
      return { exists: false };
    } catch (error) {
      return { exists: false };
    }
  }
}
