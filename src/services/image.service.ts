import { Injectable, BadRequestException } from '@nestjs/common';
import { storageConfig } from '../config/storage.config';

@Injectable()
export class ImageService {
  /**
   * Конвертирует файл в Base64 строку
   */
  async convertToBase64(file: any): Promise<string> {
    // Проверяем размер файла
    if (file.size > storageConfig.local.maxFileSize) {
      throw new BadRequestException(
        `Файл слишком большой. Максимальный размер: ${storageConfig.local.maxFileSize / 1024 / 1024}MB`,
      );
    }

    // Проверяем тип файла
    if (!storageConfig.local.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Неподдерживаемый тип файла. Разрешены: ${storageConfig.local.allowedMimeTypes.join(', ')}`,
      );
    }

    // Конвертируем в Base64
    const base64String = file.buffer.toString('base64');
    const mimeType = file.mimetype;

    // Возвращаем Data URL
    return `data:${mimeType};base64,${base64String}`;
  }

  /**
   * Создает миниатюру изображения (опционально)
   */
  async createThumbnail(
    base64String: string,
    maxWidth: number = 200,
  ): Promise<string> {
    // Для простоты возвращаем оригинал
    // В реальном проекте здесь можно использовать sharp или jimp
    return base64String;
  }

  /**
   * Валидирует Base64 строку
   */
  validateBase64(base64String: string): boolean {
    try {
      // Убираем data:image/...;base64, префикс если есть
      let cleanBase64 = base64String;
      if (base64String.startsWith('data:')) {
        const base64Match = base64String.match(
          /^data:image\/[a-z]+;base64,(.+)$/,
        );
        if (base64Match && base64Match[1]) {
          cleanBase64 = base64Match[1];
        }
      }

      // Проверяем, что это валидный base64
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      return base64Regex.test(cleanBase64) && cleanBase64.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Извлекает MIME тип из Base64 строки
   */
  getMimeType(base64String: string): string | null {
    const match = base64String.match(/^data:([^;]+);base64,/);
    return match ? match[1] : null;
  }

  /**
   * Получает размер файла из Base64 строки (в байтах)
   */
  getFileSize(base64String: string): number {
    const base64Data = base64String.split(',')[1];
    return Math.floor((base64Data.length * 3) / 4);
  }
}
