import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Volume2, Trash2, X } from 'lucide-react';
import { Symbol as DbSymbol, db } from '@/lib/db';
import { useProfile } from '@/contexts/ProfileContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { useToast } from '@/hooks/use-toast';

export const PhraseBuilder = ({ onBack }: { onBack: () => void }) => {
  const [currentPhrase, setCurrentPhrase] = useState<DbSymbol[]>([]);
  const [inputMode, setInputMode] = useState<'symbols' | 'keyboard'>('symbols');
  const { activeProfileId } = useProfile();
  const { toast } = useToast();

  const symbols = useLiveQuery(
    () => activeProfileId ? db.symbols.where({ profileId: activeProfileId }).toArray() : [],
    [activeProfileId]
  );

  const addSymbol = useCallback((symbolOrText: DbSymbol | string) => {
    if (typeof symbolOrText === 'string') {
      const newSymbol: DbSymbol = {
        id: Date.now(),
        profileId: activeProfileId || 0,
        text: symbolOrText,
        categoryKey: 'custom',
        order: 999
      };
      setCurrentPhrase(prev => [...prev, newSymbol]);
    } else {
      setCurrentPhrase(prev => [...prev, symbolOrText]);
    }
  }, [activeProfileId]);

  const removeSymbol = useCallback((index: number) => {
    setCurrentPhrase(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearPhrase = useCallback(() => {
    setCurrentPhrase([]);
  }, []);

  const speakPhrase = useCallback(() => {
    const text = currentPhrase.map(s => s.text).join(' ');
    if (!text.trim()) {
      toast({ title: "Frase vazia!" });
      return;
    }

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    } else {
      toast({ title: "Síntese de fala não suportada", description: "Seu navegador não suporta fala." });
    }
  }, [currentPhrase, toast]);

  return (
    <div className="flex flex-col h-full p-4 bg-background">
      <header className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="mr-2" /> Voltar
        </Button>
        <h1 className="text-2xl font-bold">Formador de Frases</h1>
        <div className="w-24" />
      </header>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="min-h-[80px] flex flex-wrap gap-2 items-center">
            {currentPhrase.length === 0 ? (
              <p className="text-muted-foreground">Adicione símbolos para criar uma frase...</p>
            ) : (
              currentPhrase.map((symbol, index) => (
                <div key={index} className="relative inline-flex items-center bg-primary/10 rounded-lg p-2">
                  <span className="text-lg">{symbol.text}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 w-6 p-0"
                    onClick={() => removeSymbol(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 mb-4">
        <Button onClick={speakPhrase} className="flex-1" disabled={currentPhrase.length === 0}>
          <Volume2 className="mr-2" /> Falar
        </Button>
        <Button onClick={clearPhrase} variant="destructive" disabled={currentPhrase.length === 0}>
          <Trash2 className="mr-2" /> Limpar
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          onClick={() => setInputMode('symbols')}
          variant={inputMode === 'symbols' ? 'default' : 'outline'}
        >
          Símbolos
        </Button>
        <Button
          onClick={() => setInputMode('keyboard')}
          variant={inputMode === 'keyboard' ? 'default' : 'outline'}
        >
          Teclado
        </Button>
      </div>

      {inputMode === 'symbols' ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {symbols?.map((symbol) => (
            <Button
              key={symbol.id}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center"
              onClick={() => addSymbol(symbol)}
            >
              {symbol.image ? (
                <img
                  src={typeof symbol.image === 'string' ? symbol.image : URL.createObjectURL(symbol.image)}
                  alt={symbol.text}
                  className="h-12 w-12 object-cover mb-2"
                />
              ) : (
                <span className="text-3xl mb-2">{symbol.text.charAt(0)}</span>
              )}
              <span className="text-sm">{symbol.text}</span>
            </Button>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digite uma palavra..."
                className="flex-1 px-4 py-2 border rounded"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    addSymbol(e.currentTarget.value.trim());
                    e.currentTarget.value = '';
                  }
                }}
              />
              <Button
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input && input.value.trim()) {
                    addSymbol(input.value.trim());
                    input.value = '';
                  }
                }}
              >
                Adicionar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
