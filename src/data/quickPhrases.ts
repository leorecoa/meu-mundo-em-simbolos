export interface QuickPhrase {
  id: string;
  text: string;
  category: string;
  icon: string;
}

export const quickPhrases: QuickPhrase[] = [
  // Necessidades básicas
  { id: 'quero-agua', text: 'EU QUERO ÁGUA', category: 'quero', icon: 'Coffee' },
  { id: 'quero-comer', text: 'EU QUERO COMER', category: 'comida', icon: 'Apple' },
  { id: 'preciso-banheiro', text: 'EU PRECISO IR AO BANHEIRO', category: 'preciso', icon: 'Bath' },
  { id: 'preciso-ajuda', text: 'EU PRECISO DE AJUDA', category: 'preciso', icon: 'HandHeart' },
  
  // Sentimentos
  { id: 'estou-feliz', text: 'EU ESTOU FELIZ', category: 'sinto', icon: 'Smile' },
  { id: 'estou-triste', text: 'EU ESTOU TRISTE', category: 'sinto', icon: 'CloudRain' },
  { id: 'estou-cansado', text: 'EU ESTOU CANSADO', category: 'sinto', icon: 'Battery' },
  { id: 'tenho-fome', text: 'EU TENHO FOME', category: 'sinto', icon: 'Apple' },
  { id: 'tenho-dor', text: 'EU TENHO DOR', category: 'sinto', icon: 'Frown' },
  
  // Atividades
  { id: 'quero-brincar', text: 'EU QUERO BRINCAR', category: 'brincar', icon: 'Gamepad2' },
  { id: 'quero-dormir', text: 'EU QUERO DORMIR', category: 'casa', icon: 'Bed' },
  { id: 'quero-assistir-tv', text: 'EU QUERO ASSISTIR TV', category: 'casa', icon: 'Tv' },
  { id: 'quero-sair', text: 'EU QUERO SAIR', category: 'casa', icon: 'DoorOpen' },
  { id: 'quero-musica', text: 'EU QUERO MÚSICA', category: 'brincar', icon: 'Music' },
  
  // Sociais
  { id: 'obrigado', text: 'OBRIGADO', category: 'sinto', icon: 'Heart' },
  { id: 'por-favor', text: 'POR FAVOR', category: 'preciso', icon: 'HandHeart' },
  { id: 'sim', text: 'SIM', category: 'preciso', icon: 'UserCheck' },
  { id: 'nao', text: 'NÃO', category: 'preciso', icon: 'Shield' },
  { id: 'oi', text: 'OI', category: 'sinto', icon: 'Users' },
  { id: 'tchau', text: 'TCHAU', category: 'sinto', icon: 'Users' },
  
  // Comida específica
  { id: 'quero-pizza', text: 'EU QUERO PIZZA', category: 'comida', icon: 'Pizza' },
  { id: 'quero-sorvete', text: 'EU QUERO SORVETE', category: 'comida', icon: 'IceCream' },
  { id: 'quero-leite', text: 'EU QUERO LEITE', category: 'comida', icon: 'Milk' },
  { id: 'quero-fruta', text: 'EU QUERO FRUTA', category: 'comida', icon: 'Apple' },
  { id: 'quero-doce', text: 'EU QUERO DOCE', category: 'comida', icon: 'Cookie' },
];
