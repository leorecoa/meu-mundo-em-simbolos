import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Volume2, Trash2, X, Mic } from 'lucide-react';
import { Symbol as DbSymbol, db } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { useToast } from '@/hooks/use-toast';
import { useSpeech } from '@/hooks/use-speech';

export const PhraseBuilder = ({ onBack }: { onBack: () => void }) => {
  const [currentPhrase, setCurrentPhrase] = useState<DbSymbol[]>([]);
  const [inputMode, setInputMode] = useState<'symbols' | 'keyboard'>('symbols');
  const { activeProfileId } = useProfile();
  const { toast } = useToast();
  const { speak, isSpeaking } = useSpeech();

  const symbols = useLiveQuery(
    () => activeProfileId ? db.symbols.where({ profileId: activeProfileId }).toArray() : [],
    [activeProfileId]
  );

  const addSymbol = useCallback(async (symbolOrText: DbSymbol | string) => {
    if (typeof symbolOrText === 'string') {
        if (!activeProfileId) return;
        const text = symbolOrText.trim();
        
        // 1. Verifica se o símbolo já existe
        let symbolToAdd = await db.symbols.where({ profileId: activeProfileId, text: text }).first();

        // 2. Se não existir, cria e salva
        if (!symbolToAdd) {
            const newSymbol: Omit<DbSymbol, 'id'> = {
                profileId: activeProfileId,
                text: text,
                categoryKey: 'geral', // Salva na categoria "Geral"
                order: Date.now(), // Ordem alta para aparecer no fim
            };
            const newId = await db.symbols.add(newSymbol as DbSymbol);
            symbolToAdd = { ...newSymbol, id: newId };
            toast({ title: 'Palavra Salva!', description: `"${text}" foi adicionado aos seus símbolos na categoria "Geral".` });
        }
        
        // 3. Adiciona à frase atual
        setCurrentPhrase(prev => [...prev, symbolToAdd!]);

    } else {
      setCurrentPhrase(prev => [...prev, symbolOrText]);
    }
  }, [activeProfileId, toast]);

  const removeSymbol = useCallback((index: number) => {
    setCurrentPhrase(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearPhrase = useCallback(() => {
    setCurrentPhrase([]);
  }, []);

  const speakPhrase = useCallback(async () => {
    const text = currentPhrase.map(s => s.text).join(' ');
    if (!text.trim()) {
      toast({ title: "Frase vazia!" });
      return;
    }
    await speak(text);
  }, [currentPhrase, toast, speak]);

  // ... (O resto do JSX do componente permanece o mesmo)
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
        {/* ... JSX ... */}
    </div>
  );
};
