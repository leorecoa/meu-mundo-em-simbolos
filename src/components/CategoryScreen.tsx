
import { useState } from 'react';
import { ChevronLeft, Utensils, Coffee, Apple, IceCream, Pizza, Sandwich, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CategoryScreenProps {
  category: string;
  onBack: () => void;
  onNavigateToPhrase: () => void;
}

export const CategoryScreen = ({ category, onBack, onNavigateToPhrase }: CategoryScreenProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const getCategoryTitle = () => {
    switch (category) {
      case 'comida':
        return 'COMIDA';
      case 'brincar':
        return 'BRINCAR';
      case 'casa':
        return 'CASA';
      case 'quero':
        return 'EU QUERO';
      case 'sinto':
        return 'EU SINTO';
      case 'preciso':
        return 'EU PRECISO';
      default:
        return category.toUpperCase();
    }
  };

  const getCategoryItems = () => {
    // Este é apenas um exemplo para a categoria 'comida'
    // Em uma implementação real, cada categoria teria seus próprios itens
    if (category === 'comida') {
      return [
        { id: 'agua', label: 'ÁGUA', icon: Coffee },
        { id: 'fruta', label: 'FRUTA', icon: Apple },
        { id: 'sorvete', label: 'SORVETE', icon: IceCream },
        { id: 'pizza', label: 'PIZZA', icon: Pizza },
        { id: 'sanduiche', label: 'SANDUÍCHE', icon: Sandwich },
        { id: 'biscoito', label: 'BISCOITO', icon: Cookie },
      ];
    }
    
    // Itens genéricos para outras categorias
    return Array.from({ length: 8 }, (_, i) => ({
      id: `item-${i}`,
      label: `ITEM ${i + 1}`,
      icon: Utensils,
    }));
  };

  const items = getCategoryItems();
  
  const toggleItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleAddToPhrase = () => {
    if (selectedItems.length > 0) {
      // Aqui adicionaríamos os itens selecionados à frase em construção
      // Esta funcionalidade será implementada com gerenciamento de estado global em uma aplicação real
      onNavigateToPhrase();
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
        <h1 className="text-xl font-bold text-center flex-1 mr-10">{getCategoryTitle()}</h1>
      </div>

      {/* Nota para desenvolvedores */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded">
        <p className="text-sm text-yellow-700">
          <strong>Nota:</strong> Esta tela exibe itens específicos da categoria. Em uma implementação 
          completa, mostraria símbolos PECS/ARASAAC e permitiria a substituição por fotos personalizadas.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            className={`p-4 flex flex-col items-center justify-center cursor-pointer transition-all 
              ${selectedItems.includes(item.id) ? 'ring-4 ring-blue-400 bg-blue-50' : 'bg-white'}
              hover:bg-gray-50`}
            onClick={() => toggleItem(item.id)}
          >
            <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-full mb-2">
              <item.icon className="h-10 w-10 text-gray-600" />
            </div>
            <div className="text-center font-semibold">{item.label}</div>
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
