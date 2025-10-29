// --- Imports e Tipos ---
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlayCircle, Trash2, X, Sparkles, Volume2, ChevronLeft } from 'lucide-react';

// A interface foi movida para fora do componente para melhor escopo.
interface Symbol {
  id: string;
  text: string;
}

// A props interface também foi movida para fora.
interface PhraseBuilderProps {
  onBack: () => void;
}

// A lista de símbolos de exemplo foi movida para fora para evitar recriação a cada render.
const exampleSymbols: Symbol[] = [
    { id: 'eu', text: 'Eu' }, { id: 'quero', text: 'quero' }, { id: 'gosto', text: 'gosto' },
    { id: 'comer', text: 'comer' }, { id: 'beber', text: 'beber' }, { id: 'brincar', text: 'brincar' },
    { id: 'ir', text: 'ir' }, { id: 'ao', text: 'ao' }, { id: 'banheiro', text: 'banheiro' },
    { id: 'sim', text: 'sim' }, { id: 'nao', text: 'não' }, { id: 'porfavor', text: 'por favor' },
    { id: 'obrigado', text: 'obrigado' }, { id: 'agua', text: 'água' }, { id: 'bola', text: 'bola' },
];

// --- Subcomponentes ---

// Subcomponente para exibir a frase atual
const PhraseDisplay = ({ phrase }: { phrase: Symbol[] }) => (
  <Card className="mb-4 min-h-[160px] shadow-lg bg-white flex items-center justify-center p-4">
    <CardContent className="w-full">
      {phrase.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {phrase.map((symbol, index) => (
            <div key={`${symbol.id}-${index}`} className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-95">
              <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center shadow-inner">
                <span className="text-2xl font-bold text-slate-700">{symbol.text}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-slate-400 p-6">
          <Sparkles className="mx-auto h-10 w-10 mb-2" />
          <p className="font-medium">Comece a montar sua frase</p>
        </div>
      )}
    </CardContent>
  </Card>
);

// Subcomponente para os botões de ação (Falar, Apagar, Limpar)
const ActionButtons = ({ onSpeak, onRemoveLast, onClear }: { onSpeak: () => void; onRemoveLast: () => void; onClear: () => void; }) => (
  <div className="grid grid-cols-4 gap-3 mb-6">
    <Button onClick={onSpeak} className="h-24 bg-green-500 hover:bg-green-600 text-white shadow-xl col-span-2 flex-col gap-1">
      <PlayCircle className="h-8 w-8" />
      <span className="text-lg font-bold">Falar</span>
    </Button>
    <Button onClick={onRemoveLast} variant="outline" className="h-24 bg-amber-400 hover:bg-amber-500 text-white shadow-lg flex-col gap-1">
      <X className="h-7 w-7" />
      <span className="text-md">Apagar</span>
    </Button>
    <Button onClick={onClear} variant="destructive" className="h-24 shadow-lg flex-col gap-1">
      <Trash2 className="h-7 w-7" />
      <span className="text-md">Limpar</span>
    </Button>
  </div>
);

// Subcomponente para o seletor de voz
const VoiceSelector = ({ voices, selectedVoice, onVoiceChange }: { voices: SpeechSynthesisVoice[]; selectedVoice: string; onVoiceChange: (voiceName: string) => void; }) => (
  <div className="mb-6">
    <label htmlFor="voice-selector" className="flex items-center gap-2 text-slate-600 font-medium mb-2">
      <Volume2 className="h-5 w-5" />
      Voz do Aplicativo
    </label>
    <select 
      id="voice-selector" 
      value={selectedVoice} 
      onChange={(e) => onVoiceChange(e.target.value)} 
      className="w-full p-3 border rounded-lg bg-white shadow-sm" 
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

// Subcomponente para a grade de símbolos
const SymbolGrid = ({ onSymbolClick }: { onSymbolClick: (symbol: Symbol) => void }) => (
  <Card className="shadow-lg bg-white">
    <CardContent className="p-4">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {exampleSymbols.map(symbol => (
          <Button key={symbol.id} onClick={() => onSymbolClick(symbol)} variant="outline" className="h-28 text-xl font-bold text-slate-800 shadow-sm hover:bg-blue-50">
            {symbol.text}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);


// --- Componente Principal Refatorado ---
export const PhraseBuilder = ({ onBack }: PhraseBuilderProps) => {
  const [currentPhrase, setCurrentPhrase] = useState<Symbol[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const { toast } = useToast();

  // Carregamento seguro das vozes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('pt'));
        setVoices(availableVoices);
        
        const preferredVoice = localStorage.getItem('selectedVoice');
        if (preferredVoice && availableVoices.some(v => v.name === preferredVoice)) {
          setSelectedVoiceName(preferredVoice);
        } else if (availableVoices.length > 0) {
          // Define a primeira voz como padrão se nenhuma preferência for encontrada
          const defaultVoice = availableVoices[0].name;
          setSelectedVoiceName(defaultVoice);
          localStorage.setItem('selectedVoice', defaultVoice);
        }
      };
      
      loadVoices(); // Carga inicial
      window.speechSynthesis.onvoiceschanged = loadVoices; // Carga quando a lista muda

      return () => { // Cleanup
        window.speechSynthesis.onvoiceschanged = null;
      };
    }
  }, []); // O array de dependência vazio está correto aqui.

  // Funções de manipulação foram memoizadas com useCallback.
  const handleVoiceChange = useCallback((voiceName: string) => {
    setSelectedVoiceName(voiceName);
    localStorage.setItem('selectedVoice', voiceName);
  }, []);

  const addSymbol = useCallback((symbol: Symbol) => {
    setCurrentPhrase(prev => [...prev, symbol]);
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
    window.speechSynthesis.cancel(); // Cancela falas anteriores
    
    const utterance = new SpeechSynthesisUtterance(phraseText);
    const voiceToUse = voices.find(v => v.name === selectedVoiceName);
    
    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }
    
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }, [currentPhrase, voices, selectedVoiceName, toast]);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans">
      <header className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1">
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className="text-xl font-bold">Formador de Frases</h1>
        <div className="w-24"></div> {/* Espaçador para centralizar o título */}
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

        <SymbolGrid onSymbolClick={addSymbol} />
      </main>
    </div>
  );
};
