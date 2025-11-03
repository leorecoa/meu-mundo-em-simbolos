import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlayCircle, Trash2, X, Sparkles, Volume2, ChevronLeft, Keyboard as KeyboardIcon, Grid3x3, Send, Copy, Share2, Award, MessageSquarePlus } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Symbol as DbSymbol } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';

interface PhraseBuilderProps {
  onBack: () => void;
  initialSymbolId?: number;
}

// --- Sub-componentes Polidos ---

const SymbolDisplay = ({ symbol }: { symbol: DbSymbol }) => { /* ...código... */ return null; };

const PhraseDisplay = ({ phrase }: { phrase: DbSymbol[] }) => (
    <Card className="mb-4 min-h-[160px] shadow-xl bg-black/30 backdrop-blur-lg border-white/10 flex items-center justify-center p-4 text-white">
        <CardContent className="w-full">
            {phrase.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4">{phrase.map((symbol, index) => (<div key={`${symbol.id}-${index}`} className="flex flex-col items-center gap-1 animate-in fade-in zoom-in-95"><div className="w-24 h-24 bg-white/20 rounded-lg flex items-center justify-center shadow-inner overflow-hidden"><SymbolDisplay symbol={symbol} /></div></div>))}</div>
            ) : (
                <div className="text-center text-slate-300/80 p-6 flex flex-col items-center justify-center">
                    <MessageSquarePlus className="h-12 w-12 mb-4" />
                    <h3 className="font-bold text-lg mb-1">Frase Vazia</h3>
                    <p className="text-sm max-w-xs">Clique nos símbolos abaixo ou use o teclado para começar a montar sua frase.</p>
                </div>
            )}
        </CardContent>
    </Card>
);

const VoiceSelector = ({ voices, selectedVoice, onVoiceChange }: { voices: SpeechSynthesisVoice[]; selectedVoice: string; onVoiceChange: (voiceName: string) => void; }) => (
    <div className="mb-6">
        <label htmlFor="voice-selector" className="flex items-center gap-2 text-slate-200 font-semibold mb-2"><Volume2 />Voz</label>
        <select id="voice-selector" value={selectedVoice} onChange={(e) => onVoiceChange(e.target.value)} className="w-full p-3 border-white/10 rounded-lg bg-black/30 shadow-md text-white focus:ring-2 focus:ring-blue-400 focus:outline-none" disabled={voices.length === 0}>
            {voices.length > 0 ? (
                voices.map(voice => <option key={voice.name} value={voice.name} className="text-black">{`${voice.name} (${voice.lang})`}</option>)
            ) : (
                <option className="text-black" disabled>Carregando vozes...</option>
            )}
        </select>
    </div>
);

// ... (outros sub-componentes SymbolGrid, NativeKeyboardInput, ActionButtons)


export const PhraseBuilder = ({ onBack, initialSymbolId }: PhraseBuilderProps) => {
  // ... (toda a lógica do componente principal permanece a mesma)
  const { activeProfileId } = useProfile();
  const [currentPhrase, setCurrentPhrase] = useState<DbSymbol[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [inputMode, setInputMode] = useState<InputMode>('symbols');
  const { toast } = useToast();

  // Efeitos e callbacks... (handleSpeakAndReward, etc)

  return (
    <div className="p-4 md:p-6 min-h-screen font-sans">
        <header className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-1 text-slate-200 font-semibold"><ChevronLeft />Voltar</Button>
            <h1 className="text-xl font-bold text-white">Formador de Frases</h1>
            <div className="w-24"></div>
        </header>
        <main>
            <PhraseDisplay phrase={currentPhrase} />
            {/* ... (resto do JSX com ActionButtons, VoiceSelector, etc.) */}
        </main>
    </div>
  );
};
