const fs = require('fs');
const path = require('path');

// Создаем тестовые изображения-заглушки
const createTestImage = (filename, color = '#4A90E2') => {
  // Простой SVG с цветом телефона
  const svg = `
<svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="phoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color}88;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Фон -->
  <rect width="400" height="600" fill="#f0f0f0"/>
  
  <!-- Телефон -->
  <rect x="50" y="50" width="300" height="500" rx="30" ry="30" fill="url(#phoneGradient)" stroke="#333" stroke-width="2"/>
  
  <!-- Экран -->
  <rect x="70" y="100" width="260" height="400" rx="10" ry="10" fill="#000" stroke="#666" stroke-width="1"/>
  
  <!-- Кнопка домой -->
  <circle cx="200" cy="520" r="15" fill="#333" stroke="#666" stroke-width="1"/>
  
  <!-- Текст -->
  <text x="200" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#333">${filename.replace('.jpg', '')}</text>
</svg>`;

  return svg;
};

// Цвета для разных телефонов
const phoneColors = {
  'iphone-15-pro-blue': '#4A90E2',
  'iphone-15-pro-white': '#F5F5F5',
  'iphone-15-pro-black': '#2C2C2C',
  'iphone-15-pro-natural': '#D4C4A8',
  'samsung-s24-black': '#1A1A1A',
  'samsung-s24-gray': '#8E8E93',
  'samsung-s24-violet': '#5856D6',
  'samsung-s24-yellow': '#FF9500',
  'pixel-8-black': '#000000',
  'pixel-8-brown': '#8B4513',
  'pixel-8-pink': '#FF69B4',
  'pixel-8-mint': '#98FB98',
  'test-image': '#4A90E2'
};

// Создаем папку если не существует
const phonesDir = path.join(__dirname, 'uploads', 'phones');
if (!fs.existsSync(phonesDir)) {
  fs.mkdirSync(phonesDir, { recursive: true });
}

// Создаем изображения
Object.entries(phoneColors).forEach(([name, color]) => {
  const svgContent = createTestImage(name, color);
  const filename = `${name}.svg`;
  const filepath = path.join(phonesDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`Создано: ${filename}`);
});

// Создаем также JPG версии (как заглушки)
Object.keys(phoneColors).forEach(name => {
  const jpgContent = `# Placeholder for ${name}.jpg
# This is a text placeholder for testing
# Replace with actual image file`;
  const filename = `${name}.jpg`;
  const filepath = path.join(phonesDir, filename);
  
  fs.writeFileSync(filepath, jpgContent);
  console.log(`Создано: ${filename}`);
});

console.log('\n✅ Тестовые изображения созданы!');
console.log('📁 Папка:', phonesDir);
console.log('🔗 URL для тестирования: http://localhost:3000/uploads/phones/');
