import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from '../services/storage.service';
import { validate, createCommentSchema } from '../middleware/validation';
import { Comment } from '../types';

const router = Router();

// POST /api/comments - Ajouter un commentaire
router.post('/', validate(createCommentSchema), async (req: Request, res: Response) => {
  try {
    const { messageId, prenomId, content } = req.body;

    // Récupérer le message
    const messages = await storageService.getMessages();
    const message = messages.find((m) => m.id === messageId);

    if (!message) {
      res.status(404).json({ error: 'Message non trouvé' });
      return;
    }

    // Vérifier que le prénom existe
    const prenoms = await storageService.getPrenoms();
    const prenom = prenoms.find((p) => p.id === prenomId);

    if (!prenom) {
      res.status(404).json({ error: 'Prénom non trouvé' });
      return;
    }

    // Créer le commentaire
    const comment: Comment = {
      id: uuidv4(),
      messageId,
      prenomId,
      content,
      createdAt: new Date().toISOString(),
    };

    message.comments.push(comment);
    await storageService.updateMessage(messageId, { comments: message.comments });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire' });
  }
});

// DELETE /api/comments/:messageId/:commentId - Supprimer un commentaire
router.delete('/:messageId/:commentId', async (req: Request, res: Response) => {
  try {
    const { messageId, commentId } = req.params;

    const messages = await storageService.getMessages();
    const message = messages.find((m) => m.id === messageId);

    if (!message) {
      res.status(404).json({ error: 'Message non trouvé' });
      return;
    }

    const filteredComments = message.comments.filter((c) => c.id !== commentId);

    if (filteredComments.length === message.comments.length) {
      res.status(404).json({ error: 'Commentaire non trouvé' });
      return;
    }

    await storageService.updateMessage(messageId, { comments: filteredComments });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/comments/:messageId - Récupérer les commentaires d'un message
router.get('/:messageId', async (req: Request, res: Response) => {
  try {
    const messages = await storageService.getMessages();
    const message = messages.find((m) => m.id === req.params.messageId);

    if (!message) {
      res.status(404).json({ error: 'Message non trouvé' });
      return;
    }

    res.json(message.comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
