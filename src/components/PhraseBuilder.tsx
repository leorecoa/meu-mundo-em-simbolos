import { useState, useEffect } from 'react';
import { ChevronLeft, X, PlayCircle, Save, Plus, RefreshCw, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';
import { useMutation, useQuery } from '@tanstack/react-query';
import { savePhrase, getPhrases, StoredPhrase, PhraseSymbol } from '@/lib/storage';
import { LetterKeyboard } from '@/components/LetterKeyboard';
import { WordCategories } from '@/components/WordCategories';
import { QuickPhraseBar } from '@/components/QuickPhraseBar';

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
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [customText, setCustomText] = useState('');
  const { toast } = useToast();
  const { currentTheme } = useTheme();
  
  // Consulta para obter frases salvas usando React Query
  const { data: savedPhrasesData, refetch: refetchPhrases } = useQuery({
    queryKey: ['phrases'],
    queryFn: getPhrases,
    initialData: []
  });
  
  // Mutação para salvar frases
  const saveMutation = useMutation({
    mutationFn: savePhrase,
    onSuccess: () => {
      refetchPhrases();
    }
  });
  
  // Converter dados da consulta para o formato necessário
  const savedPhrases = savedPhrasesData.map(phrase => phrase.text);

  const handleRemoveSymbol = (index: number) => {
    const newPhrase = [...currentPhrase];
    newPhrase.splice(index, 1);
    setCurrentPhrase(newPhrase);
    toast({
      title: "Símbolo removido",
      description: "Símbolo foi removido da sua frase",
    });
  };

  // Importar e usar o hook de síntese de voz
  const [speechLoaded, setSpeechLoaded] = useState(false);
  
  // Verificar se a API de síntese de voz está disponível
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechLoaded(true);
    }
  }, []);
  
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
    
    // Usar a API de síntese de voz com configurações melhoradas
    if (speechLoaded) {
      // Cancelar qualquer fala anterior
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(phraseText);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Tentar encontrar uma voz em português
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(voice => 
        voice.lang.includes('pt') || voice.lang.includes('PT')
      );
      
      if (ptVoice) {
        utterance.voice = ptVoice;
      }
      
      window.speechSynthesis.speak(utterance);
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
    
    // Criar objeto de frase para salvar
    const newPhrase: StoredPhrase = {
      id: `phrase-${Date.now()}`,
      text: phraseText,
      symbols: [...currentPhrase],
      timestamp: Date.now(),
      isFavorite: false
    };
    
    // Usar mutação para salvar a frase
    saveMutation.mutate(newPhrase);
    
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
  
  // Funções para o teclado virtual
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

  const suggestions = [
    // Pronomes e sujeitos
    'EU', 'VOCÊ', 'ELE', 'ELA', 'NÓS', 'ELES', 'MINHA', 'MEU', 'SEU', 'SUA',
    
    // Verbos comuns
    'QUERO', 'PRECISO', 'SINTO', 'VOU', 'ESTOU', 'TENHO', 'GOSTO', 'POSSO', 'AJUDA', 'DÁ', 'FAZ',
    
    // Necessidades básicas
    'BANHEIRO', 'ÁGUA', 'COMIDA', 'DORMIR', 'BANHO', 'SEDE', 'FOME', 'REMÉDIO', 'TROCAR',
    
    // Respostas e expressões
    'SIM', 'NÃO', 'TALVEZ', 'POR FAVOR', 'OBRIGADO', 'DESCULPA', 'OI', 'TCHAU', 'SOCORRO',
    
    // Sentimentos
    'FELIZ', 'TRISTE', 'CANSADO', 'DOR', 'BOM', 'RUIM', 'MEDO', 'CALOR', 'FRIO', 'NERVOSO',
    
    // Ações
    'VER', 'OUVIR', 'TOCAR', 'IR', 'VIR', 'COMER', 'BEBER', 'BRINCAR', 'LER', 'DESENHAR', 'JOGAR',
    
    // Pessoas
    'MAMÃE', 'PAPAI', 'VOVÓ', 'VOVÔ', 'IRMÃO', 'IRMÃ', 'AMIGO', 'PROFESSOR', 'MÉDICO', 'TIO', 'TIA',
    
    // Lugares
    'CASA', 'ESCOLA', 'PARQUE', 'MÉDICO', 'LOJA', 'CARRO', 'QUARTO', 'COZINHA', 'SALA', 'RUA', 'PRAIA',
    
    // Tempo
    'AGORA', 'DEPOIS', 'HOJE', 'AMANHÃ', 'ONTEM', 'RÁPIDO', 'DEVAGAR', 'CEDO', 'TARDE', 'NOITE', 'DIA',
    
    // Objetos comuns
    'LIVRO', 'BRINQUEDO', 'TELEFONE', 'MÚSICA', 'FILME', 'JOGO', 'ROUPA', 'SAPATO', 'BOLA', 'BONECA',
    
    // Alimentos
    'PÃO', 'LEITE', 'SUCO', 'FRUTA', 'BOLACHA', 'CHOCOLATE', 'SORVETE', 'CARNE', 'ARROZ', 'FEIJÃO',
    
    // Adjetivos
    'GRANDE', 'PEQUENO', 'QUENTE', 'FRIO', 'BONITO', 'FEIO', 'NOVO', 'VELHO', 'LIMPO', 'SUJO',
    
    // Preposições e conectivos
    'COM', 'SEM', 'PARA', 'DE', 'EM', 'E', 'OU', 'MAS', 'PORQUE', 'QUANDO'
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
        
        <Button 
          className="bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-full p-3"
          onClick={() => setShowKeyboard(!showKeyboard)}
          title="Teclado"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </div>
      
      {/* Barra de frases rápidas */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className={`text-md font-semibold ${currentTheme.textColor} mb-2`}>Frases rápidas:</h3>
        <QuickPhraseBar 
          onUsePhrase={(symbols) => {
            // Limpar frase atual e adicionar os símbolos da frase rápida
            setCurrentPhrase(symbols);
            toast({
              title: "Frase rápida adicionada",
              description: symbols.map(s => s.text).join(' '),
              duration: 2000,
            });
          }}
        />
      </div>
      
      {/* Teclado virtual */}
      {showKeyboard && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
          <div className="flex mb-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="flex-1 p-2 border rounded-l-md"
              placeholder="Digite uma palavra personalizada"
            />
            <Button 
              className="rounded-l-none"
              onClick={handleSubmitCustomText}
            >
              Adicionar
            </Button>
          </div>
          
          <LetterKeyboard
            onLetterSelect={handleLetterSelect}
            onWordSelect={handleWordSelect}
            onBackspace={handleBackspace}
            onSubmit={handleSubmitCustomText}
          />
        </div>
      )}

      {/* Sugestões de símbolos organizadas por categorias */}
      <div>
        <h2 className={`text-lg font-semibold ${currentTheme.textColor} mb-3`}>Sugestões:</h2>
        
        <WordCategories 
          onSelectCategory={(category) => {
            // Esta função será chamada quando uma categoria for selecionada
            toast({
              title: `Categoria: ${category}`,
              description: `Palavras da categoria ${category} carregadas`,
              duration: 1500,
            });
          }}
          onSelectWord={(word) => {
            // Esta função será chamada quando uma palavra for selecionada
            handleAddSymbol(word);
          }}
        />
      </div>

      {/* Frases salvas */}
      {savedPhrasesData.length > 0 && (
        <div>
          <h2 className={`text-lg font-semibold ${currentTheme.textColor} mb-3`}>Frases salvas:</h2>
          <div className="space-y-2">
            {savedPhrasesData.map((phrase) => (
              <Card 
                key={phrase.id} 
                className="p-3 bg-green-50 hover:bg-green-100 cursor-pointer flex justify-between items-center" 
                onClick={() => {
                  if ('speechSynthesis' in window) {
                    const utterance = new SpeechSynthesisUtterance(phrase.text);
                    utterance.lang = 'pt-BR';
                    speechSynthesis.speak(utterance);
                  }
                }}
              >
                <p className="text-green-800 font-medium">{phrase.text}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={phrase.isFavorite ? "text-red-500" : "text-gray-400"}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Implementação do toggle de favorito seria aqui
                  }}
                >
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
