import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from '../services/storage.service';
import { validate, createPrenomSchema, updatePrenomSchema } from '../middleware/validation';
import { Prenom } from '../types';

const router = Router();

// GET /api/prenoms - Récupérer tous les prénoms
router.get('/', async (_req: Request, res: Response) => {
  try {
    const prenoms = await storageService.getPrenoms();
    res.json(prenoms);
  } catch (error) {
    console.error('Error fetching prenoms:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/prenoms/active - Récupérer uniquement les prénoms actifs
router.get('/active', async (_req: Request, res: Response) => {
  try {
    const prenoms = await storageService.getPrenoms();
    const active = prenoms.filter((p) => p.active);
    res.json(active);
  } catch (error) {
    console.error('Error fetching active prenoms:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/prenoms/:id - Récupérer un prénom
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const prenoms = await storageService.getPrenoms();
    const prenom = prenoms.find((p) => p.id === req.params.id);

    if (!prenom) {
      res.status(404).json({ error: 'Prénom non trouvé' });
      return;
    }

    res.json(prenom);
  } catch (error) {
    console.error('Error fetching prenom:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/prenoms - Créer un nouveau prénom
router.post('/', validate(createPrenomSchema), async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const prenom: Prenom = {
      id: uuidv4(),
      name,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await storageService.addPrenom(prenom);
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating prenom:', error);
    res.status(500).json({ error: 'Erreur lors de la création du prénom' });
  }
});

// PUT /api/prenoms/:id - Mettre à jour un prénom
router.put('/:id', validate(updatePrenomSchema), async (req: Request, res: Response) => {
  try {
    const updated = await storageService.updatePrenom(req.params.id, req.body);

    if (!updated) {
      res.status(404).json({ error: 'Prénom non trouvé' });
      return;
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating prenom:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du prénom' });
  }
});

// DELETE /api/prenoms/:id - Supprimer un prénom (soft delete)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    // Soft delete: on désactive au lieu de supprimer
    const updated = await storageService.updatePrenom(req.params.id, { active: false });

    if (!updated) {
      res.status(404).json({ error: 'Prénom non trouvé' });
      return;
    }

    res.json({ success: true, prenom: updated });
  } catch (error) {
    console.error('Error deleting prenom:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
