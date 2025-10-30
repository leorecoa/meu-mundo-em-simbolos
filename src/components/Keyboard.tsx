import { useState, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Send, Delete, CornerDownLeft, ArrowUp, X } from 'lucide-react';

interface KeyboardProps {
  onAddCustomSymbol: (text: string) => void;
}

// --- Layouts de Teclado Definidos ---
type KeyboardMode = 'alpha' | 'symbols';
type SymbolMode = 'numeric' | 'accents'; // Sub-modo para o teclado de símbolos

const alphaLower = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];
const alphaUpper = alphaLower.map(row => row.map(key => key.toUpperCase()));

// Layouts para o modo de símbolos
const numericLayout = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
  ['.', ',', '?', '!', "'"],
];

const accentLayout = [
  ['á', 'é', 'í', 'ó', 'ú', 'à', 'è', 'ì', 'ò', 'ù'],
  ['â', 'ê', 'î', 'ô', 'û', 'ã', 'õ', 'ñ', 'ü', 'ç'],
  ['Á', 'É', 'Í', 'Ó', 'Ú'],
];

// --- Subcomponente de Tecla Reutilizável ---
const Key = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick: () => void; className?: string }) => (
  <Button onClick={onClick} variant="outline" className={`h-10 sm:h-12 text-md sm:text-lg font-bold text-slate-700 shadow-sm transition-all duration-150 active:bg-slate-200 ${className}`}>
    {children}
  </Button>
);

// --- Componente Principal do Teclado ---
export const Keyboard = ({ onAddCustomSymbol }: KeyboardProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isShifted, setIsShifted] = useState(false);
  const [keyboardMode, setKeyboardMode] = useState<KeyboardMode>('alpha');
  const [symbolMode, setSymbolMode] = useState<SymbolMode>('numeric'); // Estado para o sub-modo

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
    setKeyboardMode(prev => (prev === 'alpha' ? 'symbols' : 'alpha'));
    setIsShifted(false);
  }, []);
  
  const toggleSymbolMode = useCallback(() => {
    setSymbolMode(prev => (prev === 'numeric' ? 'accents' : 'numeric'));
  }, []);

  const renderKeys = () => {
    let layout;
    if (keyboardMode === 'alpha') {
      layout = isShifted ? alphaUpper : alphaLower;
    } else {
      layout = symbolMode === 'numeric' ? numericLayout : accentLayout;
    }

    return layout.map((row, rowIndex) => (
      <div key={rowIndex} className="flex justify-center gap-1 sm:gap-1.5">
        {row.map(key => (
          <Key key={key} onClick={() => handleKeyPress(key)} className="flex-1 uppercase">{key}</Key>
        ))}
      </div>
    ));
  };

  return (
    <Card className="shadow-xl bg-white/60 backdrop-blur-sm border-white/20 select-none">
      <CardContent className="p-2 sm:p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-grow">
            <input 
              type="text" 
              readOnly 
              value={inputValue}
              placeholder="Digite aqui..."
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

        <div className="flex flex-col gap-1 sm:gap-1.5">
          {renderKeys()}
          {/* Controles do teclado */}
          <div className="flex justify-center gap-1 sm:gap-1.5">
            {keyboardMode === 'alpha' ? (
              <>
                <Key onClick={toggleShift} className={`flex-[1.5] ${isShifted ? 'bg-blue-500 text-white' : ''}`}>
                  <ArrowUp className="h-5 sm:h-6 w-5 sm:w-6 mx-auto" />
                </Key>
                <Key onClick={toggleKeyboardMode} className="flex-1">{"?123"}</Key>
              </>
            ) : (
              <>
                <Key onClick={toggleKeyboardMode} className="flex-[1.5]">{"ABC"}</Key>
                <Key onClick={toggleSymbolMode} className="flex-1">{symbolMode === 'numeric' ? 'áéí' : '#+='}</Key>
              </>
            )}
            <Key onClick={handleSpace} className="flex-[4]"><span className="font-normal text-sm">Espaço</span></Key>
            <Key onClick={handleBackspace} className="flex-1"><Delete className="h-5 sm:h-6 w-5 sm:w-6 mx-auto" /></Key>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};