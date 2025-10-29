'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PlayCircle, Trash2, X, Sparkles, Volume2 } from 'lucide-react';

// --- Tipos de Dados ---
interface Symbol {
  id: string;
  text: string;
  image?: string; // Para símbolos com imagens personalizadas
}

// --- Componente Principal ---
export default function FormadorFrasesPage() {
  const [currentPhrase, setCurrentPhrase] = useState<Symbol[]>([]);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>();
  const { toast } = useToast();

  // Carregamento seguro das vozes do navegador
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('pt'));
        setVoices(availableVoices);
        const preferredVoice = localStorage.getItem('selectedVoice');
        if (preferredVoice && availableVoices.some(v => v.name === preferredVoice)) {
          setSelectedVoice(preferredVoice);
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    localStorage.setItem('selectedVoice', voiceName);
  };

  // --- Funções de Manipulação da Frase ---
  const addSymbol = (symbol: Symbol) => {
    setCurrentPhrase(prev => [...prev, symbol]);
  };

  const removeLastSymbol = () => {
    setCurrentPhrase(prev => prev.slice(0, -1));
  };

  const clearPhrase = () => {
    setCurrentPhrase([]);
  };

  // --- Função de Fala ---
  const speakPhrase = () => {
    if (currentPhrase.length === 0 || typeof window === 'undefined' || !window.speechSynthesis) {
      toast({
        title: "Frase vazia!",
        description: "Adicione símbolos para formar uma frase.",
        variant: "destructive",
      });
      return;
    }

    const phraseText = currentPhrase.map(s => s.text).join(' ');
    window.speechSynthesis.cancel(); // Cancela falas anteriores
    const utterance = new SpeechSynthesisUtterance(phraseText);

    const voiceToUse = voices.find(v => v.name === selectedVoice);
    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;

    window.speechSynthesis.speak(utterance);
  };

  // --- Símbolos de Exemplo ---
  const exampleSymbols: Symbol[] = [
    { id: 'eu', text: 'Eu' }, { id: 'quero', text: 'quero' }, { id: 'comer', text: 'comer' },
    { id: 'beber', text: 'beber' }, { id: 'brincar', text: 'brincar' }, { id: 'ir', text: 'ir' },
    { id: 'banheiro', text: 'banheiro' }, { id: 'agua', text: 'água' }, { id: 'bola', text: 'bola' },
  ];

  return (
    <main className="p-4 md:p-6 bg-slate-50 min-h-screen font-sans">
      {/* Área da Frase */}
      <Card className="mb-4 min-h-[150px] shadow-lg bg-white flex items-center justify-center p-4">
        <CardContent className="w-full">
          {currentPhrase.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {currentPhrase.map((symbol, index) => (
                <div key={`${symbol.id}-${index}`} className="flex flex-col items-center gap-2">
                  <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center shadow-inner">
                    <span className="text-xl font-semibold text-slate-700">{symbol.text}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400">
              <Sparkles className="mx-auto h-8 w-8 mb-2" />
              <p>Comece a montar sua frase selecionando os símbolos abaixo.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Painel de Controle Principal */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Button onClick={speakPhrase} className="h-24 bg-green-500 hover:bg-green-600 text-white shadow-xl col-span-2">
          <PlayCircle className="h-10 w-10" />
          <span className="ml-3 text-2xl font-bold">Falar</span>
        </Button>
        <Button onClick={removeLastSymbol} variant="outline" className="h-24 bg-amber-400 hover:bg-amber-500 text-white shadow-lg">
          <X className="h-8 w-8" />
          <span className="ml-2 text-lg">Apagar</span>
        </Button>
        <Button onClick={clearPhrase} variant="destructive" className="h-24 shadow-lg">
          <Trash2 className="h-8 w-8" />
          <span className="ml-2 text-lg">Limpar</span>
        </Button>
      </div>

      {/* Seletor de Vozes */}
      <div className="mb-6">
        <label htmlFor="voice-selector" className="flex items-center gap-2 text-slate-600 font-medium mb-2">
          <Volume2 className="h-5 w-5" />
          Voz do Aplicativo
        </label>
        <select
          id="voice-selector"
          value={selectedVoice}
          onChange={(e) => handleVoiceChange(e.target.value)}
          className="w-full p-3 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
          disabled={voices.length === 0}
        >
          {voices.length > 0 ? (
            voices.map(voice => (
              <option key={voice.name} value={voice.name}>
                {`${voice.name} (${voice.lang})`}
              </option>
            ))
          ) : (
            <option>Carregando vozes...</option>
          )}
        </select>
         <p className="text-xs text-gray-500 mt-2">A lista de vozes depende das instaladas no seu dispositivo.</p>
      </div>

      {/* Grid de Símbolos */}
      <Card className="shadow-lg bg-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {exampleSymbols.map(symbol => (
              <Button
                key={symbol.id}
                onClick={() => addSymbol(symbol)}
                variant="outline"
                className="h-28 flex-col gap-2 shadow-sm hover:bg-blue-50 hover:border-blue-400"
              >
                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-800">
                  {symbol.text}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
