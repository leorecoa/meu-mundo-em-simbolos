import type { Category, Symbol as DbSymbol } from './db';

interface SymbolPack {
  category: Omit<Category, 'id' | 'profileId'>;
  symbols: Omit<DbSymbol, 'id' | 'profileId' | 'image'>[];
}

export const rewardPacks: Record<string, SymbolPack> = {
  pack_animals: {
    category: { key: 'animais', name: 'Animais', color: 'orange' },
    symbols: [
      { text: 'Cachorro', categoryKey: 'animais', order: 100 }, { text: 'Gato', categoryKey: 'animais', order: 101 }, { text: 'Pássaro', categoryKey: 'animais', order: 102 }, { text: 'Peixe', categoryKey: 'animais', order: 103 }, { text: 'Leão', categoryKey: 'animais', order: 104 },
      { text: 'Macaco', categoryKey: 'animais', order: 105 }, { text: 'Elefante', categoryKey: 'animais', order: 106 }, { text: 'Girafa', categoryKey: 'animais', order: 107 }, { text: 'Vaca', categoryKey: 'animais', order: 108 }, { text: 'Pinto', categoryKey: 'animais', order: 109 },
    ],
  },
  pack_toys: {
    category: { key: 'brinquedos', name: 'Brinquedos', color: 'rose' },
    symbols: [
        { text: 'Bola', categoryKey: 'brinquedos', order: 200 }, { text: 'Boneca', categoryKey: 'brinquedos', order: 201 }, { text: 'Carrinho', categoryKey: 'brinquedos', order: 202 }, { text: 'Lego', categoryKey: 'brinquedos', order: 203 }, { text: 'Videogame', categoryKey: 'brinquedos', order: 204 },
        { text: 'Quebra-cabeça', categoryKey: 'brinquedos', order: 205 }, { text: 'Urso de Pelúcia', categoryKey: 'brinquedos', order: 206 }, { text: 'Pipa', categoryKey: 'brinquedos', order: 207 }, { text: 'Bicicleta', categoryKey: 'brinquedos', order: 208 }, { text: 'Skate', categoryKey: 'brinquedos', order: 209 },
    ],
  },
  pack_vehicles: {
    category: { key: 'veiculos', name: 'Veículos', color: 'sky' },
    symbols: [
        { text: 'Carro', categoryKey: 'veiculos', order: 300 }, { text: 'Ônibus', categoryKey: 'veiculos', order: 301 }, { text: 'Avião', categoryKey: 'veiculos', order: 302 }, { text: 'Barco', categoryKey: 'veiculos', order: 303 }, { text: 'Moto', categoryKey: 'veiculos', order: 304 },
        { text: 'Trator', categoryKey: 'veiculos', order: 305 }, { text: 'Caminhão', categoryKey: 'veiculos', order: 306 }, { text: 'Helicóptero', categoryKey: 'veiculos', order: 307 }, { text: 'Trem', categoryKey: 'veiculos', order: 308 }, { text: 'Foguete', categoryKey: 'veiculos', order: 309 },
    ],
  },
  pack_clothing: {
    category: { key: 'roupas', name: 'Roupas', color: 'violet' },
    symbols: [
        { text: 'Camisa', categoryKey: 'roupas', order: 400 }, { text: 'Calça', categoryKey: 'roupas', order: 401 }, { text: 'Vestido', categoryKey: 'roupas', order: 402 }, { text: 'Saia', categoryKey: 'roupas', order: 403 }, { text: 'Sapato', categoryKey: 'roupas', order: 404 },
        { text: 'Meia', categoryKey: 'roupas', order: 405 }, { text: 'Chapéu', categoryKey: 'roupas', order: 406 }, { text: 'Casaco', categoryKey: 'roupas', order: 407 }, { text: 'Pijama', categoryKey: 'roupas', order: 408 }, { text: 'Luvas', categoryKey: 'roupas', order: 409 },
    ],
  },
    pack_weather: {
    category: { key: 'clima', name: 'Clima', color: 'teal' },
    symbols: [
        { text: 'Sol', categoryKey: 'clima', order: 500 }, { text: 'Chuva', categoryKey: 'clima', order: 501 }, { text: 'Nuvem', categoryKey: 'clima', order: 502 }, { text: 'Vento', categoryKey: 'clima', order: 503 }, { text: 'Neve', categoryKey: 'clima', order: 504 }
    ],
  },
};
