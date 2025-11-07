
export interface CategoryItem {
  id: string;
  label: string;
  icon: string; // Ícones agora são strings
  sound?: string;
}

export interface CategoryData {
  [key: string]: {
    title: string;
    items: CategoryItem[];
  };
}

export const categoryData: CategoryData = {
  // Categoria EU QUERO
  quero: {
    title: 'EU QUERO',
    items: [
      { id: 'agua', label: 'ÁGUA', icon: 'Coffee' },
      { id: 'comida', label: 'COMIDA', icon: 'Apple' },
      { id: 'brincar', label: 'BRINCAR', icon: 'Gamepad2' },
      { id: 'dormir', label: 'DORMIR', icon: 'Bed' },
      { id: 'sair', label: 'SAIR', icon: 'DoorOpen' },
      { id: 'assistir', label: 'ASSISTIR TV', icon: 'Tv' },
      { id: 'musica', label: 'MÚSICA', icon: 'Music' },
      { id: 'abraco', label: 'ABRAÇO', icon: 'HeartHug' },
      { id: 'ajuda', label: 'AJUDA', icon: 'HandHeart' },
      { id: 'banho', label: 'BANHO', icon: 'Bath' },
      { id: 'ler', label: 'LER', icon: 'Book' },
      { id: 'bicicleta', label: 'BICICLETA', icon: 'Bike' }
    ]
  },

  // Categoria EU SINTO
  sinto: {
    title: 'EU SINTO',
    items: [
      { id: 'feliz', label: 'FELIZ', icon: 'Smile' },
      { id: 'triste', label: 'TRISTE', icon: 'CloudRain' },
      { id: 'bravo', label: 'BRAVO', icon: 'Angry' },
      { id: 'cansado', label: 'CANSADO', icon: 'Battery' },
      { id: 'sono', label: 'SONO', icon: 'Moon' },
      { id: 'doente', label: 'DOENTE', icon: 'Thermometer' },
      { id: 'com_fome', label: 'FOME', icon: 'Apple' },
      { id: 'com_sede', label: 'SEDE', icon: 'Coffee' },
      { id: 'animado', label: 'ANIMADO', icon: 'Sun' },
      { id: 'nervoso', label: 'NERVOSO', icon: 'Frown' },
      { id: 'com_medo', label: 'MEDO', icon: 'Shield' },
      { id: 'amor', label: 'AMOR', icon: 'Heart' },
      { id: 'infinito', label: 'INFINITO', icon: 'InfinitySymbol' }
    ]
  },

  // Categoria EU PRECISO
  preciso: {
    title: 'EU PRECISO',
    items: [
      { id: 'banheiro', label: 'BANHEIRO', icon: 'Bath' },
      { id: 'agua_preciso', label: 'ÁGUA', icon: 'Coffee' },
      { id: 'comida_preciso', label: 'COMIDA', icon: 'Apple' },
      { id: 'ajuda_preciso', label: 'AJUDA', icon: 'HandHeart' },
      { id: 'descansar', label: 'DESCANSAR', icon: 'Bed' },
      { id: 'conversar', label: 'CONVERSAR', icon: 'Users' },
      { id: 'medico', label: 'MÉDICO', icon: 'UserCheck' },
      { id: 'ligar', label: 'LIGAR', icon: 'Phone' },
      { id: 'sair_preciso', label: 'SAIR', icon: 'DoorOpen' },
      { id: 'silencio', label: 'SILÊNCIO', icon: 'Moon' },
      { id: 'luz', label: 'LUZ', icon: 'Lamp' },
      { id: 'chave', label: 'CHAVE', icon: 'Key' }
    ]
  },

  // Subcategoria COMIDA
  comida: {
    title: 'COMIDA',
    items: [
      { id: 'agua_comida', label: 'ÁGUA', icon: 'Coffee' },
      { id: 'leite', label: 'LEITE', icon: 'Milk' },
      { id: 'fruta', label: 'FRUTA', icon: 'Apple' },
      { id: 'banana', label: 'BANANA', icon: 'Banana' },
      { id: 'sorvete', label: 'SORVETE', icon: 'IceCream' },
      { id: 'pizza', label: 'PIZZA', icon: 'Pizza' },
      { id: 'sanduiche', label: 'SANDUÍCHE', icon: 'Sandwich' },
      { id: 'biscoito', label: 'BISCOITO', icon: 'Cookie' },
      { id: 'bolo', label: 'BOLO', icon: 'Cake' },
      { id: 'pao', label: 'PÃO', icon: 'Sandwich' },
      { id: 'arroz', label: 'ARROZ', icon: 'Apple' },
      { id: 'macarrao', label: 'MACARRÃO', icon: 'Sandwich' }
    ]
  },

  // Subcategoria BRINCAR
  brincar: {
    title: 'BRINCAR',
    items: [
      { id: 'bola', label: 'BOLA', icon: 'Circle' },
      { id: 'carrinho', label: 'CARRINHO', icon: 'Car' },
      { id: 'jogo', label: 'JOGO', icon: 'Gamepad2' },
      { id: 'dados', label: 'DADOS', icon: 'Dices' },
      { id: 'quebra_cabeca', label: 'QUEBRA-CABEÇA', icon: 'Palette' },
      { id: 'musica_brincar', label: 'MÚSICA', icon: 'Music' },
      { id: 'livro_brincar', label: 'LIVRO', icon: 'Book' },
      { id: 'bicicleta_brincar', label: 'BICICLETA', icon: 'Bike' },
      { id: 'boneca', label: 'BONECA', icon: 'Users' },
      { id: 'parque', label: 'PARQUE', icon: 'Circle' },
      { id: 'pintar', label: 'PINTAR', icon: 'Palette' },
      { id: 'infinito', label: 'INFINITO', icon: 'InfinitySymbol' },
      { id: 'correr', label: 'CORRER', icon: 'Bike' }
    ]
  },

  // Subcategoria CASA
  casa: {
    title: 'CASA',
    items: [
      { id: 'quarto', label: 'QUARTO', icon: 'Bed' },
      { id: 'sala', label: 'SALA', icon: 'Sofa' },
      { id: 'banheiro_casa', label: 'BANHEIRO', icon: 'Bath' },
      { id: 'cozinha', label: 'COZINHA', icon: 'Apple' },
      { id: 'televisao', label: 'TELEVISÃO', icon: 'Tv' },
      { id: 'cama', label: 'CAMA', icon: 'Bed' },
      { id: 'sofa', label: 'SOFÁ', icon: 'Sofa' },
      { id: 'mesa', label: 'MESA', icon: 'Sofa' },
      { id: 'cadeira', label: 'CADEIRA', icon: 'Sofa' },
      { id: 'porta', label: 'PORTA', icon: 'DoorOpen' },
      { id: 'janela', label: 'JANELA', icon: 'Home' },
      { id: 'luz_casa', label: 'LUZ', icon: 'Lamp' }
    ]
  },

  // ESCOLA
  escola: {
    title: 'ESCOLA',
    items: [
      { id: 'lapis', label: 'LÁPIS', icon: 'Pencil' },
      { id: 'caderno', label: 'CADERNO', icon: 'Book' },
      { id: 'professor', label: 'PROFESSOR', icon: 'UserCheck' },
      { id: 'colega', label: 'COLEGA', icon: 'Users' },
      { id: 'recreio', label: 'RECREIO', icon: 'Gamepad2' },
      { id: 'estudar', label: 'ESTUDAR', icon: 'BookOpen' },
      { id: 'livro_escola', label: 'LIVRO', icon: 'Book' },
      { id: 'mochila', label: 'MOCHILA', icon: 'Backpack' }
    ]
  },

  // FAMÍLIA
  familia: {
    title: 'FAMÍLIA',
    items: [
      { id: 'mamae', label: 'MAMÃE', icon: 'Heart' },
      { id: 'papai', label: 'PAPAI', icon: 'Heart' },
      { id: 'irmao', label: 'IRMÃO', icon: 'Users' },
      { id: 'irma', label: 'IRMÃ', icon: 'Users' },
      { id: 'avo', label: 'AVÔ', icon: 'HeartHug' },
      { id: 'avoa', label: 'AVÓ', icon: 'HeartHug' },
      { id: 'primo', label: 'PRIMO', icon: 'Users' },
      { id: 'tio', label: 'TIO', icon: 'Users' },
      { id: 'tia', label: 'TIA', icon: 'Users' }
    ]
  },

  // ANIMAIS
  animais: {
    title: 'ANIMAIS',
    items: [
      { id: 'cachorro', label: 'CACHORRO', icon: 'Dog' },
      { id: 'gato', label: 'GATO', icon: 'Cat' },
      { id: 'passaro', label: 'PÁSSARO', icon: 'Bird' },
      { id: 'peixe', label: 'PEIXE', icon: 'Fish' },
      { id: 'coelho', label: 'COELHO', icon: 'Rabbit' },
      { id: 'cavalo', label: 'CAVALO', icon: 'Horse' },
      { id: 'vaca', label: 'VACA', icon: 'Beef' },
      { id: 'galinha', label: 'GALINHA', icon: 'Bird' }
    ]
  }
};
