import { Injectable } from '@nestjs/common';

@Injectable()
export class ImageService {
  private readonly placeholderBaseUrl = 'https://via.placeholder.com';
  
  /**
   * Получает безопасный URL изображения
   * Если URL содержит example.com или недоступен, возвращает заглушку
   */
  getSafeImageUrl(originalUrl: string, width: number = 400, height: number = 400, text: string = 'Image'): string {
    if (!originalUrl) {
      return this.getPlaceholderUrl(width, height, text);
    }
    
    // Если URL содержит example.com или другие тестовые домены, заменяем на заглушку
    if (this.isTestUrl(originalUrl)) {
      return this.getPlaceholderUrl(width, height, text);
    }
    
    return originalUrl;
  }
  
  /**
   * Получает URL заглушки
   */
  getPlaceholderUrl(width: number, height: number, text: string): string {
    const encodedText = encodeURIComponent(text);
    return `${this.placeholderBaseUrl}/${width}x${height}/007ACC/FFFFFF?text=${encodedText}`;
  }
  
  /**
   * Проверяет, является ли URL тестовым
   */
  private isTestUrl(url: string): boolean {
    const testDomains = ['example.com', 'localhost', '127.0.0.1', 'test.com'];
    return testDomains.some(domain => url.includes(domain));
  }
  
  /**
   * Обрабатывает массив изображений товара
   */
  processProductImages(images: any[]): any[] {
    if (!images || images.length === 0) {
      return [{
        id: 0,
        imageUrl: this.getPlaceholderUrl(400, 400, 'No Image'),
        altTextRu: 'Изображение недоступно',
        altTextEn: 'Image not available',
        isPrimary: true,
        sortOrder: 0
      }];
    }
    
    return images.map((image, index) => ({
      ...image,
      imageUrl: this.getSafeImageUrl(image.imageUrl, 400, 400, `Product ${index + 1}`)
    }));
  }
  
  /**
   * Обрабатывает логотип бренда
   */
  processBrandLogo(logoUrl: string, brandName: string): string {
    return this.getSafeImageUrl(logoUrl, 100, 100, brandName);
  }
  
  /**
   * Обрабатывает иконку категории
   */
  processCategoryIcon(iconUrl: string, categoryName: string): string {
    return this.getSafeImageUrl(iconUrl, 64, 64, categoryName);
  }
}
