export enum StorageType {
  LOCAL = 'local',
  S3 = 's3',
  CLOUDINARY = 'cloudinary'
}

export const storageConfig = {
  type: (process.env.STORAGE_TYPE as StorageType) || StorageType.LOCAL,
  local: {
    uploadPath: process.env.UPLOAD_PATH || 'uploads',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ]
  },
  s3: {
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
};

