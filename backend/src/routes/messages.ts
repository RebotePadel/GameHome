import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storageService } from '../services/storage.service';
import { fileService } from '../services/file.service';
import { requirePublishPassword } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { validate, createMessageSchema } from '../middleware/validation';
import { Message } from '../types';

const router = Router();

// GET /api/messages - Récupérer tous les messages
router.get('/', async (_req: Request, res: Response) => {
  try {
    const messages = await storageService.getMessages();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/messages/:id - Récupérer un message
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const messages = await storageService.getMessages();
    const message = messages.find((m) => m.id === req.params.id);

    if (!message) {
      res.status(404).json({ error: 'Message non trouvé' });
      return;
    }

    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/messages/by-tag/:tagId - Récupérer messages par tag
router.get('/by-tag/:tagId', async (req: Request, res: Response) => {
  try {
    const messages = await storageService.getMessages();
    const filtered = messages.filter((m) => m.tags.includes(req.params.tagId));
    res.json(filtered);
  } catch (error) {
    console.error('Error fetching messages by tag:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/messages - Créer un nouveau message
router.post(
  '/',
  requirePublishPassword,
  upload.array('files', 10),
  validate(createMessageSchema),
  async (req: Request, res: Response) => {
    try {
      const { content, tagIds, author } = req.body;
      const files = req.files as Express.Multer.File[];

      // Traiter les fichiers uploadés
      const attachments = [];
      if (files && files.length > 0) {
        for (const file of files) {
          const attachment = await fileService.saveFile(file);
          attachments.push(attachment);
        }
      }

      // Créer le message
      const message: Message = {
        id: uuidv4(),
        content,
        tags: tagIds,
        attachments,
        author,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: [],
        comments: [],
      };

      const saved = await storageService.addMessage(message);
      res.status(201).json(saved);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Erreur lors de la création du message' });
    }
  }
);

// DELETE /api/messages/:id - Supprimer un message
router.delete('/:id', requirePublishPassword, async (req: Request, res: Response) => {
  try {
    const messages = await storageService.getMessages();
    const message = messages.find((m) => m.id === req.params.id);

    if (!message) {
      res.status(404).json({ error: 'Message non trouvé' });
      return;
    }

    // Supprimer les fichiers attachés
    if (message.attachments.length > 0) {
      await fileService.deleteFiles(message.attachments.map((a) => a.filepath));
    }

    const success = await storageService.deleteMessage(req.params.id);

    if (success) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
