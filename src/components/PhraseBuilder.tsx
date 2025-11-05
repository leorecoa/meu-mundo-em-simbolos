import { useState, useCallback } from 'react';
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

  const speakPhrase = useCallback(async () => {
    const text = currentPhrase.map(s => s.text).join(' ');
    if (!text.trim()) {
      toast({ title: "Frase vazia!" });
      return;
    }
    await speak(text);
  }, [currentPhrase, toast, speak]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mic className="h-6 w-6" />
            Frase Livre
          </h1>
        </div>
      </div>

      {/* Área de construção da frase */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-4 border border-purple-100">
          <h2 className="text-lg font-bold mb-3 bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
            Sua Frase:
          </h2>
          <div className="min-h-[140px] bg-gradient-to-br from-violet-50 to-pink-50 rounded-xl p-4 flex flex-wrap gap-3 items-start border-2 border-dashed border-purple-200">
            {currentPhrase.length === 0 ? (
              <p className="text-purple-300 text-center w-full py-8 font-medium">
                ✨ Clique em símbolos ou digite palavras para construir sua frase
              </p>
            ) : (
              currentPhrase.map((symbol, index) => (
                <div key={index} className="relative group">
                  <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl p-3 min-w-[90px] flex flex-col items-center gap-2 shadow-lg border-2 border-purple-200 hover:scale-105 transition-transform">
                    {symbol.image ? (
                      typeof symbol.image === 'string' ? (
                        <img src={symbol.image} alt={symbol.text} className="w-14 h-14 object-cover rounded-lg" />
                      ) : symbol.image instanceof Blob ? (
                        <img src={URL.createObjectURL(symbol.image)} alt={symbol.text} className="w-14 h-14 object-cover rounded-lg" />
                      ) : null
                    ) : null}
                    <span className="text-sm font-bold text-purple-900">{symbol.text}</span>
                  </div>
                  <button
                    onClick={() => removeSymbol(index)}
                    className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Botões de ação */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={speakPhrase}
              disabled={isSpeaking || currentPhrase.length === 0}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              <Volume2 className={`h-5 w-5 mr-2 ${isSpeaking ? 'animate-pulse' : ''}`} />
              {isSpeaking ? 'Falando...' : 'Falar'}
            </Button>
            <Button
              onClick={clearPhrase}
              variant="outline"
              disabled={currentPhrase.length === 0}
              className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 shadow-md"
              size="lg"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Limpar
            </Button>
          </div>
        </div>

        {/* Seleção de modo de entrada */}
        <div className="flex gap-3 mb-4">
          <Button
            variant={inputMode === 'symbols' ? 'default' : 'outline'}
            onClick={() => setInputMode('symbols')}
            className={`flex-1 shadow-md ${inputMode === 'symbols' ? 'bg-gradient-to-r from-violet-600 to-purple-600' : 'border-2 border-purple-200'}`}
          >
            🎯 Símbolos
          </Button>
          <Button
            variant={inputMode === 'keyboard' ? 'default' : 'outline'}
            onClick={() => setInputMode('keyboard')}
            className={`flex-1 shadow-md ${inputMode === 'keyboard' ? 'bg-gradient-to-r from-violet-600 to-purple-600' : 'border-2 border-purple-200'}`}
          >
            ⌨️ Teclado
          </Button>
        </div>

        {/* Área de símbolos disponíveis */}
        {inputMode === 'symbols' ? (
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-purple-100">
            <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Símbolos Disponíveis:
            </h2>
            {!symbols || symbols.length === 0 ? (
              <p className="text-purple-300 text-center py-8 font-medium">
                💭 Nenhum símbolo disponível. Adicione símbolos nas categorias.
              </p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {symbols.map((symbol) => (
                  <button
                    key={symbol.id}
                    onClick={() => addSymbol(symbol)}
                    className="bg-gradient-to-br from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 rounded-xl p-4 flex flex-col items-center gap-2 transition-all shadow-md hover:shadow-xl hover:scale-105 border-2 border-purple-100 hover:border-purple-300"
                  >
                    {symbol.image ? (
                      typeof symbol.image === 'string' ? (
                        <img src={symbol.image} alt={symbol.text} className="w-14 h-14 object-cover rounded-lg" />
                      ) : symbol.image instanceof Blob ? (
                        <img src={URL.createObjectURL(symbol.image)} alt={symbol.text} className="w-14 h-14 object-cover rounded-lg" />
                      ) : null
                    ) : (
                      <span className="text-3xl">✨</span>
                    )}
                    <span className="text-xs font-bold text-purple-900 text-center line-clamp-2">{symbol.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-2xl p-6 border border-purple-100">
            <h2 className="text-lg font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Digite sua frase:
            </h2>
            <Card className="border-2 border-purple-200">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite uma palavra..."
                    className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-400 text-lg"
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
                    className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
                  >
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
