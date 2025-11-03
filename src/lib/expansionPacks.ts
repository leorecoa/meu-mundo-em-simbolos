import type { Category, Symbol as DbSymbol } from './db';

interface SymbolPack {
  category: Omit<Category, 'id' | 'profileId'>;
  symbols: Omit<DbSymbol, 'id' | 'profileId'>[];
}

export const rewardPacks: Record<string, SymbolPack> = {
  pack_animals: {
    category: { key: 'animais', name: 'Animais', color: 'orange' },
    symbols: [
      { text: 'Cachorro', categoryKey: 'animais', order: 100 },
      { text: 'Gato', categoryKey: 'animais', order: 101 },
      { text: 'Pássaro', categoryKey: 'animais', order: 102 },
      { text: 'Peixe', categoryKey: 'animais', order: 103 },
      { text: 'Leão', categoryKey: 'animais', order: 104 },
    ],
  },
  pack_toys: {
    category: { key: 'brinquedos', name: 'Brinquedos', color: 'rose' },
    symbols: [
      { text: 'Bola', categoryKey: 'brinquedos', order: 200 },
      { text: 'Boneca', categoryKey: 'brinquedos', order: 201 },
      { text: 'Carrinho', categoryKey: 'brinquedos', order: 202 },
      { text: 'Lego', categoryKey: 'brinquedos', order: 203 },
      { text: 'Videogame', categoryKey: 'brinquedos', order: 204 },
    ],
  },
  pack_vehicles: {
    category: { key: 'veiculos', name: 'Veículos', color: 'sky' },
    symbols: [
      { text: 'Carro', categoryKey: 'veiculos', order: 300 },
      { text: 'Ônibus', categoryKey: 'veiculos', order: 301 },
      { text: 'Avião', categoryKey: 'veiculos', order: 302 },
      { text: 'Barco', categoryKey: 'veiculos', order: 303 },
      { text: 'Moto', categoryKey: 'veiculos', order: 304 },
    ],
  },
};
