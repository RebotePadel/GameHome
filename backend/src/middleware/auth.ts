import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';

export async function requirePublishPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const password = req.headers['x-publish-password'] as string;

  if (!password) {
    res.status(401).json({ error: 'Mot de passe requis' });
    return;
  }

  const isValid = await authService.verifyPublishPassword(password);

  if (!isValid) {
    res.status(401).json({ error: 'Mot de passe incorrect' });
    return;
  }

  next();
}
