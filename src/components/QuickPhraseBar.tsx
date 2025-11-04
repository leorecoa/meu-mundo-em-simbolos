import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { Symbol as DbSymbol } from '@/lib/db';

interface QuickPhraseBarProps {
  onUsePhrase: (symbols: DbSymbol[]) => void;
}

export const QuickPhraseBar = ({ onUsePhrase }: QuickPhraseBarProps) => {
  const { currentTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('Frequentes');
  
  // Categorias de frases rápidas
  const categories = [
    'Frequentes',
    'Necessidades',
    'Perguntas',
    'Sentimentos',
    'Social'
  ];
  
  // Frases organizadas por categoria
  const quickPhrases: Record<string, {text: string, symbols: DbSymbol[]}[]> = {
    'Frequentes': [
      {
        text: 'EU QUERO ÁGUA',
        symbols: [
          { id: 1, text: 'EU', profileId: 1, categoryKey: 'pessoas', order: 1 },
          { id: 2, text: 'QUERO', profileId: 1, categoryKey: 'acoes', order: 10 },
          { id: 3, text: 'ÁGUA', profileId: 1, categoryKey: 'comida', order: 42 },
        ]
      },
      {
        text: 'EU ESTOU COM FOME',
        symbols: [
          { id: 1, text: 'EU', profileId: 1, categoryKey: 'pessoas', order: 1 },
          { id: 4, text: 'ESTOU', profileId: 1, categoryKey: 'acoes', order: 12 },
          { id: 5, text: 'COM', profileId: 1, categoryKey: 'geral', order: 52 },
          { id: 6, text: 'FOME', profileId: 1, categoryKey: 'sentimentos', order: 24 }
        ]
      },
      {
        text: 'EU PRECISO IR AO BANHEIRO',
        symbols: [
          { id: 1, text: 'EU', profileId: 1, categoryKey: 'pessoas', order: 1 },
          { id: 7, text: 'PRECISO', profileId: 1, categoryKey: 'acoes', order: 13 },
          { id: 8, text: 'IR', profileId: 1, categoryKey: 'acoes', order: 14 },
          { id: 9, text: 'AO', profileId: 1, categoryKey: 'geral', order: 53 },
          { id: 10, text: 'BANHEIRO', profileId: 1, categoryKey: 'lugares', order: 32 }
        ]
      }
    ],
    'Necessidades': [
      {
        text: 'EU QUERO COMER',
        symbols: [
          { id: 1, text: 'EU', profileId: 1, categoryKey: 'pessoas', order: 1 },
          { id: 2, text: 'QUERO', profileId: 1, categoryKey: 'acoes', order: 10 },
          { id: 11, text: 'COMER', profileId: 1, categoryKey: 'comida', order: 40 }
        ]
      },
      {
        text: 'EU QUERO BEBER',
        symbols: [
          { id: 1, text: 'EU', profileId: 1, categoryKey: 'pessoas', order: 1 },
          { id: 2, text: 'QUERO', profileId: 1, categoryKey: 'acoes', order: 10 },
          { id: 12, text: 'BEBER', profileId: 1, categoryKey: 'comida', order: 41 }
        ]
      },
      {
        text: 'EU PRECISO DESCANSAR',
        symbols: [
          { id: 1, text: 'EU', profileId: 1, categoryKey: 'pessoas', order: 1 },
          { id: 7, text: 'PRECISO', profileId: 1, categoryKey: 'acoes', order: 13 },
          { id: 13, text: 'DESCANSAR', profileId: 1, categoryKey: 'acoes', order: 15 }
        ]
      },
      {
        text: 'EU QUERO DORMIR',
        symbols: [
          { id: 1, text: 'EU', profileId: 1, categoryKey: 'pessoas', order: 1 },
          { id: 2, text: 'QUERO', profileId: 1, categoryKey: 'acoes', order: 10 },
          { id: 14, text: 'DORMIR', profileId: 1, categoryKey: 'acoes', order: 16 }
        ]
      }
    ],
    'Perguntas': [
      {
        text: 'ONDE ESTÁ?',
        symbols: [
          { id: 15, text: 'ONDE', profileId: 1, categoryKey: 'geral', order: 54 },
          { id: 16, text: 'ESTÁ', profileId: 1, categoryKey: 'acoes', order: 17 },
          { id: 17, text: '?', profileId: 1, categoryKey: 'geral', order: 55 }
        ]
      },
      {
        text: 'POSSO IR?',
        symbols: [
          { id: 18, text: 'POSSO', profileId: 1, categoryKey: 'acoes', order: 18 },
          { id: 8, text: 'IR', profileId: 1, categoryKey: 'acoes', order: 14 },
          { id: 17, text: '?', profileId: 1, categoryKey: 'geral', order: 55 }
        ]
      },
      {
        text: 'VOCÊ PODE ME AJUDAR?',
        symbols: [
          { id: 2, text: 'VOCÊ', profileId: 1, categoryKey: 'pessoas', order: 2 },
          { id: 19, text: 'PODE', profileId: 1, categoryKey: 'acoes', order: 19 },
          { id: 20, text: 'ME', profileId: 1, categoryKey: 'pessoas', order: 5 },
          { id: 21, text: 'AJUDAR', profileId: 1, categoryKey: 'acoes', order: 20 },
          { id: 17, text: '?', profileId: 1, categoryKey: 'geral', order: 55 }
        ]
      }
    ],
    'Sentimentos': [
      {
        text: 'EU ESTOU FELIZ',
        symbols: [
          { id: 1, text: 'EU', profileId: 1, categoryKey: 'pessoas', order: 1 },
          { id: 4, text: 'ESTOU', profileId: 1, categoryKey: 'acoes', order: 12 },
          { id: 7, text: 'FELIZ', profileId: 1, categoryKey: 'sentimentos', order: 21 }
        ]
      },
      {
        text: 'EU ESTOU TRISTE',
        symbols: [
          { id: 1, text: 'EU', profileId: 1, categoryKey: 'pessoas', order: 1 },
          { id: 4, text: 'ESTOU', profileId: 1, categoryKey: 'acoes', order: 12 },
          { id: 22, text: 'TRISTE', profileId: 1, categoryKey: 'sentimentos', order: 22 }
        ]
      },
      {
        text: 'EU ESTOU COM DOR',
        symbols: [
          { id: 1, text: 'EU', profileId: 1, categoryKey: 'pessoas', order: 1 },
          { id: 4, text: 'ESTOU', profileId: 1, categoryKey: 'acoes', order: 12 },
          { id: 5, text: 'COM', profileId: 1, categoryKey: 'geral', order: 52 },
          { id: 23, text: 'DOR', profileId: 1, categoryKey: 'sentimentos', order: 23 }
        ]
      },
      {
        text: 'EU ESTOU CANSADO',
        symbols: [
          { id: 1, text: 'EU', profileId: 1, categoryKey: 'pessoas', order: 1 },
          { id: 4, text: 'ESTOU', profileId: 1, categoryKey: 'acoes', order: 12 },
          { id: 24, text: 'CANSADO', profileId: 1, categoryKey: 'sentimentos', order: 24 }
        ]
      }
    ],
    'Social': [
      {
        text: 'OLÁ',
        symbols: [
          { id: 25, text: 'OLÁ', profileId: 1, categoryKey: 'geral', order: 56 }
        ]
      },
      {
        text: 'TCHAU',
        symbols: [
          { id: 26, text: 'TCHAU', profileId: 1, categoryKey: 'geral', order: 57 }
        ]
      },
      {
        text: 'OBRIGADO',
        symbols: [
          { id: 27, text: 'OBRIGADO', profileId: 1, categoryKey: 'geral', order: 58 }
        ]
      },
      {
        text: 'POR FAVOR',
        symbols: [
          { id: 28, text: 'POR', profileId: 1, categoryKey: 'geral', order: 59 },
          { id: 29, text: 'FAVOR', profileId: 1, categoryKey: 'geral', order: 60 }
        ]
      },
      {
        text: 'DESCULPE',
        symbols: [
          { id: 30, text: 'DESCULPE', profileId: 1, categoryKey: 'geral', order: 61 }
        ]
      }
    ]
  };
  
  // Manipular seleção de categoria
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
  };
  
  // Obter frases da categoria atual
  const getPhrasesToDisplay = () => {
    return quickPhrases[activeCategory] || [];
  };

  return (
    <div className="space-y-3">
      {/* Categorias */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {categories.map((category) => (
          <button 
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap
              ${category === activeCategory 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Frases da categoria selecionada */}
      <div className="flex flex-wrap gap-2">
        {getPhrasesToDisplay().map((phraseItem, index) => (
          <Button 
            key={`${activeCategory}-${index}`}
            variant="outline"
            className="bg-green-50 hover:bg-green-100 text-green-800 px-3 py-1 h-auto text-sm"
            onClick={() => onUsePhrase(phraseItem.symbols)}
          >
            {phraseItem.text}
          </Button>
        ))}
      </div>
    </div>
  );
};