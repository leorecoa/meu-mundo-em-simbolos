import { useState, useEffect } from 'react';
import { ChevronLeft, X, PlayCircle, Save, Plus, RefreshCw, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { savePhrase, getPhrases, toggleFavoritePhrase, getSettings } from '@/lib/storage'; // Importa getSettings
import type { Phrase, UserSettings } from '@/db';
import { LetterKeyboard } from '@/components/LetterKeyboard';
import { WordCategories } from '@/components/WordCategories';
import { QuickPhraseBar } from '@/components/QuickPhraseBar';

// ... (interfaces) ...
interface PhraseBuilderProps {
  onBack: () => void;
}

interface CurrentSymbol {
  id: string;
  text: string;
  iconUrl?: string;
}

export const PhraseBuilder = ({ onBack }: PhraseBuilderProps) => {
  const [currentPhrase, setCurrentPhrase] = useState<CurrentSymbol[]>([]);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [customText, setCustomText] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentTheme } = useTheme();

  // Busca dados do DB com React Query
  const { data: savedPhrases = [] } = useQuery({ queryKey: ['phrases'], queryFn: getPhrases });
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: getSettings });

  const saveMutation = useMutation(/* ... */);

  const handlePlayPhrase = () => {
    const phraseText = currentPhrase.map(symbol => symbol.text).join(' ');
    if (!phraseText || !('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(phraseText);
    utterance.lang = 'pt-BR';

    // Aplica a voz salva nas configurações
    if (settings?.voiceType) {
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => voice.name === settings.voiceType);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    window.speechSynthesis.speak(utterance);
  };
  
  // ... (outras funções: handleAddSymbol, handleRemoveSymbol, handleSavePhrase, etc.) ...

  return (
    <div className={`p-4 space-y-6 ${currentTheme.bgColor} min-h-screen`}>
      {/* ... (JSX do componente, incluindo os botões de ação melhorados) ... */}
    </div>
  );
};
