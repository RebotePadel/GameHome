// Types pour GameHome - Main Courante Digitale

export interface Message {
  id: string;
  content: string;
  tags: string[]; // IDs des tags
  attachments: Attachment[];
  author: string; // Nom du prénom
  createdAt: string;
  updatedAt: string;
  likes: Like[];
  comments: Comment[];
}

export interface Tag {
  id: string;
  name: string;
  color: string; // Hex color
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Prenom {
  id: string;
  name: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Like {
  id: string;
  prenomId: string;
  messageId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  messageId: string;
  prenomId: string;
  content: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  filename: string; // Nom original
  filepath: string; // Chemin relatif depuis uploads/
  mimetype: string;
  size: number; // bytes
  type: 'image' | 'video' | 'document';
  createdAt: string;
}

export interface Config {
  publishPassword: string; // Hash bcrypt
  appName: string;
  defaultAuthor: string;
}

// DTOs (Data Transfer Objects)

export interface CreateMessageDto {
  content: string;
  tagIds: string[];
  author: string;
}

export interface CreateTagDto {
  name: string;
  color: string;
}

export interface CreatePrenomDto {
  name: string;
}

export interface CreateLikeDto {
  messageId: string;
  prenomId: string;
}

export interface CreateCommentDto {
  messageId: string;
  prenomId: string;
  content: string;
}

export interface UpdateTagDto {
  name?: string;
  color?: string;
  order?: number;
}

export interface UpdatePrenomDto {
  name?: string;
  active?: boolean;
}

// Storage structure
export interface StorageData {
  messages: Message[];
  tags: Tag[];
  prenoms: Prenom[];
  config: Config;
}
