import Dexie, { type Table } from 'dexie';

// Defina suas interfaces aqui (se já não estiverem)
export interface Profile {
  id?: number;
  name: string;
}

export interface Category {
  id?: number;
  profileId: number;
  key: string;
  name: string;
  // ...outros campos
}

export interface Symbol {
  id?: number;
  profileId: number;
  text: string;
  categoryKey: string;
  order: number;
  // ...outros campos
}

// ...outras interfaces

export class MySubClassedDexie extends Dexie {
  // Declaração das tabelas para ter tipagem forte
  profiles!: Table<Profile>;
  categories!: Table<Category>;
  symbols!: Table<Symbol>;
  // ...outras tabelas

  constructor() {
    super('MeuMundoEmSimbolosDB');

    // 1. Definição do Schema (código que você já tinha)
    this.version(2).stores({
      profiles: '++id, name',
      categories: '++id, profileId, &[profileId+key]',
      symbols: '++id, profileId, text, categoryKey, order',
      userSettings: '++id, &profileId',
      coins: '&id',
      dailyGoals: '&id',
      achievements: '&id',
      rewards: '&id',
      security: '&id',
      usageEvents: '++id'
    });

    // ===================================================================
    // NOVO CÓDIGO ADICIONADO AQUI
    // Esta é a maneira correta de adicionar dados iniciais ao banco.
    // O evento 'populate' só é executado UMA VEZ, quando o banco
    // de dados é criado pela primeira vez no navegador do usuário.
    // ===================================================================
    this.on('populate', async () => {
      // Usamos uma transação para garantir que todos os dados sejam
      // adicionados com sucesso, ou nenhum deles será.
      await this.transaction('rw', this.profiles, this.categories, this.symbols, async () => {

        // Crie um perfil padrão
        const defaultProfileId = await this.profiles.add({
          name: 'Padrão'
        });

        // Adicione suas categorias iniciais
        // (Substitua estes dados pelos seus)
        await this.categories.bulkAdd([
          { profileId: defaultProfileId, key: 'pessoas', name: 'Pessoas' },
          { profileId: defaultProfileId, key: 'comida', name: 'Comida' },
          { profileId: defaultProfileId, key: 'lugares', name: 'Lugares' },
        ]);

        // Adicione seus símbolos iniciais
        // (Substitua estes dados pelos seus)
        await this.symbols.bulkAdd([
          { profileId: defaultProfileId, text: 'Eu', categoryKey: 'pessoas', order: 0 },
          { profileId: defaultProfileId, text: 'Casa', categoryKey: 'lugares', order: 0 },
          { profileId: defaultProfileId, text: 'Água', categoryKey: 'comida', order: 0 },
        ]);

        // Adicione aqui a população de outras tabelas se for necessário...
      });
    });
  }
}

export const db = new MySubClassedDexie();