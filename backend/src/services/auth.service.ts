import bcrypt from 'bcrypt';
import { storageService } from './storage.service';

class AuthService {
  private readonly PUBLISH_PASSWORD = 'MainCourante';

  async initializePassword(): Promise<void> {
    const config = await storageService.getConfig();

    // Si le mot de passe n'est pas encore hashé correctement, on le hash
    try {
      await bcrypt.compare(this.PUBLISH_PASSWORD, config.publishPassword);
    } catch {
      // Hash invalide, on crée un nouveau hash
      const hashedPassword = await bcrypt.hash(this.PUBLISH_PASSWORD, 10);
      config.publishPassword = hashedPassword;
      await storageService.saveConfig(config);
      console.log('✅ Mot de passe de publication initialisé');
    }
  }

  async verifyPublishPassword(password: string): Promise<boolean> {
    const config = await storageService.getConfig();
    return bcrypt.compare(password, config.publishPassword);
  }
}

export const authService = new AuthService();
