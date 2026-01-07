import { create } from 'zustand';
import { Message, Tag, Prenom } from '../types';
import { messagesApi, tagsApi, prenomsApi } from '../services/api';

interface AppState {
  // Data
  messages: Message[];
  tags: Tag[];
  prenoms: Prenom[];
  selectedMessages: Set<string>;

  // Loading states
  isLoadingMessages: boolean;
  isLoadingTags: boolean;
  isLoadingPrenoms: boolean;

  // Actions - Messages
  fetchMessages: () => Promise<void>;
  fetchMessagesByTag: (tagId: string) => Promise<void>;
  addMessage: (message: Message) => void;
  removeMessage: (id: string) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;

  // Actions - Tags
  fetchTags: () => Promise<void>;
  addTag: (tag: Tag) => void;
  updateTag: (id: string, updates: Partial<Tag>) => void;
  removeTag: (id: string) => void;
  setTags: (tags: Tag[]) => void;

  // Actions - Prénoms
  fetchPrenoms: () => Promise<void>;
  addPrenom: (prenom: Prenom) => void;
  updatePrenom: (id: string, updates: Partial<Prenom>) => void;
  removePrenom: (id: string) => void;

  // Actions - Selection
  toggleSelectMessage: (id: string) => void;
  clearSelection: () => void;
  selectAll: () => void;

  // Getters
  getActivePrenoms: () => Prenom[];
  getPrenomById: (id: string) => Prenom | undefined;
  getTagById: (id: string) => Tag | undefined;
  getMessageById: (id: string) => Message | undefined;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state
  messages: [],
  tags: [],
  prenoms: [],
  selectedMessages: new Set(),
  isLoadingMessages: false,
  isLoadingTags: false,
  isLoadingPrenoms: false,

  // Messages
  fetchMessages: async () => {
    set({ isLoadingMessages: true });
    try {
      const response = await messagesApi.getAll();
      set({ messages: response.data, isLoadingMessages: false });
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ isLoadingMessages: false });
    }
  },

  fetchMessagesByTag: async (tagId: string) => {
    set({ isLoadingMessages: true });
    try {
      const response = await messagesApi.getByTag(tagId);
      set({ messages: response.data, isLoadingMessages: false });
    } catch (error) {
      console.error('Error fetching messages by tag:', error);
      set({ isLoadingMessages: false });
    }
  },

  addMessage: (message) => {
    set((state) => ({
      messages: [message, ...state.messages],
    }));
  },

  removeMessage: (id) => {
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== id),
    }));
  },

  updateMessage: (id, updates) => {
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    }));
  },

  // Tags
  fetchTags: async () => {
    set({ isLoadingTags: true });
    try {
      const response = await tagsApi.getAll();
      set({ tags: response.data, isLoadingTags: false });
    } catch (error) {
      console.error('Error fetching tags:', error);
      set({ isLoadingTags: false });
    }
  },

  addTag: (tag) => {
    set((state) => ({
      tags: [...state.tags, tag],
    }));
  },

  updateTag: (id, updates) => {
    set((state) => ({
      tags: state.tags.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  removeTag: (id) => {
    set((state) => ({
      tags: state.tags.filter((t) => t.id !== id),
    }));
  },

  setTags: (tags) => {
    set({ tags });
  },

  // Prénoms
  fetchPrenoms: async () => {
    set({ isLoadingPrenoms: true });
    try {
      const response = await prenomsApi.getAll();
      set({ prenoms: response.data, isLoadingPrenoms: false });
    } catch (error) {
      console.error('Error fetching prenoms:', error);
      set({ isLoadingPrenoms: false });
    }
  },

  addPrenom: (prenom) => {
    set((state) => ({
      prenoms: [...state.prenoms, prenom],
    }));
  },

  updatePrenom: (id, updates) => {
    set((state) => ({
      prenoms: state.prenoms.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  removePrenom: (id) => {
    set((state) => ({
      prenoms: state.prenoms.filter((p) => p.id !== id),
    }));
  },

  // Selection
  toggleSelectMessage: (id) => {
    set((state) => {
      const newSelection = new Set(state.selectedMessages);
      if (newSelection.has(id)) {
        newSelection.delete(id);
      } else {
        newSelection.add(id);
      }
      return { selectedMessages: newSelection };
    });
  },

  clearSelection: () => {
    set({ selectedMessages: new Set() });
  },

  selectAll: () => {
    const allIds = get().messages.map((m) => m.id);
    set({ selectedMessages: new Set(allIds) });
  },

  // Getters
  getActivePrenoms: () => {
    return get().prenoms.filter((p) => p.active);
  },

  getPrenomById: (id) => {
    return get().prenoms.find((p) => p.id === id);
  },

  getTagById: (id) => {
    return get().tags.find((t) => t.id === id);
  },

  getMessageById: (id) => {
    return get().messages.find((m) => m.id === id);
  },
}));
