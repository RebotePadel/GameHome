import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from '../services/storage.service';
import { validate, createTagSchema, updateTagSchema, reorderTagsSchema } from '../middleware/validation';
import { Tag } from '../types';

const router = Router();

// GET /api/tags - Récupérer tous les tags
router.get('/', async (_req: Request, res: Response) => {
  try {
    const tags = await storageService.getTags();
    // Trier par ordre
    const sorted = tags.sort((a, b) => a.order - b.order);
    res.json(sorted);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/tags/reorder - Réorganiser les tags (avant les routes avec :id)
router.post('/reorder', validate(reorderTagsSchema), async (req: Request, res: Response) => {
  try {
    const { tagIds } = req.body;
    const reordered = await storageService.reorderTags(tagIds);
    res.json(reordered);
  } catch (error) {
    console.error('Error reordering tags:', error);
    res.status(500).json({ error: 'Erreur lors de la réorganisation' });
  }
});

// GET /api/tags/:id - Récupérer un tag
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const tags = await storageService.getTags();
    const tag = tags.find((t) => t.id === req.params.id);

    if (!tag) {
      res.status(404).json({ error: 'Tag non trouvé' });
      return;
    }

    res.json(tag);
  } catch (error) {
    console.error('Error fetching tag:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/tags - Créer un nouveau tag
router.post('/', validate(createTagSchema), async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;
    const tags = await storageService.getTags();

    const tag: Tag = {
      id: uuidv4(),
      name,
      color,
      order: tags.length, // Ajouter à la fin
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await storageService.addTag(tag);
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ error: 'Erreur lors de la création du tag' });
  }
});

// PUT /api/tags/:id - Mettre à jour un tag
router.put('/:id', validate(updateTagSchema), async (req: Request, res: Response) => {
  try {
    const updated = await storageService.updateTag(req.params.id, req.body);

    if (!updated) {
      res.status(404).json({ error: 'Tag non trouvé' });
      return;
    }

    res.json(updated);
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du tag' });
  }
});

// DELETE /api/tags/:id - Supprimer un tag
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    // Vérifier si des messages utilisent ce tag
    const messages = await storageService.getMessages();
    const messagesWithTag = messages.filter((m) => m.tags.includes(req.params.id));

    if (messagesWithTag.length > 0) {
      res.status(400).json({
        error: 'Impossible de supprimer ce tag',
        reason: `${messagesWithTag.length} message(s) utilisent ce tag`,
      });
      return;
    }

    const success = await storageService.deleteTag(req.params.id);

    if (success) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Tag non trouvé' });
    }
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
