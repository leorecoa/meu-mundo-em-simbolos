import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import * as htmlToImage from 'html-to-image';
import type { Symbol as DbSymbol } from '@/lib/db';

export const usePhraseActions = (initialPhrase: DbSymbol[] = []) => {
  const [currentPhrase, setCurrentPhrase] = useState<DbSymbol[]>(initialPhrase);
  const { toast } = useToast();
  const phraseDisplayRef = useRef<HTMLDivElement>(null);

  const addSymbol = useCallback((symbol: DbSymbol) => {
    setCurrentPhrase(prev => [...prev, symbol]);
  }, []);

  const removeLastSymbol = useCallback(() => {
    setCurrentPhrase(prev => prev.slice(0, -1));
  }, []);

  const clearPhrase = useCallback(() => {
    setCurrentPhrase([]);
  }, []);

  const getPhraseText = useCallback(() => currentPhrase.map(s => s.text).join(' '), [currentPhrase]);

  const speakPhrase = useCallback(() => {
    const phraseText = getPhraseText();
    if (!phraseText) return;
    // ... (lógica de TTS)
    const utterance = new SpeechSynthesisUtterance(phraseText);
    window.speechSynthesis.speak(utterance);
  }, [getPhraseText]);

  const exportPhrase = useCallback(() => {
    if (phraseDisplayRef.current === null) return;
    htmlToImage.toPng(phraseDisplayRef.current)
      .then(dataUrl => {
        const link = document.createElement('a');
        link.download = 'frase.png';
        link.href = dataUrl;
        link.click();
      })
      .catch(err => toast({ title: 'Erro ao exportar', variant: 'destructive' }));
  }, [phraseDisplayRef, toast]);

  return {
    currentPhrase,
    addSymbol,
    removeLastSymbol,
    clearPhrase,
    speakPhrase,
    exportPhrase,
    phraseDisplayRef,
    getPhraseText
  };
};
