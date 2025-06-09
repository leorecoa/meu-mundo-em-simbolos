import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { PhraseSymbol } from '@/lib/storage';

interface QuickPhraseBarProps {
  onUsePhrase: (symbols: PhraseSymbol[]) => void;
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
  const quickPhrases: Record<string, {text: string, symbols: PhraseSymbol[]}[]> = {
    'Frequentes': [
      {
        text: 'EU QUERO ÁGUA',
        symbols: [
          { id: 'eu', text: 'EU' },
          { id: 'quero', text: 'QUERO' },
          { id: 'agua', text: 'ÁGUA' }
        ]
      },
      {
        text: 'EU ESTOU COM FOME',
        symbols: [
          { id: 'eu', text: 'EU' },
          { id: 'estou', text: 'ESTOU' },
          { id: 'com', text: 'COM' },
          { id: 'fome', text: 'FOME' }
        ]
      },
      {
        text: 'EU PRECISO IR AO BANHEIRO',
        symbols: [
          { id: 'eu', text: 'EU' },
          { id: 'preciso', text: 'PRECISO' },
          { id: 'ir', text: 'IR' },
          { id: 'ao', text: 'AO' },
          { id: 'banheiro', text: 'BANHEIRO' }
        ]
      }
    ],
    'Necessidades': [
      {
        text: 'EU QUERO COMER',
        symbols: [
          { id: 'eu', text: 'EU' },
          { id: 'quero', text: 'QUERO' },
          { id: 'comer', text: 'COMER' }
        ]
      },
      {
        text: 'EU QUERO BEBER',
        symbols: [
          { id: 'eu', text: 'EU' },
          { id: 'quero', text: 'QUERO' },
          { id: 'beber', text: 'BEBER' }
        ]
      },
      {
        text: 'EU PRECISO DESCANSAR',
        symbols: [
          { id: 'eu', text: 'EU' },
          { id: 'preciso', text: 'PRECISO' },
          { id: 'descansar', text: 'DESCANSAR' }
        ]
      },
      {
        text: 'EU QUERO DORMIR',
        symbols: [
          { id: 'eu', text: 'EU' },
          { id: 'quero', text: 'QUERO' },
          { id: 'dormir', text: 'DORMIR' }
        ]
      }
    ],
    'Perguntas': [
      {
        text: 'ONDE ESTÁ?',
        symbols: [
          { id: 'onde', text: 'ONDE' },
          { id: 'esta', text: 'ESTÁ' },
          { id: 'interrogacao', text: '?' }
        ]
      },
      {
        text: 'POSSO IR?',
        symbols: [
          { id: 'posso', text: 'POSSO' },
          { id: 'ir', text: 'IR' },
          { id: 'interrogacao', text: '?' }
        ]
      },
      {
        text: 'VOCÊ PODE ME AJUDAR?',
        symbols: [
          { id: 'voce', text: 'VOCÊ' },
          { id: 'pode', text: 'PODE' },
          { id: 'me', text: 'ME' },
          { id: 'ajudar', text: 'AJUDAR' },
          { id: 'interrogacao', text: '?' }
        ]
      }
    ],
    'Sentimentos': [
      {
        text: 'EU ESTOU FELIZ',
        symbols: [
          { id: 'eu', text: 'EU' },
          { id: 'estou', text: 'ESTOU' },
          { id: 'feliz', text: 'FELIZ' }
        ]
      },
      {
        text: 'EU ESTOU TRISTE',
        symbols: [
          { id: 'eu', text: 'EU' },
          { id: 'estou', text: 'ESTOU' },
          { id: 'triste', text: 'TRISTE' }
        ]
      },
      {
        text: 'EU ESTOU COM DOR',
        symbols: [
          { id: 'eu', text: 'EU' },
          { id: 'estou', text: 'ESTOU' },
          { id: 'com', text: 'COM' },
          { id: 'dor', text: 'DOR' }
        ]
      },
      {
        text: 'EU ESTOU CANSADO',
        symbols: [
          { id: 'eu', text: 'EU' },
          { id: 'estou', text: 'ESTOU' },
          { id: 'cansado', text: 'CANSADO' }
        ]
      }
    ],
    'Social': [
      {
        text: 'OLÁ',
        symbols: [
          { id: 'ola', text: 'OLÁ' }
        ]
      },
      {
        text: 'TCHAU',
        symbols: [
          { id: 'tchau', text: 'TCHAU' }
        ]
      },
      {
        text: 'OBRIGADO',
        symbols: [
          { id: 'obrigado', text: 'OBRIGADO' }
        ]
      },
      {
        text: 'POR FAVOR',
        symbols: [
          { id: 'por', text: 'POR' },
          { id: 'favor', text: 'FAVOR' }
        ]
      },
      {
        text: 'DESCULPE',
        symbols: [
          { id: 'desculpe', text: 'DESCULPE' }
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