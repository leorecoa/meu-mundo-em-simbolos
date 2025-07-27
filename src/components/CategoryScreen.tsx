
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getCategoryData } from '@/data/categoryData';

interface CategoryScreenProps {
  category: string;
  onBack: () => void;
  onNavigateToPhrase: () => void;
}

export const CategoryScreen = ({ category, onBack, onNavigateToPhrase }: CategoryScreenProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();

  const categoryData = getCategoryData(category);
  
  const toggleItem = (id: string, label: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
      toast({
        title: "Item removido",
        description: `${label} foi removido da seleção`,
      });
    } else {
      setSelectedItems([...selectedItems, id]);
      toast({
        title: "Item selecionado",
        description: `${label} foi adicionado à seleção`,
      });
    }
  };

  const handleItemClick = (item: { id: string; label: string; icon: any }) => {
    // Reproduzir som do item ao clicar
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(item.label);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
    
    toggleItem(item.id, item.label);
  };

  const handleAddToPhrase = () => {
    if (selectedItems.length > 0) {
      const selectedLabels = categoryData.items
        .filter(item => selectedItems.includes(item.id))
        .map(item => item.label);
      
      toast({
        title: "Itens adicionados à frase",
        description: `${selectedLabels.join(', ')} foram adicionados`,
        duration: 3000,
      });
      
      // Simular navegação para a tela de frases com os itens selecionados
      setTimeout(() => {
        onNavigateToPhrase();
      }, 1000);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="flex items-center gap-1 text-blue-700"
        >
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className="text-xl font-bold text-center flex-1 mr-10">{categoryData.title}</h1>
      </div>

      {/* Nota para desenvolvedores */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded">
        <p className="text-sm text-yellow-700">
          <strong>Nota:</strong> Esta tela exibe símbolos específicos da categoria {categoryData.title}. 
          Cada símbolo pode ser clicado para seleção e reprodução de áudio.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categoryData.items.map((item) => (
          <Card
            key={item.id}
            className={`p-4 flex flex-col items-center justify-center cursor-pointer transition-all 
              ${selectedItems.includes(item.id) ? 'ring-4 ring-blue-400 bg-blue-50' : 'bg-white'}
              hover:bg-gray-50 hover:shadow-md`}
            onClick={() => handleItemClick(item)}
          >
            <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-full mb-2">
              <item.icon className="h-10 w-10 text-gray-600" />
            </div>
            <div className="text-center font-semibold text-sm">{item.label}</div>
            {selectedItems.includes(item.id) && (
              <div className="mt-2 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </Card>
        ))}
      </div>
      
      {selectedItems.length > 0 && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center px-4">
          <Button 
            className="w-full max-w-md py-6 text-xl font-bold rounded-xl bg-green-100 hover:bg-green-200 text-green-800 shadow-lg"
            onClick={handleAddToPhrase}
          >
            ADICIONAR À FRASE ({selectedItems.length})
          </Button>
        </div>
      )}
    </div>
  );
};
