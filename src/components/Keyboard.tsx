import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Send, Delete, CornerDownLeft } from 'lucide-react';

interface KeyboardProps {
  onAddCustomSymbol: (text: string) => void;
}

// Layout do teclado QWERTY em português
const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export const Keyboard = ({ onAddCustomSymbol }: KeyboardProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (key: string) => {
    setInputValue(prev => prev + key);
  };

  const handleBackspace = () => {
    setInputValue(prev => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setInputValue(prev => prev + ' ');
  };

  const handleAddWord = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput) {
      onAddCustomSymbol(trimmedInput);
      setInputValue(''); // Limpa o input após adicionar
    }
  };

  return (
    <Card className="shadow-lg bg-white">
      <CardContent className="p-4">
        {/* Display e Botão de Adicionar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-grow h-12 text-lg font-medium bg-slate-100 rounded-lg flex items-center px-4 shadow-inner">
            {inputValue || <span className="text-slate-400">Digite aqui...</span>}
            <span className="border-l-2 border-slate-700 animate-pulse h-6 w-0 ml-1"></span>
          </div>
          <Button onClick={handleAddWord} className="h-12 bg-green-500 hover:bg-green-600 text-white shadow-lg" aria-label="Adicionar Palavra">
            <Send className="h-6 w-6" />
          </Button>
        </div>

        {/* Teclado Virtual */}
        <div className="flex flex-col gap-2">
          {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-2">
              {row.map(key => (
                <Button 
                  key={key} 
                  onClick={() => handleKeyPress(key)} 
                  variant="outline"
                  className="flex-1 h-12 text-lg font-bold text-slate-700 shadow-sm uppercase"
                >
                  {key}
                </Button>
              ))}
            </div>
          ))}
          {/* Última fileira com Espaço e Apagar */}
          <div className="flex justify-center gap-2">
            <Button onClick={handleSpace} variant="outline" className="flex-[4] h-12 shadow-sm">
              <CornerDownLeft className="h-6 w-6" />
              <span className="ml-2 font-bold">Espaço</span>
            </Button>
            <Button onClick={handleBackspace} variant="outline" className="flex-1 h-12 shadow-sm">
              <Delete className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};