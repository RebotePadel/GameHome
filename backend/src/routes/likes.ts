import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from '../services/storage.service';
import { validate, createLikeSchema } from '../middleware/validation';
import { Like } from '../types';

const router = Router();

// POST /api/likes - Ajouter un like
router.post('/', validate(createLikeSchema), async (req: Request, res: Response) => {
  try {
    const { messageId, prenomId } = req.body;

    // Récupérer le message
    const messages = await storageService.getMessages();
    const message = messages.find((m) => m.id === messageId);

    if (!message) {
      res.status(404).json({ error: 'Message non trouvé' });
      return;
    }

    // Vérifier si le prénom existe
    const prenoms = await storageService.getPrenoms();
    const prenom = prenoms.find((p) => p.id === prenomId);

    if (!prenom) {
      res.status(404).json({ error: 'Prénom non trouvé' });
      return;
    }

    // Vérifier si le prénom a déjà liké
    const alreadyLiked = message.likes.some((l) => l.prenomId === prenomId);

    if (alreadyLiked) {
      res.status(400).json({ error: 'Ce prénom a déjà liké ce message' });
      return;
    }

    // Ajouter le like
    const like: Like = {
      id: uuidv4(),
      prenomId,
      messageId,
      createdAt: new Date().toISOString(),
    };

    message.likes.push(like);
    await storageService.updateMessage(messageId, { likes: message.likes });

    res.status(201).json(like);
  } catch (error) {
    console.error('Error adding like:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du like' });
  }
});

// DELETE /api/likes/:messageId/:prenomId - Retirer un like
router.delete('/:messageId/:prenomId', async (req: Request, res: Response) => {
  try {
    const { messageId, prenomId } = req.params;

    const messages = await storageService.getMessages();
    const message = messages.find((m) => m.id === messageId);

    if (!message) {
      res.status(404).json({ error: 'Message non trouvé' });
      return;
    }

    const filteredLikes = message.likes.filter((l) => l.prenomId !== prenomId);

    if (filteredLikes.length === message.likes.length) {
      res.status(404).json({ error: 'Like non trouvé' });
      return;
    }

    await storageService.updateMessage(messageId, { likes: filteredLikes });

    res.json({ success: true });
  } catch (error) {
    console.error('Error removing like:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/likes/bulk - Like groupé sur plusieurs messages
router.post('/bulk', async (req: Request, res: Response) => {
  try {
    const { messageIds, prenomId } = req.body;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      res.status(400).json({ error: 'messageIds requis (array non vide)' });
      return;
    }

    if (!prenomId) {
      res.status(400).json({ error: 'prenomId requis' });
      return;
    }

    // Vérifier que le prénom existe
    const prenoms = await storageService.getPrenoms();
    const prenom = prenoms.find((p) => p.id === prenomId);

    if (!prenom) {
      res.status(404).json({ error: 'Prénom non trouvé' });
      return;
    }

    const messages = await storageService.getMessages();
    const results = [];

    for (const messageId of messageIds) {
      const message = messages.find((m) => m.id === messageId);

      if (!message) {
        results.push({ messageId, success: false, reason: 'Message non trouvé' });
        continue;
      }

      // Vérifier si déjà liké
      const alreadyLiked = message.likes.some((l) => l.prenomId === prenomId);

      if (alreadyLiked) {
        results.push({ messageId, success: false, reason: 'Déjà liké' });
        continue;
      }

      // Ajouter le like
      const like: Like = {
        id: uuidv4(),
        prenomId,
        messageId,
        createdAt: new Date().toISOString(),
      };

      message.likes.push(like);
      await storageService.updateMessage(messageId, { likes: message.likes });

      results.push({ messageId, success: true, like });
    }

    res.json({ results });
  } catch (error) {
    console.error('Error bulk liking:', error);
    res.status(500).json({ error: 'Erreur lors du like groupé' });
  }
});

export default router;
