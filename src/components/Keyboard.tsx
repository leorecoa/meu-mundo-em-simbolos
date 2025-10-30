import { useState, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Send, Delete, CornerDownLeft, ArrowUp, X } from 'lucide-react';

interface KeyboardProps {
  onAddCustomSymbol: (text: string) => void;
}

// --- Layouts de Teclado Definidos (sem alteração) ---
type KeyboardMode = 'alpha' | 'numeric';

const alphaLower = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];
const alphaUpper = alphaLower.map(row => row.map(key => key.toUpperCase()));
const numeric = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
  ['.', ',', '?', '!', "'"],
];

// --- Subcomponente de Tecla com Classes Responsivas ---
const Key = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick: () => void; className?: string }) => (
  // Ajustes de altura (h-10 sm:h-12) e fonte (text-md sm:text-lg)
  <Button onClick={onClick} variant="outline" className={`h-10 sm:h-12 text-md sm:text-lg font-bold text-slate-700 shadow-sm transition-all duration-150 active:bg-slate-200 ${className}`}>
    {children}
  </Button>
);

// --- Componente Principal do Teclado ---
export const Keyboard = ({ onAddCustomSymbol }: KeyboardProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isShifted, setIsShifted] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState<KeyboardMode>('alpha');

  const handleKeyPress = useCallback((key: string) => {
    setInputValue(prev => prev + key);
    if (isShifted) {
      setIsShifted(false);
    }
  }, [isShifted]);

  const handleBackspace = useCallback(() => {
    setInputValue(prev => prev.slice(0, -1));
  }, []);

  const handleSpace = useCallback(() => {
    setInputValue(prev => prev + ' ');
  }, []);

  const handleAddWord = useCallback(() => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput) {
      onAddCustomSymbol(trimmedInput);
      setInputValue('');
    }
  }, [inputValue, onAddCustomSymbol]);

  const toggleShift = useCallback(() => {
    setIsShifted(prev => !prev);
  }, []);

  const toggleKeyboardMode = useCallback(() => {
    setKeyboardMode(prev => (prev === 'alpha' ? 'numeric' : 'alpha'));
    setIsShifted(false);
  }, []);
  
  const renderKeys = () => {
    const layout = keyboardMode === 'alpha' ? (isShifted ? alphaUpper : alphaLower) : numeric;
    return layout.map((row, rowIndex) => (
      // Ajuste de espaçamento (gap-1 sm:gap-1.5)
      <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
        {row.map(key => (
          <Key key={key} onClick={() => handleKeyPress(key)} className="flex-1 uppercase">{key}</Key>
        ))}
      </div>
    ));
  };

  return (
    // Ajuste de padding (p-2 sm:p-4)
    <Card className="shadow-lg bg-white select-none">
      <CardContent className="p-2 sm:p-4">
        {/* Display Aprimorado com ajuste de altura e fonte */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-grow">
            <input 
              type="text" 
              readOnly 
              value={inputValue}
              placeholder="Digite aqui..."
              // Ajustes de altura (h-10 sm:h-12) e fonte (text-md sm:text-lg)
              className="w-full h-10 sm:h-12 text-md sm:text-lg font-medium bg-slate-100 rounded-lg px-3 shadow-inner text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {inputValue && (
              <Button onClick={() => setInputValue('')} variant="ghost" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8">
                <X className="h-5 w-5 text-slate-500" />
              </Button>
            )}
          </div>
          <Button onClick={handleAddWord} className="h-10 sm:h-12 bg-green-500 hover:bg-green-600 text-white shadow-lg" aria-label="Adicionar Palavra">
            <Send className="h-6 w-6" />
          </Button>
        </div>

        {/* Teclado Virtual Dinâmico com ajuste de espaçamento */}
        <div className="flex flex-col gap-1 sm:gap-1.5">
          {renderKeys()}
          <div className="flex justify-center gap-1 sm:gap-1.5">
            {keyboardMode === 'alpha' ? (
              <Key onClick={toggleShift} className={`flex-[1.5] ${isShifted ? 'bg-blue-500 text-white' : ''}`}>
                <ArrowUp className="h-5 sm:h-6 w-5 sm:w-6" />
              </Key>
            ) : <div className="flex-[1.5]"></div> /* Espaçador */}
            <Key onClick={toggleKeyboardMode} className="flex-1 text-xs sm:text-sm">{keyboardMode === 'alpha' ? '?123' : 'ABC'}</Key>
            <Key onClick={handleSpace} className="flex-[4]"><span className="font-normal text-sm">Espaço</span></Key>
            <Key onClick={handleBackspace} className="flex-1"><Delete className="h-5 sm:h-6 w-5 sm:w-6 mx-auto" /></Key>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};