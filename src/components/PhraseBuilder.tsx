import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, savePhrase, getPhrases } from '@/lib/storage';
import type { Phrase, UserSettings } from '@/db';
// ... outros imports ...

// ... interfaces ...

export const PhraseBuilder = ({ onBack }: { onBack: () => void; }) => {
  const [currentPhrase, setCurrentPhrase] = useState<CurrentSymbol[]>([]);
  const [isSpeechReady, setIsSpeechReady] = useState(false);
  const { data: settings } = useQuery<UserSettings | undefined>({ queryKey: ['settings'], queryFn: getSettings });

  // Efeito para verificar a API de voz de forma segura
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const checkVoices = () => {
        if (window.speechSynthesis.getVoices().length > 0) {
          setIsSpeechReady(true);
          // Remove o listener uma vez que as vozes estão prontas
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
      checkVoices();
      if (!isSpeechReady) {
        window.speechSynthesis.onvoiceschanged = checkVoices;
      }
    }
  }, [isSpeechReady]);


  const handlePlayText = (text: string) => {
    // Só tenta falar se a API estiver pronta
    if (!isSpeechReady || !text) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    if (settings?.voiceType) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => voice.name === settings.voiceType);
      if (selectedVoice) utterance.voice = selectedVoice;
    }
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayCurrentPhrase = () => {
    const phraseText = currentPhrase.map(symbol => symbol.text).join(' ');
    handlePlayText(phraseText);
  };
  
  // ... (outras funções e JSX) ...
};
