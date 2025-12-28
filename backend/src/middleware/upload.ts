import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express';

// Ensure upload directories exist
const UPLOAD_DIRS = {
  menu: path.join(process.cwd(), 'uploads', 'menu'),
  slips: path.join(process.cwd(), 'uploads', 'slips'),
};

Object.values(UPLOAD_DIRS).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer storage (temp storage before processing)
const storage = multer.memoryStorage();

// File filter - accept only images
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  }
};

// Multer instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

// Process and save image as WebP
interface ProcessImageOptions {
  type: 'menu' | 'slips';
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export const processImage = async (
  buffer: Buffer,
  options: ProcessImageOptions
): Promise<string> => {
  const { type, quality = 80, maxWidth = 800, maxHeight = 800 } = options;
  
  const filename = `${uuidv4()}.webp`;
  const filepath = path.join(UPLOAD_DIRS[type], filename);
  
  // Compress and convert to WebP
  await sharp(buffer)
    .resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toFile(filepath);
  
  // Return URL path
  return `/uploads/${type}/${filename}`;
};

// Express middleware to handle image upload and processing
export const handleImageUpload = (type: 'menu' | 'slips') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return next();
      }

      const imageUrl = await processImage(req.file.buffer, {
        type,
        quality: type === 'menu' ? 85 : 70, // Higher quality for menu images
        maxWidth: type === 'menu' ? 800 : 1200,
        maxHeight: type === 'menu' ? 800 : 1600,
      });

      // Attach to request
      req.body.imageUrl = imageUrl;
      next();
    } catch (error) {
      console.error('Image processing error:', error);
      res.status(500).json({ error: 'Failed to process image' });
    }
  };
};
