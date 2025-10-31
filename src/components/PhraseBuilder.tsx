// --- Imports e Tipos ---
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlayCircle, Trash2, X, Sparkles, Volume2, ChevronLeft, Keyboard as KeyboardIcon, Grid3x3, Send } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Symbol as DbSymbol, Category as DbCategory } from '@/lib/db';

interface PhraseBuilderProps {
  onBack: () => void;
}

// --- Subcomponentes com Visual Corrigido ---

const PhraseDisplay = ({ phrase }: { phrase: DbSymbol[] }) => (
  // Removido o backdrop-blur e ajustada a opacidade do fundo
  <Card className="mb-4 min-h-[120px] sm:min-h-[160px] shadow-xl bg-black/30 border-white/10 flex items-center justify-center p-2 sm:p-4 text-white">
    <CardContent className="w-full">
      {phrase.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {phrase.map((symbol, index) => (
            <div key={`${symbol.id}-${index}`} className="flex flex-col items-center gap-1 animate-in fade-in zoom-in-95">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/20 rounded-lg flex items-center justify-center shadow-inner">
                <span className="text-xl sm:text-2xl font-bold text-center px-1">{symbol.text}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-300/80 p-6">
          <Sparkles className="mx-auto h-8 w-8 sm:h-10 sm:w-10 mb-2" />
          <p className="font-medium text-sm sm:text-base">Comece a montar sua frase</p>
        </div>
      )}
    </CardContent>
  </Card>
);

const ActionButtons = ({ onSpeak, onRemoveLast, onClear }: { onSpeak: () => void; onRemoveLast: () => void; onClear: () => void; }) => (
  <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
    <Button onClick={onSpeak} className="h-20 sm:h-24 text-white shadow-xl col-span-2 flex-col gap-1 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-none">
      <PlayCircle className="h-7 w-7 sm:h-8 sm:w-8" />
      <span className="text-base sm:text-lg font-bold">Falar</span>
    </Button>
    <Button onClick={onRemoveLast} variant="outline" className="h-20 sm:h-24 text-white shadow-lg flex-col gap-1 bg-gradient-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 border-none">
      <X className="h-6 w-6 sm:h-7 sm:w-7" />
      <span className="text-sm sm:text-md">Apagar</span>
    </Button>
    <Button onClick={onClear} variant="destructive" className="h-20 sm:h-24 shadow-lg flex-col gap-1 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-none">
      <Trash2 className="h-6 w-6 sm:h-7 sm:w-7" />
      <span className="text-sm sm:text-md">Limpar</span>
    </Button>
  </div>
);

const VoiceSelector = ({ voices, selectedVoice, onVoiceChange }: { voices: SpeechSynthesisVoice[]; selectedVoice: string; onVoiceChange: (voiceName: string) => void; }) => (
  <div className="mb-4 sm:mb-6">
    <label htmlFor="voice-selector" className="flex items-center gap-2 text-slate-200 font-semibold mb-2 text-sm sm:text-base">
      <Volume2 className="h-5 w-5" />
      Voz do Aplicativo
    </label>
    <select 
      id="voice-selector" 
      value={selectedVoice} 
      onChange={(e) => onVoiceChange(e.target.value)} 
      // Removido o backdrop-blur
      className="w-full p-2 sm:p-3 border-white/10 rounded-lg bg-black/30 shadow-md text-white text-sm sm:text-base focus:ring-2 focus:ring-blue-400 focus:outline-none" 
      disabled={voices.length === 0}
    >
      {voices.length > 0 ? (
        voices.map(voice => <option key={voice.name} value={voice.name} className="text-black">{`${voice.name} (${voice.lang})`}</option>)
      ) : (
        <option className="text-black">Carregando vozes...</option>
      )}
    </select>
    <p className="text-xs text-slate-400 mt-2">A lista de vozes depende das instaladas no seu dispositivo.</p>
  </div>
);

const colorMap: { [key: string]: { bg: string, text: string, hover: string } } = {
  rose: { bg: 'bg-rose-500/80', text: 'text-white', hover: 'hover:bg-rose-600/90' },
  amber: { bg: 'bg-amber-500/80', text: 'text-white', hover: 'hover:bg-amber-600/90' },
  sky: { bg: 'bg-sky-500/80', text: 'text-white', hover: 'hover:bg-sky-600/90' },
  slate: { bg: 'bg-slate-500/80', text: 'text-white', hover: 'hover:bg-slate-600/90' },
  default: { bg: 'bg-white/70', text: 'text-slate-800', hover: 'hover:bg-white/90' },
};

const SymbolGrid = ({ onSymbolClick }: { onSymbolClick: (symbol: DbSymbol) => void }) => {
  const data = useLiveQuery(async () => {
    const symbols = await db.symbols.toArray();
    const categories = await db.categories.toArray();
    const categoryColorMap = new Map(categories.map(cat => [cat.key, cat.color]));
    return { symbols, categoryColorMap };
  }, []);

  const filteredSymbols = data?.symbols.filter(s => s.categoryKey !== 'geral');

  const getSymbolColor = (categoryKey: string) => {
    const colorName = data?.categoryColorMap.get(categoryKey) || 'default';
    return colorMap[colorName] || colorMap.default;
  };

  return (
    // Removido o backdrop-blur
    <Card className="shadow-xl bg-black/30 border-white/10">
      <CardContent className="p-2 sm:p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
          {filteredSymbols?.map(symbol => {
            const colors = getSymbolColor(symbol.categoryKey);
            return (
              <Button 
                key={symbol.id} 
                onClick={() => onSymbolClick(symbol)} 
                variant="outline" 
                className={`h-24 sm:h-28 text-lg sm:text-xl font-bold shadow-lg border-none transition-transform hover:scale-105 ${colors.bg} ${colors.text} ${colors.hover}`}
              >
                {symbol.text}
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
};

const NativeKeyboardInput = ({ onAddSymbol }: { onAddSymbol: (text: string) => void }) => {
  const [text, setText] = useState('');

  const handleAdd = () => {
    const trimmedText = text.trim();
    if (trimmedText) {
      onAddSymbol(trimmedText);
      setText('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    // Removido o backdrop-blur
    <Card className="shadow-xl bg-black/30 border-white/10">
      <CardContent className="p-4 flex items-center gap-2">
        <input 
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite aqui e adicione à frase..."
          className="w-full h-12 text-lg font-medium bg-slate-100/80 rounded-lg px-4 shadow-inner text-slate-800 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
        <Button onClick={handleAdd} className="h-12 bg-green-500 hover:bg-green-600 text-white shadow-lg" aria-label="Adicionar Palavra">
          <Send className="h-6 w-6" />
        </Button>
      </CardContent>
    </Card>
  );
};

type InputMode = 'symbols' | 'keyboard';

export const PhraseBuilder = ({ onBack }: PhraseBuilderProps) => {
  const [currentPhrase, setCurrentPhrase] = useState<DbSymbol[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [inputMode, setInputMode] = useState<InputMode>('symbols');
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('pt'));
        setVoices(availableVoices);
        
        const preferredVoice = localStorage.getItem('selectedVoice');
        if (preferredVoice && availableVoices.some(v => v.name === preferredVoice)) {
          setSelectedVoiceName(preferredVoice);
        } else if (availableVoices.length > 0) {
          const googleVoice = availableVoices.find(v => v.name.includes('Google'));
          const microsoftVoice = availableVoices.find(v => v.name.includes('Microsoft'));
          
          let bestDefaultVoice = availableVoices[0];
          if (googleVoice) {
            bestDefaultVoice = googleVoice;
          } else if (microsoftVoice) {
            bestDefaultVoice = microsoftVoice;
          }

          setSelectedVoiceName(bestDefaultVoice.name);
          localStorage.setItem('selectedVoice', bestDefaultVoice.name);
        }
      };
      
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []);

  const handleVoiceChange = useCallback((voiceName: string) => {
    setSelectedVoiceName(voiceName);
    localStorage.setItem('selectedVoice', voiceName);
  }, []);

  const addSymbol = useCallback((symbolOrText: DbSymbol | string) => {
    if (typeof symbolOrText === 'string') {
      const newSymbol: DbSymbol = { id: Date.now(), text: symbolOrText, categoryKey: 'custom' };
      setCurrentPhrase(prev => [...prev, newSymbol]);
    } else {
      setCurrentPhrase(prev => [...prev, symbolOrText]);
    }
  }, []);

  const removeLastSymbol = useCallback(() => {
    setCurrentPhrase(prev => prev.slice(0, -1));
  }, []);

  const clearPhrase = useCallback(() => {
    setCurrentPhrase([]);
  }, []);

  const speakPhrase = useCallback(() => {
    if (currentPhrase.length === 0) {
      toast({ title: "Frase vazia!", description: "Adicione símbolos para formar uma frase.", variant: "destructive" });
      return;
    }
    const phraseText = currentPhrase.map(s => s.text).join(' ');
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(phraseText);
    const voiceToUse = voices.find(v => v.name === selectedVoiceName);
    
    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }
    
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    
    window.speechSynthesis.speak(utterance);
  }, [currentPhrase, voices, selectedVoiceName, toast]);

  const toggleInputMode = () => {
    setInputMode(prevMode => prevMode === 'symbols' ? 'keyboard' : 'symbols');
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen font-sans">
      <header className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1 text-sm sm:text-base text-slate-200 font-semibold">
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className="text-lg sm:text-xl font-bold text-white">Formador de Frases</h1>
        <div className="w-16 sm:w-24"></div>
      </header>

      <main>
        <PhraseDisplay phrase={currentPhrase} />
        
        <ActionButtons 
          onSpeak={speakPhrase}
          onRemoveLast={removeLastSymbol}
          onClear={clearPhrase}
        />
        
        <VoiceSelector 
          voices={voices}
          selectedVoice={selectedVoiceName}
          onVoiceChange={handleVoiceChange}
        />

        <div className="flex justify-center mb-4">
          <div className="inline-flex rounded-md shadow-sm">
            <Button 
              onClick={toggleInputMode} 
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-l-md transition-colors ${inputMode === 'symbols' ? 'bg-sky-500 text-white' : 'bg-black/20 text-slate-200'}`}>
              <Grid3x3 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Símbolos
            </Button>
            <Button 
              onClick={toggleInputMode} 
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-r-md transition-colors ${inputMode === 'keyboard' ? 'bg-sky-500 text-white' : 'bg-black/20 text-slate-200'}`}>
              <KeyboardIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Teclado
            </Button>
          </div>
        </div>

        {inputMode === 'symbols' ? (
          <SymbolGrid onSymbolClick={addSymbol} />
        ) : (
          <NativeKeyboardInput onAddSymbol={addSymbol} />
        )}
      </main>
    </div>
  );
};
