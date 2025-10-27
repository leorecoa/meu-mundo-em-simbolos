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

export interface Coin {
  id?: number; // Apenas um registro com o total
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
  coins!: Table<Coin>;
  tasks!: Table<Task>;
  achievements!: Table<Achievement>;

  constructor() {
    super('meuMundoEmSimbolosDB');
    this.version(4).stores({
      categories: '++id, &key, name',
      symbols: '++id, name, categoryId, isCustom',
      userSettings: 'id',
      coins: 'id',
      tasks: 'id',
      achievements: 'id',
    });
    this.version(3).stores({
      categories: '++id, &key, name',
      symbols: '++id, name, categoryId, isCustom',
      userSettings: 'id',
    });
    this.version(2).stores({
      categories: '++id, &key, name',
      symbols: '++id, name, categoryId, isCustom',
      users: '++id, name',
    });
    this.version(1).stores({
      categories: '++id, &key, name',
      symbols: '++id, name, categoryId',
      users: '++id, name',
    });
  }
}

export const db = new MySubClassedDexie();
