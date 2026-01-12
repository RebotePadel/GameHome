import fs from 'fs/promises';
import path from 'path';
import { Message, Tag, Prenom, Config, StorageData } from '../types';

const DATA_DIR = path.join(process.cwd(), 'data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const TAGS_FILE = path.join(DATA_DIR, 'tags.json');
const PRENOMS_FILE = path.join(DATA_DIR, 'prenoms.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

class StorageService {
  private async ensureDataDir() {
    try {
      await fs.access(DATA_DIR);
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true });
    }
  }

  private async readFile<T>(filePath: string, defaultValue: T): Promise<T> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // Si le fichier n'existe pas, on crée avec la valeur par défaut
      await this.writeFile(filePath, defaultValue);
      return defaultValue;
    }
  }

  private async writeFile<T>(filePath: string, data: T): Promise<void> {
    await this.ensureDataDir();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Messages
  async getMessages(): Promise<Message[]> {
    return this.readFile<Message[]>(MESSAGES_FILE, []);
  }

  async saveMessages(messages: Message[]): Promise<void> {
    await this.writeFile(MESSAGES_FILE, messages);
  }

  async addMessage(message: Message): Promise<Message> {
    const messages = await this.getMessages();
    messages.unshift(message); // Ajouter en premier (anti-chronologique)
    await this.saveMessages(messages);
    return message;
  }

  async updateMessage(id: string, updates: Partial<Message>): Promise<Message | null> {
    const messages = await this.getMessages();
    const index = messages.findIndex((m) => m.id === id);
    if (index === -1) return null;

    messages[index] = { ...messages[index], ...updates, updatedAt: new Date().toISOString() };
    await this.saveMessages(messages);
    return messages[index];
  }

  async deleteMessage(id: string): Promise<boolean> {
    const messages = await this.getMessages();
    const filtered = messages.filter((m) => m.id !== id);
    if (filtered.length === messages.length) return false;
    await this.saveMessages(filtered);
    return true;
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    return this.readFile<Tag[]>(TAGS_FILE, []);
  }

  async saveTags(tags: Tag[]): Promise<void> {
    await this.writeFile(TAGS_FILE, tags);
  }

  async addTag(tag: Tag): Promise<Tag> {
    const tags = await this.getTags();
    tags.push(tag);
    await this.saveTags(tags);
    return tag;
  }

  async updateTag(id: string, updates: Partial<Tag>): Promise<Tag | null> {
    const tags = await this.getTags();
    const index = tags.findIndex((t) => t.id === id);
    if (index === -1) return null;

    tags[index] = { ...tags[index], ...updates, updatedAt: new Date().toISOString() };
    await this.saveTags(tags);
    return tags[index];
  }

  async deleteTag(id: string): Promise<boolean> {
    const tags = await this.getTags();
    const filtered = tags.filter((t) => t.id !== id);
    if (filtered.length === tags.length) return false;
    await this.saveTags(filtered);
    return true;
  }

  async reorderTags(tagIds: string[]): Promise<Tag[]> {
    const tags = await this.getTags();
    const reordered = tagIds
      .map((id, index) => {
        const tag = tags.find((t) => t.id === id);
        if (tag) {
          return { ...tag, order: index };
        }
        return null;
      })
      .filter((t): t is Tag => t !== null);

    await this.saveTags(reordered);
    return reordered;
  }

  // Prénoms
  async getPrenoms(): Promise<Prenom[]> {
    return this.readFile<Prenom[]>(PRENOMS_FILE, []);
  }

  async savePrenoms(prenoms: Prenom[]): Promise<void> {
    await this.writeFile(PRENOMS_FILE, prenoms);
  }

  async addPrenom(prenom: Prenom): Promise<Prenom> {
    const prenoms = await this.getPrenoms();
    prenoms.push(prenom);
    await this.savePrenoms(prenoms);
    return prenom;
  }

  async updatePrenom(id: string, updates: Partial<Prenom>): Promise<Prenom | null> {
    const prenoms = await this.getPrenoms();
    const index = prenoms.findIndex((p) => p.id === id);
    if (index === -1) return null;

    prenoms[index] = { ...prenoms[index], ...updates, updatedAt: new Date().toISOString() };
    await this.savePrenoms(prenoms);
    return prenoms[index];
  }

  async deletePrenom(id: string): Promise<boolean> {
    const prenoms = await this.getPrenoms();
    const filtered = prenoms.filter((p) => p.id !== id);
    if (filtered.length === prenoms.length) return false;
    await this.savePrenoms(filtered);
    return true;
  }

  // Config
  async getConfig(): Promise<Config> {
    const defaultConfig: Config = {
      publishPassword: '$2b$10$YourHashedPasswordHere', // "MainCourante" sera hashé à l'init
      appName: 'GameHome',
      defaultAuthor: 'Système',
    };
    return this.readFile<Config>(CONFIG_FILE, defaultConfig);
  }

  async saveConfig(config: Config): Promise<void> {
    await this.writeFile(CONFIG_FILE, config);
  }

  // Initialisation des données de test
  async initializeDefaultData(): Promise<void> {
    const tags = await this.getTags();
    if (tags.length === 0) {
      const defaultTags: Tag[] = [
        {
          id: 'tag-1',
          name: 'Sécurité',
          color: '#EF4444',
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'tag-2',
          name: 'Maintenance',
          color: '#3B82F6',
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'tag-3',
          name: 'Événements',
          color: '#10B981',
          order: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'tag-4',
          name: 'RH',
          color: '#F59E0B',
          order: 3,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      await this.saveTags(defaultTags);
      console.log('✅ Tags par défaut créés');
    }

    const prenoms = await this.getPrenoms();
    if (prenoms.length === 0) {
      const defaultPrenoms: Prenom[] = [
        {
          id: 'prenom-1',
          name: 'Jean',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prenom-2',
          name: 'Marie',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'prenom-3',
          name: 'Pierre',
          active: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      await this.savePrenoms(defaultPrenoms);
      console.log('✅ Prénoms par défaut créés');
    }
  }
}

export const storageService = new StorageService();
