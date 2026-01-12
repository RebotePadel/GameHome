import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs/promises';

// Services
import { storageService } from './services/storage.service';
import { authService } from './services/auth.service';

// Routes
import messagesRouter from './routes/messages';
import tagsRouter from './routes/tags';
import prenomsRouter from './routes/prenoms';
import likesRouter from './routes/likes';
import commentsRouter from './routes/comments';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globaux
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes par IP
  message: 'Trop de requêtes, veuillez réessayer plus tard',
});
app.use('/api/', limiter);

// Servir les fichiers uploadés
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// Routes API
app.use('/api/messages', messagesRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/prenoms', prenomsRouter);
app.use('/api/likes', likesRouter);
app.use('/api/comments', commentsRouter);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Servir le frontend en production
const FRONTEND_DIST = path.join(process.cwd(), 'frontend/dist');
app.use(express.static(FRONTEND_DIST));
app.get('*', async (req: Request, res: Response, next: NextFunction) => {
  // Ne pas intercepter les routes API
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
    return next();
  }

  const indexPath = path.join(FRONTEND_DIST, 'index.html');
  try {
    await fs.access(indexPath);
    res.sendFile(indexPath);
  } catch {
    // Frontend pas encore build, retourner 404
    res.status(404).json({ error: 'Frontend not built yet. Run: cd frontend && npm run build' });
  }
});

// Gestion des erreurs
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Erreur serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Initialisation et démarrage du serveur
async function start() {
  try {
    console.log('🚀 Démarrage de GameHome Backend...');

    // Créer le dossier temp pour les uploads
    const tempDir = path.join(UPLOADS_DIR, 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Initialiser les données par défaut
    await storageService.initializeDefaultData();

    // Initialiser le mot de passe
    await authService.initializePassword();

    // Démarrer le serveur
    app.listen(PORT, () => {
      console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
      console.log(`📂 Uploads: ${UPLOADS_DIR}`);
      console.log(`🔐 Mot de passe de publication: MainCourante`);
    });
  } catch (error) {
    console.error('❌ Erreur lors du démarrage:', error);
    process.exit(1);
  }
}

start();
