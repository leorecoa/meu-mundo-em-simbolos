import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlayCircle, Trash2, X, Sparkles, Volume2, ChevronLeft, Keyboard as KeyboardIcon, Grid3x3, Send, Copy, Share2, Award } from 'lucide-react'; // Adicionado Award
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Symbol as DbSymbol } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';

interface PhraseBuilderProps {
  onBack: () => void;
  initialSymbolId?: number;
}

// ... (outros sub-componentes permanecem os mesmos)
const SymbolDisplay = ({ symbol }: { symbol: DbSymbol }) => { /* ... */ return null; };
const PhraseDisplay = ({ phrase }: { phrase: DbSymbol[] }) => { /* ... */ return null; };
const ActionButtons = ({ onSpeak, onRemoveLast, onClear, onCopy, onShare }: { onSpeak: () => void; onRemoveLast: () => void; onClear: () => void; onCopy: () => void; onShare: () => void; }) => { /* ... */ return null; };
const VoiceSelector = ({ voices, selectedVoice, onVoiceChange }: { voices: SpeechSynthesisVoice[]; selectedVoice: string; onVoiceChange: (voiceName: string) => void; }) => { /* ... */ return null; };
const SymbolGrid = ({ onSymbolClick }: { onSymbolClick: (symbol: DbSymbol) => void }) => { /* ... */ return null; };
const NativeKeyboardInput = ({ onAddSymbol }: { onAddSymbol: (text: string) => void }) => { /* ... */ return null; };

type InputMode = 'symbols' | 'keyboard';

export const PhraseBuilder = ({ onBack, initialSymbolId }: PhraseBuilderProps) => {
  const { activeProfileId } = useProfile();
  const phraseStorageKey = `currentPhrase_${activeProfileId}`;

  const [currentPhrase, setCurrentPhrase] = useState<DbSymbol[]>(() => { /* ... */ return []; });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [inputMode, setInputMode] = useState<InputMode>('symbols');
  const { toast } = useToast();

  useEffect(() => { /* ... (efeito de salvar frase) */ }, [currentPhrase, phraseStorageKey]);
  useEffect(() => { /* ... (efeito de carregar vozes) */ }, []);
  useEffect(() => { /* ... (efeito de adicionar símbolo inicial) */ }, [initialSymbolId, activeProfileId]);

  const handleVoiceChange = useCallback((voiceName: string) => { /* ... */ }, []);
  const addSymbol = useCallback((symbolOrText: DbSymbol | string) => { /* ... */ }, [activeProfileId]);
  const removeLastSymbol = useCallback(() => { /* ... */ }, []);
  const clearPhrase = useCallback(() => { /* ... */ }, []);
  const getPhraseText = () => currentPhrase.map(s => s.text).join(' ');

  const handleSpeakAndReward = useCallback(async () => {
    const phraseText = getPhraseText();
    if (!phraseText) {
      toast({ title: "Frase vazia!", variant: "destructive" });
      return;
    }

    // 1. Falar a frase
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(phraseText);
    const voiceToUse = voices.find(v => v.name === selectedVoiceName);
    if (voiceToUse) utterance.voice = voiceToUse;
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);

    // 2. Lógica de Gamificação (executa em paralelo)
    (async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            let totalReward = 0;

            // Atualizar meta de frases
            const goalPhrases = await db.dailyGoals.get('goal_phrases');
            if (goalPhrases && !goalPhrases.completed) {
                const newCurrent = goalPhrases.current + 1;
                if (newCurrent >= goalPhrases.target) {
                    await db.dailyGoals.update('goal_phrases', { current: newCurrent, completed: true, lastUpdated: today });
                    totalReward += goalPhrases.reward;
                    toast({ title: 'Meta Cumprida!', description: `${goalPhrases.name} (+${goalPhrases.reward} moedas)` });
                } else {
                    await db.dailyGoals.update('goal_phrases', { current: newCurrent, lastUpdated: today });
                }
            }

            // Atualizar meta de símbolos
            const goalSymbols = await db.dailyGoals.get('goal_symbols');
            if (goalSymbols && !goalSymbols.completed) {
                const newCurrent = goalSymbols.current + currentPhrase.length;
                if (newCurrent >= goalSymbols.target) {
                    await db.dailyGoals.update('goal_symbols', { current: newCurrent, completed: true, lastUpdated: today });
                    totalReward += goalSymbols.reward;
                    toast({ title: 'Meta Cumprida!', description: `${goalSymbols.name} (+${goalSymbols.reward} moedas)` });
                } else {
                    await db.dailyGoals.update('goal_symbols', { current: newCurrent, lastUpdated: today });
                }
            }
            
            // Checar conquistas
            const achievements = await db.achievements.where('unlocked').equals(0).toArray();
            for (const ach of achievements) {
                if (ach.id === 'achievement_first_phrase') {
                    await db.achievements.update(ach.id, { unlocked: true });
                    totalReward += ach.reward;
                    toast({ title: 'Conquista Desbloqueada!', description: `${ach.name} (+${ach.reward} moedas)`, action: <Award/> });
                }
                // Adicionar lógica para outras conquistas aqui (ex: achievement_10_phrases)
            }

            // Adicionar moedas
            if (totalReward > 0) {
                await db.coins.where('id').equals(1).modify(c => { c.total += totalReward; });
            }

        } catch (error) {
            console.error("Erro no sistema de gamificação:", error);
        }
    })();

  }, [currentPhrase, voices, selectedVoiceName, toast]);

  const copyPhrase = useCallback(() => { /* ... */ }, [currentPhrase, toast]);
  const sharePhrase = useCallback(() => { /* ... */ }, [currentPhrase, toast]);
  const toggleInputMode = () => { setInputMode(prevMode => prevMode === 'symbols' ? 'keyboard' : 'symbols'); };

  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen font-sans"><header className="flex items-center justify-between mb-4"><Button variant="ghost" onClick={onBack} className="flex items-center gap-1"><ChevronLeft />Voltar</Button><h1 className="text-lg font-bold">Formador de Frases</h1><div className="w-24"></div></header><main><PhraseDisplay phrase={currentPhrase} /><ActionButtons onSpeak={handleSpeakAndReward} onRemoveLast={removeLastSymbol} onClear={clearPhrase} onCopy={copyPhrase} onShare={sharePhrase} /><VoiceSelector voices={voices} selectedVoice={selectedVoiceName} onVoiceChange={handleVoiceChange} /><div className="flex justify-center mb-4"><div className="inline-flex"><Button onClick={toggleInputMode} className={`px-3 py-2 text-sm ${inputMode === 'symbols' ? 'bg-sky-500' : 'bg-black/20'}`}><Grid3x3 className="mr-2" />Símbolos</Button><Button onClick={toggleInputMode} className={`px-3 py-2 text-sm ${inputMode === 'keyboard' ? 'bg-sky-500' : 'bg-black/20'}`}><KeyboardIcon className="mr-2" />Teclado</Button></div></div>{inputMode === 'symbols' ? <SymbolGrid onSymbolClick={addSymbol} /> : <NativeKeyboardInput onAddSymbol={addSymbol} />}</main></div>
  );
};
