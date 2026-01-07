import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

// Schémas de validation Zod

export const createMessageSchema = z.object({
  content: z.string().min(10, 'Le contenu doit faire au moins 10 caractères'),
  tagIds: z.array(z.string()).min(1, 'Au moins un tag est requis'),
  author: z.string().min(1, 'Auteur requis'),
});

export const createTagSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Couleur hex invalide'),
});

export const updateTagSchema = z.object({
  name: z.string().min(2).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  order: z.number().int().min(0).optional(),
});

export const createPrenomSchema = z.object({
  name: z.string().min(2, 'Le nom doit faire au moins 2 caractères'),
});

export const updatePrenomSchema = z.object({
  name: z.string().min(2).optional(),
  active: z.boolean().optional(),
});

export const createLikeSchema = z.object({
  messageId: z.string().uuid(),
  prenomId: z.string(),
});

export const createCommentSchema = z.object({
  messageId: z.string().uuid(),
  prenomId: z.string(),
  content: z.string().min(1, 'Le commentaire ne peut pas être vide'),
});

export const reorderTagsSchema = z.object({
  tagIds: z.array(z.string()),
});

// Middleware de validation
export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.errors,
        });
        return;
      }
      next(error);
    }
  };
}
