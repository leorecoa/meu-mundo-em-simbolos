import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSettings, savePhrase, getPhrases, toggleFavoritePhrase } from '@/lib/storage';
import type { Phrase, UserSettings } from '@/db';
// ... (outros imports) ...

// ... (interfaces e hooks) ...

export const PhraseBuilder = ({ onBack }: { onBack: () => void; }) => {
  // ... (estados e hooks) ...
  const { data: settings } = useQuery<UserSettings | undefined>({ queryKey: ['settings'], queryFn: getSettings });

  const handlePlayText = (text: string) => {
    if (!text || !('speechSynthesis' in window)) return;

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

  return (
    <div /* ... */ >
      {/* ... (JSX do header e card da frase atual) ... */}

      <div className="grid grid-cols-4 gap-3">
        <Button onClick={handlePlayCurrentPhrase} /* ... */ >
          {/* ... */}
        </Button>
        {/* ... (outros botões de ação) ... */}
      </div>

      {/* ... (JSX do teclado e sugestões) ... */}

      {savedPhrases.length > 0 && (
        <div>
          {/* ... */}
          <div className="space-y-2">
            {savedPhrases.map((phrase) => (
              <Card 
                key={phrase.id} 
                className="p-3 bg-green-50 hover:bg-green-100 cursor-pointer flex justify-between items-center" 
                onClick={() => handlePlayText(phrase.text)} // <<< LÓGICA DE FALA CORRIGIDA AQUI
              >
                <p className="text-green-800 font-medium">{phrase.text}</p>
                {/* ... (botão de favorito) ... */}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
