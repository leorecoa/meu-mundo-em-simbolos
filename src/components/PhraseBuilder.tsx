import { useState, useEffect } from 'react';
import { ChevronLeft, X, PlayCircle, Save, Plus, RefreshCw, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { savePhrase, getPhrases, deletePhrase, toggleFavoritePhrase } from '@/lib/storage';
import type { Phrase } from '@/db';
import { LetterKeyboard } from '@/components/LetterKeyboard';
import { WordCategories } from '@/components/WordCategories';
import { QuickPhraseBar } from '@/components/QuickPhraseBar';

interface PhraseBuilderProps {
  onBack: () => void;
}

interface CurrentSymbol {
  id: string;
  text: string;
  iconUrl?: string; // Adicionado para manter consistência com QuickPhraseBar
}

export const PhraseBuilder = ({ onBack }: PhraseBuilderProps) => {
  const [currentPhrase, setCurrentPhrase] = useState<CurrentSymbol[]>([]);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [customText, setCustomText] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentTheme } = useTheme();

  const { data: savedPhrases = [], refetch } = useQuery({ 
    queryKey: ['phrases'], 
    queryFn: getPhrases 
  });

  const saveMutation = useMutation({
    mutationFn: (phraseData: Omit<Phrase, 'id'>) => savePhrase(phraseData),
    onSuccess: () => {
      refetch();
      toast({ title: "Frase salva!" });
    },
  });

  const handleAddSymbol = (text: string) => {
    const newSymbol: CurrentSymbol = { id: text.toLowerCase(), text };
    setCurrentPhrase(prev => [...prev, newSymbol]);
  };

  const handleRemoveSymbol = (index: number) => {
    setCurrentPhrase(prev => prev.filter((_, i) => i !== index));
  };

  const handlePlayPhrase = () => {
    const phraseText = currentPhrase.map(symbol => symbol.text).join(' ');
    if (!phraseText) return;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phraseText);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSavePhrase = () => {
    if (currentPhrase.length === 0) return;

    const phraseToSave = {
      text: currentPhrase.map(symbol => symbol.text).join(' '),
      symbols: currentPhrase.map(s => ({ id: s.id, text: s.text })),
      timestamp: Date.now(),
      isFavorite: false,
    };

    saveMutation.mutate(phraseToSave);
  };

  const handleLetterSelect = (letter: string) => {
    setCustomText(prev => prev + letter);
  };
  
  const handleWordSelect = (word: string) => {
    handleAddSymbol(word);
  };
  
  const handleBackspace = () => {
    setCustomText(prev => prev.slice(0, -1));
  };
  
  const handleSubmitCustomText = () => {
    if (customText.trim()) {
      handleAddSymbol(customText.trim().toUpperCase());
      setCustomText('');
    }
  };

  return (
    <div className={`p-4 space-y-6 ${currentTheme.bgColor} min-h-screen`}>
      <div className="flex justify-between items-center mb-4">
        <Button variant="ghost" onClick={onBack} className={`flex items-center gap-1 ${currentTheme.textColor}`}>
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className={`text-xl font-bold text-center flex-1 mr-10 ${currentTheme.textColor}`}>MONTAR FRASE</h1>
      </div>

      <Card className={`${currentTheme.cardBg} p-4 min-h-[100px] shadow-md`}>
        <div className="flex flex-wrap gap-2">
          {currentPhrase.map((symbol, index) => (
            <div key={`${symbol.id}-${index}`} className={`relative ${currentTheme.buttonBg} rounded-lg p-3 flex flex-col items-center`}>
              <button className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm" onClick={() => handleRemoveSymbol(index)}>
                <X className="h-3 w-3 text-gray-500" />
              </button>
              <div className="h-16 w-16 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-3xl">
                {symbol.text.charAt(0)}
              </div>
              <span className={`text-sm font-bold ${currentTheme.textColor}`}>{symbol.text}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-center gap-4">
        <Button className={`${currentTheme.buttonBg} rounded-full p-3`} onClick={handlePlayPhrase}><PlayCircle className="h-8 w-8" /></Button>
        <Button className="bg-green-100 text-green-800 rounded-full p-3" onClick={handleSavePhrase}><Save className="h-8 w-8" /></Button>
        <Button className="bg-red-50 text-red-800 rounded-full p-3" onClick={() => setCurrentPhrase([])}><RefreshCw className="h-8 w-8" /></Button>
        <Button className="bg-blue-50 text-blue-800 rounded-full p-3" onClick={() => setShowKeyboard(!showKeyboard)}><Plus className="h-8 w-8" /></Button>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className={`text-md font-semibold ${currentTheme.textColor} mb-2`}>Frases rápidas:</h3>
        <QuickPhraseBar onUsePhrase={(symbols) => setCurrentPhrase(symbols)} />
      </div>
      
      {showKeyboard && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <div className="flex mb-2">
            <input type="text" value={customText} onChange={(e) => setCustomText(e.target.value)} className="flex-1 p-2 border rounded-l-md" placeholder="Digite uma palavra" />
            <Button className="rounded-l-none" onClick={handleSubmitCustomText}>Adicionar</Button>
          </div>
          <LetterKeyboard onLetterSelect={handleLetterSelect} onWordSelect={handleWordSelect} onBackspace={handleBackspace} onSubmit={handleSubmitCustomText} />
        </div>
      )}

      <div>
        <h2 className={`text-lg font-semibold ${currentTheme.textColor} mb-3`}>Sugestões:</h2>
        <WordCategories onSelectWord={handleAddSymbol} />
      </div>

      {savedPhrases.length > 0 && (
        <div>
          <h2 className={`text-lg font-semibold ${currentTheme.textColor} mb-3`}>Frases salvas:</h2>
          <div className="space-y-2">
            {savedPhrases.map((phrase) => (
              <Card key={phrase.id} className="p-3 bg-green-50 flex justify-between items-center">
                <p className="text-green-800 font-medium">{phrase.text}</p>
                <Button variant="ghost" size="sm" onClick={() => phrase.id && toggleFavoritePhrase(phrase.id)}>
                  <Heart className="h-4 w-4" fill={phrase.isFavorite ? "currentColor" : "none"} />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
