import multer from 'multer';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads/temp');

// Configuration multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// Filtres de fichiers
const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Vidéos
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    // Documents
    'application/pdf',
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé'));
  }
};

// Limites
const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB max par fichier
  files: 10, // 10 fichiers max
};

export const upload = multer({
  storage,
  fileFilter,
  limits,
});
