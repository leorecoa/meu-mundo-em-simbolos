import { useState } from 'react';
import { ChevronLeft, X, PlayCircle, Save, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';

interface PhraseBuilderProps {
  onBack: () => void;
}

interface PhraseSymbol {
  id: string;
  text: string;
  iconUrl?: string;
}

export const PhraseBuilder = ({ onBack }: PhraseBuilderProps) => {
  const [currentPhrase, setCurrentPhrase] = useState<PhraseSymbol[]>([
    { id: 'eu', text: 'EU' },
    { id: 'quero', text: 'QUERO' },
    { id: 'agua', text: 'ÁGUA' }
  ]);
  const [savedPhrases, setSavedPhrases] = useState<string[]>([]);
  const { toast } = useToast();
  const { currentTheme } = useTheme();

  const handleRemoveSymbol = (index: number) => {
    const newPhrase = [...currentPhrase];
    newPhrase.splice(index, 1);
    setCurrentPhrase(newPhrase);
    toast({
      title: "Símbolo removido",
      description: "Símbolo foi removido da sua frase",
    });
  };

  const handlePlayPhrase = () => {
    if (currentPhrase.length === 0) {
      toast({
        title: "Nenhuma frase para reproduzir",
        description: "Adicione símbolos para criar uma frase",
        variant: "destructive",
      });
      return;
    }

    const phraseText = currentPhrase.map(symbol => symbol.text).join(' ');
    
    // Simular text-to-speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phraseText);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
    
    toast({
      title: "Reproduzindo frase",
      description: phraseText,
      duration: 3000,
    });
  };

  const handleClearPhrase = () => {
    if (currentPhrase.length === 0) {
      toast({
        title: "Nenhuma frase para limpar",
        description: "A área de frase já está vazia",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentPhrase([]);
    toast({
      title: "Frase limpa",
      description: "Todos os símbolos foram removidos",
    });
  };

  const handleSavePhrase = () => {
    if (currentPhrase.length === 0) {
      toast({
        title: "Nenhuma frase para salvar",
        description: "Adicione símbolos para criar uma frase",
        variant: "destructive",
      });
      return;
    }

    const phraseText = currentPhrase.map(symbol => symbol.text).join(' ');
    setSavedPhrases(prev => [...prev, phraseText]);
    toast({
      title: "Frase salva!",
      description: `"${phraseText}" foi salva nas suas frases`,
    });
  };

  const handleAddSymbol = (text: string) => {
    const newSymbol: PhraseSymbol = {
      id: text.toLowerCase(),
      text: text
    };
    setCurrentPhrase(prev => [...prev, newSymbol]);
    toast({
      title: "Símbolo adicionado",
      description: `"${text}" foi adicionado à sua frase`,
    });
  };

  const suggestions = [
    // Necessidades básicas
    'BANHEIRO', 'ÁGUA', 'COMIDA', 'DORMIR', 'BANHO', 'SEDE', 'FOME',
    // Respostas simples
    'SIM', 'NÃO', 'TALVEZ', 'POR FAVOR', 'OBRIGADO', 'DESCULPA',
    // Sentimentos
    'FELIZ', 'TRISTE', 'CANSADO', 'DOR', 'BOM', 'RUIM', 'GOSTO', 'NÃO GOSTO',
    // Ações
    'QUERO', 'PRECISO', 'SINTO', 'VER', 'OUVIR', 'TOCAR', 'IR', 'VENIR',
    // Pessoas
    'MAMÃE', 'PAPAI', 'VOVÓ', 'VOVÔ', 'IRMÃO', 'IRMÃ', 'AMIGO', 'PROFESSOR',
    // Lugares
    'CASA', 'ESCOLA', 'PARQUE', 'MÉDICO', 'LOJA', 'CARRO', 'QUARTO',
    // Tempo
    'AGORA', 'DEPOIS', 'HOJE', 'AMANHÃ', 'ONTEM', 'RÁPIDO', 'DEVAGAR',
    // Objetos comuns
    'LIVRO', 'BRINQUEDO', 'TELEFONE', 'MÚSICA', 'FILME', 'JOGO'
  ];

  return (
    <div className={`p-4 space-y-6 ${currentTheme.bgColor} min-h-screen`}>
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className={`flex items-center gap-1 ${currentTheme.textColor}`}
        >
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className={`text-xl font-bold text-center flex-1 mr-10 ${currentTheme.textColor}`}>MONTAR FRASE</h1>
      </div>

      {/* Nota para desenvolvedores */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
        <p className="text-sm text-yellow-700">
          <strong>Nota:</strong> Esta tela permite arrastar e soltar símbolos para montar frases.
          O botão de play ativa o texto-para-voz com opções de configuração de voz.
        </p>
      </div>

      {/* Área da frase atual */}
      <Card className={`${currentTheme.cardBg} p-4 min-h-[100px] shadow-md`}>
        <h2 className={`text-lg font-semibold ${currentTheme.textColor} mb-3`}>Minha frase:</h2>
        <div className="flex flex-wrap gap-2">
          {currentPhrase.length > 0 ? (
            currentPhrase.map((symbol, index) => (
              <div 
                key={`${symbol.id}-${index}`} 
                className={`relative ${currentTheme.buttonBg} rounded-lg p-3 flex flex-col items-center`}
              >
                <button 
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-50"
                  onClick={() => handleRemoveSymbol(index)}
                >
                  <X className="h-3 w-3 text-gray-500" />
                </button>
                <div className="h-16 w-16 bg-gray-200 rounded-lg mb-2 flex items-center justify-center text-3xl">
                  {symbol.iconUrl ? (
                    <img src={symbol.iconUrl} alt={symbol.text} className="h-12 w-12" />
                  ) : (
                    symbol.text.charAt(0)
                  )}
                </div>
                <span className={`text-sm font-bold ${currentTheme.textColor}`}>{symbol.text}</span>
              </div>
            ))
          ) : (
            <div className="flex-1 h-20 flex items-center justify-center text-gray-400 text-sm">
              Arraste símbolos para cá para montar sua frase
            </div>
          )}
        </div>
      </Card>

      {/* Controles de frase */}
      <div className="flex justify-center gap-4">
        <Button 
          className={`${currentTheme.buttonBg} ${currentTheme.buttonHover} ${currentTheme.textColor} rounded-full p-3`}
          onClick={handlePlayPhrase}
          title="Reproduzir frase"
        >
          <PlayCircle className="h-8 w-8" />
        </Button>
        
        <Button 
          className="bg-green-100 hover:bg-green-200 text-green-800 rounded-full p-3"
          onClick={handleSavePhrase}
          title="Salvar frase"
        >
          <Save className="h-8 w-8" />
        </Button>
        
        <Button 
          className="bg-red-50 hover:bg-red-100 text-red-800 rounded-full p-3"
          onClick={handleClearPhrase}
          title="Limpar frase"
        >
          <RefreshCw className="h-8 w-8" />
        </Button>
      </div>

      {/* Sugestões de símbolos expandidas */}
      <div>
        <h2 className={`text-lg font-semibold ${currentTheme.textColor} mb-3`}>Sugestões:</h2>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {suggestions.map((text) => (
            <div 
              key={text}
              className={`${currentTheme.cardBg} rounded-lg p-3 shadow-sm flex flex-col items-center cursor-pointer ${currentTheme.buttonHover} transition-colors`}
              onClick={() => handleAddSymbol(text)}
            >
              <div className="h-12 w-12 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-lg">
                {text.charAt(0)}
              </div>
              <span className={`text-xs font-bold ${currentTheme.textColor} text-center`}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Frases salvas */}
      {savedPhrases.length > 0 && (
        <div>
          <h2 className={`text-lg font-semibold ${currentTheme.textColor} mb-3`}>Frases salvas:</h2>
          <div className="space-y-2">
            {savedPhrases.map((phrase, index) => (
              <Card key={index} className="p-3 bg-green-50 hover:bg-green-100 cursor-pointer" onClick={() => {
                if ('speechSynthesis' in window) {
                  const utterance = new SpeechSynthesisUtterance(phrase);
                  utterance.lang = 'pt-BR';
                  speechSynthesis.speak(utterance);
                }
              }}>
                <p className="text-green-800 font-medium">{phrase}</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
