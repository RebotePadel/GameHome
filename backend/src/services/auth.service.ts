import bcrypt from 'bcrypt';
import { storageService } from './storage.service';

class AuthService {
  private readonly PUBLISH_PASSWORD = 'MainCourante';

  async initializePassword(): Promise<void> {
    const config = await storageService.getConfig();

    // Vérifier si le hash est valide en testant la comparaison
    try {
      const isValid = await bcrypt.compare(this.PUBLISH_PASSWORD, config.publishPassword);
      if (!isValid) {
        // Hash ne correspond pas, on régénère
        const hashedPassword = await bcrypt.hash(this.PUBLISH_PASSWORD, 10);
        config.publishPassword = hashedPassword;
        await storageService.saveConfig(config);
        console.log('✅ Mot de passe de publication initialisé');
      } else {
        console.log('✅ Mot de passe de publication déjà configuré');
      }
    } catch (error) {
      // Hash invalide ou erreur, on crée un nouveau hash
      const hashedPassword = await bcrypt.hash(this.PUBLISH_PASSWORD, 10);
      config.publishPassword = hashedPassword;
      await storageService.saveConfig(config);
      console.log('✅ Mot de passe de publication initialisé (après erreur)');
    }
  }

  async verifyPublishPassword(password: string): Promise<boolean> {
    const config = await storageService.getConfig();
    return bcrypt.compare(password, config.publishPassword);
  }
}

export const authService = new AuthService();
