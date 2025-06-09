import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Backspace, ArrowUp, Check } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface LetterKeyboardProps {
  onLetterSelect: (letter: string) => void;
  onWordSelect: (word: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
}

export const LetterKeyboard = ({ 
  onLetterSelect, 
  onWordSelect,
  onBackspace, 
  onSubmit 
}: LetterKeyboardProps) => {
  const { currentTheme } = useTheme();
  const [isUppercase, setIsUppercase] = useState(true);
  
  // Definir layouts de teclado
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ç'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '?']
  ];
  
  // Palavras sugeridas com base no contexto
  const suggestedWords = [
    'EU', 'QUERO', 'PRECISO', 'ESTOU', 'VOU', 'GOSTO', 
    'ÁGUA', 'COMIDA', 'BANHEIRO', 'BRINCAR', 'DORMIR',
    'AJUDA', 'CASA', 'ESCOLA', 'MÉDICO', 'PARQUE'
  ];
  
  const handleLetterClick = (letter: string) => {
    onLetterSelect(isUppercase ? letter : letter.toLowerCase());
  };
  
  const toggleCase = () => {
    setIsUppercase(!isUppercase);
  };

  return (
    <div className="w-full">
      {/* Sugestões de palavras */}
      <div className="mb-3 flex overflow-x-auto pb-2 gap-2">
        {suggestedWords.map((word) => (
          <Button
            key={word}
            variant="outline"
            className={`${currentTheme.buttonBg} whitespace-nowrap text-sm py-1 h-auto`}
            onClick={() => onWordSelect(word)}
          >
            {word}
          </Button>
        ))}
      </div>
      
      {/* Teclado */}
      <div className="space-y-1">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key) => (
              <Button
                key={key}
                variant="outline"
                className={`${currentTheme.buttonBg} w-8 h-10 p-0 sm:w-10`}
                onClick={() => handleLetterClick(key)}
              >
                {isUppercase ? key : key.toLowerCase()}
              </Button>
            ))}
          </div>
        ))}
        
        {/* Última linha com teclas especiais */}
        <div className="flex justify-center gap-1">
          <Button
            variant="outline"
            className={`${currentTheme.buttonBg} px-3`}
            onClick={toggleCase}
          >
            <ArrowUp className={`h-4 w-4 ${isUppercase ? 'text-blue-600' : 'text-gray-400'}`} />
          </Button>
          
          <Button
            variant="outline"
            className={`${currentTheme.buttonBg} flex-1`}
            onClick={() => handleLetterClick(' ')}
          >
            Espaço
          </Button>
          
          <Button
            variant="outline"
            className={`${currentTheme.buttonBg} px-3`}
            onClick={onBackspace}
          >
            <Backspace className="h-4 w-4" />
          </Button>
          
          <Button
            className="bg-green-100 hover:bg-green-200 text-green-800 px-3"
            onClick={onSubmit}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};