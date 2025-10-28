import { useState, useEffect } from 'react';
import { ChevronLeft, X, PlayCircle, Save, Plus, RefreshCw, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { savePhrase, getPhrases, deletePhrase, toggleFavoritePhrase } from '@/lib/storage';
import type { Phrase } from '@/db';

interface PhraseBuilderProps {
  onBack: () => void;
}

// A interface para os símbolos na frase atual não precisa vir do DB
interface CurrentSymbol {
  id: string;
  text: string;
}

export const PhraseBuilder = ({ onBack }: PhraseBuilderProps) => {
  const [currentPhrase, setCurrentPhrase] = useState<CurrentSymbol[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentTheme } = useTheme();

  // Busca as frases salvas do Dexie
  const { data: savedPhrases = [], refetch } = useQuery({ 
    queryKey: ['phrases'], 
    queryFn: getPhrases 
  });

  // Mutação para salvar uma nova frase
  const saveMutation = useMutation({
    mutationFn: (phraseData: Omit<Phrase, 'id'>) => savePhrase(phraseData),
    onSuccess: () => {
      refetch(); // Atualiza a lista de frases salvas
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
      symbols: currentPhrase.map(s => ({ id: s.id, text: s.text })), // Simplificado
      timestamp: Date.now(),
      isFavorite: false,
    };

    saveMutation.mutate(phraseToSave);
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
              <button 
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-50"
                onClick={() => handleRemoveSymbol(index)}
              >
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
        <Button className={`${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor} rounded-full p-3`} onClick={handlePlayPhrase} title="Reproduzir frase">
          <PlayCircle className="h-8 w-8" />
        </Button>
        <Button className="bg-green-100 hover:bg-green-200 text-green-800 rounded-full p-3" onClick={handleSavePhrase} title="Salvar frase">
          <Save className="h-8 w-8" />
        </Button>
        <Button className="bg-red-50 hover:bg-red-100 text-red-800 rounded-full p-3" onClick={() => setCurrentPhrase([])} title="Limpar frase">
          <RefreshCw className="h-8 w-8" />
        </Button>
      </div>
      
      {/* Apenas um exemplo de como adicionar símbolos */}
      <div className="flex gap-2 justify-center">
        <Button onClick={() => handleAddSymbol('EU')}>EU</Button>
        <Button onClick={() => handleAddSymbol('QUERO')}>QUERO</Button>
        <Button onClick={() => handleAddSymbol('ÁGUA')}>ÁGUA</Button>
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
