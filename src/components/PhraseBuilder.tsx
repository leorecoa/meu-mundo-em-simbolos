// --- Imports e Tipos ---
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlayCircle, Trash2, X, Sparkles, Volume2, ChevronLeft, Keyboard as KeyboardIcon, Grid3x3 } from 'lucide-react';
import { Keyboard } from './Keyboard';

interface Symbol {
  id: string;
  text: string;
}

interface PhraseBuilderProps {
  onBack: () => void;
}

const exampleSymbols: Symbol[] = [
    { id: 'eu', text: 'Eu' }, { id: 'quero', text: 'quero' }, { id: 'gosto', text: 'gosto' },
    { id: 'comer', text: 'comer' }, { id: 'beber', text: 'beber' }, { id: 'brincar', text: 'brincar' },
    { id: 'ir', text: 'ir' }, { id: 'ao', text: 'ao' }, { id: 'banheiro', text: 'banheiro' },
    { id: 'sim', text: 'sim' }, { id: 'nao', text: 'não' }, { id: 'porfavor', text: 'por favor' },
    { id: 'obrigado', text: 'obrigado' }, { id: 'agua', text: 'água' }, { id: 'bola', text: 'bola' },
];

// --- Subcomponentes Responsivos ---

const PhraseDisplay = ({ phrase }: { phrase: Symbol[] }) => (
  // Altura mínima e padding responsivos
  <Card className="mb-4 min-h-[120px] sm:min-h-[160px] shadow-lg bg-white flex items-center justify-center p-2 sm:p-4">
    <CardContent className="w-full">
      {phrase.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {phrase.map((symbol, index) => (
            <div key={`${symbol.id}-${index}`} className="flex flex-col items-center gap-1 animate-in fade-in zoom-in-95">
              {/* Tamanho e fonte do símbolo responsivos */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-lg flex items-center justify-center shadow-inner">
                <span className="text-xl sm:text-2xl font-bold text-slate-700 text-center px-1">{symbol.text}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-400 p-6">
          <Sparkles className="mx-auto h-8 w-8 sm:h-10 sm:w-10 mb-2" />
          <p className="font-medium text-sm sm:text-base">Comece a montar sua frase</p>
        </div>
      )}
    </CardContent>
  </Card>
);

const ActionButtons = ({ onSpeak, onRemoveLast, onClear }: { onSpeak: () => void; onRemoveLast: () => void; onClear: () => void; }) => (
  // Altura e fonte dos botões responsivas
  <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
    <Button onClick={onSpeak} className="h-20 sm:h-24 bg-green-500 hover:bg-green-600 text-white shadow-xl col-span-2 flex-col gap-1">
      <PlayCircle className="h-7 w-7 sm:h-8 sm:w-8" />
      <span className="text-base sm:text-lg font-bold">Falar</span>
    </Button>
    <Button onClick={onRemoveLast} variant="outline" className="h-20 sm:h-24 bg-amber-400 hover:bg-amber-500 text-white shadow-lg flex-col gap-1">
      <X className="h-6 w-6 sm:h-7 sm:w-7" />
      <span className="text-sm sm:text-md">Apagar</span>
    </Button>
    <Button onClick={onClear} variant="destructive" className="h-20 sm:h-24 shadow-lg flex-col gap-1">
      <Trash2 className="h-6 w-6 sm:h-7 sm:w-7" />
      <span className="text-sm sm:text-md">Limpar</span>
    </Button>
  </div>
);

const VoiceSelector = ({ voices, selectedVoice, onVoiceChange }: { voices: SpeechSynthesisVoice[]; selectedVoice: string; onVoiceChange: (voiceName: string) => void; }) => (
  <div className="mb-4 sm:mb-6">
    <label htmlFor="voice-selector" className="flex items-center gap-2 text-slate-600 font-medium mb-2 text-sm sm:text-base">
      <Volume2 className="h-5 w-5" />
      Voz do Aplicativo
    </label>
    <select 
      id="voice-selector" 
      value={selectedVoice} 
      onChange={(e) => onVoiceChange(e.target.value)} 
      className="w-full p-2 sm:p-3 border rounded-lg bg-white shadow-sm text-sm sm:text-base" 
      disabled={voices.length === 0}
    >
      {voices.length > 0 ? (
        voices.map(voice => <option key={voice.name} value={voice.name}>{`${voice.name} (${voice.lang})`}</option>)
      ) : (
        <option>Carregando vozes...</option>
      )}
    </select>
    <p className="text-xs text-gray-500 mt-2">A lista de vozes depende das instaladas no seu dispositivo.</p>
  </div>
);

const SymbolGrid = ({ onSymbolClick }: { onSymbolClick: (symbol: Symbol) => void }) => (
  <Card className="shadow-lg bg-white">
    <CardContent className="p-2 sm:p-4">
      {/* Grid e botões responsivos */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
        {exampleSymbols.map(symbol => (
          <Button key={symbol.id} onClick={() => onSymbolClick(symbol)} variant="outline" className="h-24 sm:h-28 text-lg sm:text-xl font-bold text-slate-800 shadow-sm hover:bg-blue-50">
            {symbol.text}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);


type InputMode = 'symbols' | 'keyboard';

export const PhraseBuilder = ({ onBack }: PhraseBuilderProps) => {
  const [currentPhrase, setCurrentPhrase] = useState<Symbol[]>([]);
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

  const addSymbol = useCallback((symbolOrText: Symbol | string) => {
    if (typeof symbolOrText === 'string') {
      const newSymbol: Symbol = { id: `custom-${Date.now()}`, text: symbolOrText };
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
    <div className="p-2 sm:p-4 md:p-6 bg-slate-50 min-h-screen font-sans">
      <header className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1 text-sm sm:text-base">
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className="text-lg sm:text-xl font-bold">Formador de Frases</h1>
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
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-l-md ${inputMode === 'symbols' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
            >
              <Grid3x3 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Símbolos
            </Button>
            <Button 
              onClick={toggleInputMode} 
              className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-r-md ${inputMode === 'keyboard' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}
            >
              <KeyboardIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Teclado
            </Button>
          </div>
        </div>

        {inputMode === 'symbols' ? (
          <SymbolGrid onSymbolClick={addSymbol} />
        ) : (
          <Keyboard onAddCustomSymbol={addSymbol} />
        )}
      </main>
    </div>
  );
};
