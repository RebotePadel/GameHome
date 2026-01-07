// Types partagés entre frontend et backend

export interface Message {
  id: string;
  content: string;
  tags: string[];
  attachments: Attachment[];
  author: string;
  createdAt: string;
  updatedAt: string;
  likes: Like[];
  comments: Comment[];
}

export interface Tag {
  id: string;
  name: string;
  color: string;
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
  filename: string;
  filepath: string;
  mimetype: string;
  size: number;
  type: 'image' | 'video' | 'document';
  createdAt: string;
}

// DTOs
export interface CreateMessageDto {
  content: string;
  tagIds: string[];
  author: string;
  files?: File[];
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
