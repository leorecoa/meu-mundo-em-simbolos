import Dexie, { type Table } from 'dexie';

export interface Category {
  id?: number;
  key: string; 
  name: string;
}

export interface Symbol {
  id?: number;
  name: string;
  imageUrl: string; 
  categoryId: number;
  isCustom: boolean;
}

export interface UserSettings {
  id?: number;
  voiceType: 'feminina' | 'masculina' | 'infantil';
  voiceSpeed: number;
  largeIcons: boolean;
  useAudioFeedback: boolean;
  theme: string;
  language: string;
}

export interface Phrase {
  id?: number;
  text: string;
  symbols: { id: string; text: string }[];
  timestamp: number;
  isFavorite: boolean;
}

export interface Coin {
  id?: number;
  total: number;
}

export interface Task {
  id: string;
  name: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  unlocked: boolean;
}

export class MySubClassedDexie extends Dexie {
  categories!: Table<Category>;
  symbols!: Table<Symbol>;
  userSettings!: Table<UserSettings>;
  phrases!: Table<Phrase>;
  coins!: Table<Coin>;
  tasks!: Table<Task>;
  achievements!: Table<Achievement>;

  constructor() {
    super('meuMundoEmSimbolosDB');
    this.version(5).stores({
      categories: '++id, &key, name',
      symbols: '++id, name, categoryId, isCustom',
      userSettings: 'id',
      phrases: '++id, timestamp, isFavorite',
      coins: 'id',
      tasks: 'id',
      achievements: 'id',
    });
    // Manter versões antigas para migração
    this.version(4).stores({
      categories: '++id, &key, name',
      symbols: '++id, name, categoryId, isCustom',
      userSettings: 'id',
      coins: 'id',
      tasks: 'id',
      achievements: 'id',
    }).upgrade(tx => tx.table('users').clear());
  }
}

export const db = new MySubClassedDexie();
