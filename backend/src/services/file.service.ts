import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Attachment } from '../types';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

class FileService {
  private async ensureUploadDir(date: string) {
    const dateDir = path.join(UPLOADS_DIR, date);
    try {
      await fs.access(dateDir);
    } catch {
      await fs.mkdir(dateDir, { recursive: true });
    }
    return dateDir;
  }

  private getFileType(mimetype: string): 'image' | 'video' | 'document' {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype.startsWith('video/')) return 'video';
    return 'document';
  }

  async saveFile(file: Express.Multer.File): Promise<Attachment> {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const uploadDir = await this.ensureUploadDir(date);

    const fileId = uuidv4();
    const ext = path.extname(file.originalname);
    const filename = `${fileId}${ext}`;
    const filepath = path.join(uploadDir, filename);

    // Déplacer le fichier depuis le temp vers le dossier final
    await fs.rename(file.path, filepath);

    const attachment: Attachment = {
      id: fileId,
      filename: file.originalname,
      filepath: `${date}/${filename}`, // Chemin relatif depuis uploads/
      mimetype: file.mimetype,
      size: file.size,
      type: this.getFileType(file.mimetype),
      createdAt: new Date().toISOString(),
    };

    return attachment;
  }

  async deleteFile(filepath: string): Promise<boolean> {
    try {
      const fullPath = path.join(UPLOADS_DIR, filepath);
      await fs.unlink(fullPath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  async deleteFiles(filepaths: string[]): Promise<void> {
    await Promise.all(filepaths.map((fp) => this.deleteFile(fp)));
  }

  getFileUrl(filepath: string): string {
    return `/uploads/${filepath}`;
  }
}

export const fileService = new FileService();
