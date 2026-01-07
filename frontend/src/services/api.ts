import axios from 'axios';
import type {
  Message,
  Tag,
  Prenom,
  CreateMessageDto,
  CreateTagDto,
  CreatePrenomDto,
  CreateLikeDto,
  CreateCommentDto,
  UpdateTagDto,
  UpdatePrenomDto,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Messages
export const messagesApi = {
  getAll: () => api.get<Message[]>('/messages'),
  getById: (id: string) => api.get<Message>(`/messages/${id}`),
  getByTag: (tagId: string) => api.get<Message[]>(`/messages/by-tag/${tagId}`),
  create: async (data: CreateMessageDto, password: string) => {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('author', data.author);
    data.tagIds.forEach((id) => formData.append('tagIds', id));

    if (data.files) {
      data.files.forEach((file) => formData.append('files', file));
    }

    return api.post<Message>('/messages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-publish-password': password,
      },
    });
  },
  delete: (id: string, password: string) =>
    api.delete(`/messages/${id}`, {
      headers: { 'x-publish-password': password },
    }),
};

// Tags
export const tagsApi = {
  getAll: () => api.get<Tag[]>('/tags'),
  getById: (id: string) => api.get<Tag>(`/tags/${id}`),
  create: (data: CreateTagDto) => api.post<Tag>('/tags', data),
  update: (id: string, data: UpdateTagDto) => api.put<Tag>(`/tags/${id}`, data),
  delete: (id: string) => api.delete(`/tags/${id}`),
  reorder: (tagIds: string[]) => api.post<Tag[]>('/tags/reorder', { tagIds }),
};

// Prénoms
export const prenomsApi = {
  getAll: () => api.get<Prenom[]>('/prenoms'),
  getActive: () => api.get<Prenom[]>('/prenoms/active'),
  getById: (id: string) => api.get<Prenom>(`/prenoms/${id}`),
  create: (data: CreatePrenomDto) => api.post<Prenom>('/prenoms', data),
  update: (id: string, data: UpdatePrenomDto) => api.put<Prenom>(`/prenoms/${id}`, data),
  delete: (id: string) => api.delete(`/prenoms/${id}`),
};

// Likes
export const likesApi = {
  add: (data: CreateLikeDto) => api.post('/likes', data),
  remove: (messageId: string, prenomId: string) =>
    api.delete(`/likes/${messageId}/${prenomId}`),
  bulkAdd: (messageIds: string[], prenomId: string) =>
    api.post('/likes/bulk', { messageIds, prenomId }),
};

// Comments
export const commentsApi = {
  getByMessage: (messageId: string) => api.get(`/comments/${messageId}`),
  add: (data: CreateCommentDto) => api.post('/comments', data),
  delete: (messageId: string, commentId: string) =>
    api.delete(`/comments/${messageId}/${commentId}`),
};

export default api;
