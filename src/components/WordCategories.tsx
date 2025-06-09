import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

interface WordCategoriesProps {
  onSelectCategory: (category: string) => void;
  onSelectWord: (word: string) => void;
}

export const WordCategories = ({ onSelectCategory, onSelectWord }: WordCategoriesProps) => {
  const { currentTheme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  
  // Categorias de palavras
  const categories = [
    'Todos',
    'Pronomes',
    'Verbos',
    'Necessidades',
    'Sentimentos',
    'Pessoas',
    'Lugares',
    'Alimentos',
    'Adjetivos',
    'Conectivos'
  ];
  
  // Palavras organizadas por categoria
  const wordsByCategory: Record<string, string[]> = {
    'Pronomes': ['EU', 'VOCÊ', 'ELE', 'ELA', 'NÓS', 'ELES', 'MINHA', 'MEU', 'SEU', 'SUA', 'ESTE', 'ESTA', 'ISSO'],
    'Verbos': ['QUERO', 'PRECISO', 'SINTO', 'VOU', 'ESTOU', 'TENHO', 'GOSTO', 'POSSO', 'AJUDA', 'DÁ', 'FAZ', 'COMER', 'BEBER', 'DORMIR', 'BRINCAR'],
    'Necessidades': ['BANHEIRO', 'ÁGUA', 'COMIDA', 'DORMIR', 'BANHO', 'SEDE', 'FOME', 'REMÉDIO', 'TROCAR', 'AJUDA', 'DESCANSAR'],
    'Sentimentos': ['FELIZ', 'TRISTE', 'CANSADO', 'DOR', 'BOM', 'RUIM', 'MEDO', 'CALOR', 'FRIO', 'NERVOSO', 'BRAVO', 'ANIMADO', 'ASSUSTADO'],
    'Pessoas': ['MAMÃE', 'PAPAI', 'VOVÓ', 'VOVÔ', 'IRMÃO', 'IRMÃ', 'AMIGO', 'PROFESSOR', 'MÉDICO', 'TIO', 'TIA', 'PRIMO', 'PRIMA'],
    'Lugares': ['CASA', 'ESCOLA', 'PARQUE', 'MÉDICO', 'LOJA', 'CARRO', 'QUARTO', 'COZINHA', 'SALA', 'RUA', 'PRAIA', 'HOSPITAL', 'BANHEIRO'],
    'Alimentos': ['PÃO', 'LEITE', 'SUCO', 'FRUTA', 'BOLACHA', 'CHOCOLATE', 'SORVETE', 'CARNE', 'ARROZ', 'FEIJÃO', 'MACARRÃO', 'PIZZA', 'BOLO'],
    'Adjetivos': ['GRANDE', 'PEQUENO', 'QUENTE', 'FRIO', 'BONITO', 'FEIO', 'NOVO', 'VELHO', 'LIMPO', 'SUJO', 'ALTO', 'BAIXO', 'FORTE', 'FRACO'],
    'Conectivos': ['COM', 'SEM', 'PARA', 'DE', 'EM', 'E', 'OU', 'MAS', 'PORQUE', 'QUANDO', 'ONDE', 'COMO', 'SE', 'ENTÃO']
  };
  
  // Frases comuns pré-definidas
  const commonPhrases = [
    'EU QUERO ÁGUA',
    'EU PRECISO IR AO BANHEIRO',
    'EU ESTOU COM FOME',
    'EU QUERO BRINCAR',
    'EU NÃO GOSTO DISSO',
    'EU ESTOU COM DOR',
    'EU QUERO DORMIR',
    'EU PRECISO DE AJUDA',
    'EU ESTOU FELIZ',
    'EU ESTOU CANSADO'
  ];
  
  // Manipular seleção de categoria
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    onSelectCategory(category);
  };
  
  // Obter palavras da categoria atual
  const getWordsToDisplay = () => {
    if (activeCategory === 'Todos') {
      // Retornar uma seleção de palavras de todas as categorias
      return Object.values(wordsByCategory).flat().slice(0, 50);
    }
    return wordsByCategory[activeCategory] || [];
  };

  return (
    <div className="space-y-4">
      {/* Categorias */}
      <div className="flex overflow-x-auto gap-2 pb-3">
        {categories.map((category) => (
          <button 
            key={category}
            onClick={() => handleCategorySelect(category)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap
              ${category === activeCategory 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Palavras da categoria selecionada */}
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {getWordsToDisplay().map((word) => (
          <div 
            key={word}
            className={`${currentTheme.cardBg} rounded-lg p-3 shadow-sm flex flex-col items-center cursor-pointer ${currentTheme.buttonHover} transition-colors`}
            onClick={() => onSelectWord(word)}
          >
            <div className="h-12 w-12 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-lg">
              {word.charAt(0)}
            </div>
            <span className={`text-xs font-bold ${currentTheme.textColor} text-center`}>{word}</span>
          </div>
        ))}
      </div>
      
      {/* Frases comuns */}
      <div className="mt-6">
        <h3 className={`text-md font-semibold ${currentTheme.textColor} mb-2`}>Frases comuns:</h3>
        <div className="flex flex-wrap gap-2">
          {commonPhrases.map((phrase) => (
            <Button 
              key={phrase}
              variant="outline"
              className="bg-green-50 hover:bg-green-100 text-green-800 px-3 py-1 h-auto text-sm"
              onClick={() => {
                // Passar a frase completa para o componente pai
                phrase.split(' ').forEach(word => {
                  onSelectWord(word);
                });
              }}
            >
              {phrase}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};