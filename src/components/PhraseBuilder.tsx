
import { useState } from 'react';
import { ChevronLeft, X, PlayCircle, Save, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

  const handleRemoveSymbol = (index: number) => {
    const newPhrase = [...currentPhrase];
    newPhrase.splice(index, 1);
    setCurrentPhrase(newPhrase);
  };

  const handlePlayPhrase = () => {
    // Aqui seria implementada a funcionalidade de text-to-speech
    alert('Reproduzindo: ' + currentPhrase.map(symbol => symbol.text).join(' '));
  };

  const handleClearPhrase = () => {
    setCurrentPhrase([]);
  };

  const handleSavePhrase = () => {
    // Aqui seria implementada a funcionalidade de salvar a frase
    alert('Frase salva');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="flex items-center gap-1 text-blue-700"
        >
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className="text-xl font-bold text-center flex-1 mr-10">MONTAR FRASE</h1>
      </div>

      {/* Nota para desenvolvedores */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
        <p className="text-sm text-yellow-700">
          <strong>Nota:</strong> Esta tela permite arrastar e soltar símbolos para montar frases.
          O botão de play ativa o texto-para-voz com opções de configuração de voz.
        </p>
      </div>

      {/* Área da frase atual */}
      <Card className="bg-white p-4 min-h-[100px] shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Minha frase:</h2>
        <div className="flex flex-wrap gap-2">
          {currentPhrase.length > 0 ? (
            currentPhrase.map((symbol, index) => (
              <div 
                key={`${symbol.id}-${index}`} 
                className="relative bg-blue-100 rounded-lg p-3 flex flex-col items-center"
              >
                <button 
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm"
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
                <span className="text-sm font-bold">{symbol.text}</span>
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
          className="bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full p-3"
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
          className="bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-full p-3"
          title="Adicionar novo símbolo"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </div>

      {/* Sugestões de símbolos frequentes */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Sugestões:</h2>
        <div className="flex overflow-x-auto gap-3 pb-4">
          {['BANHEIRO', 'ÁGUA', 'COMIDA', 'DORMIR', 'SIM', 'NÃO'].map((text) => (
            <div 
              key={text}
              className="min-w-[80px] bg-white rounded-lg p-3 shadow-sm flex flex-col items-center cursor-pointer hover:bg-gray-50"
            >
              <div className="h-16 w-16 bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-2xl">
                {text.charAt(0)}
              </div>
              <span className="text-xs font-bold">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
