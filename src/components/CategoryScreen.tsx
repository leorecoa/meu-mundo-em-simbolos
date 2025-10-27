import { useState, useEffect } from 'react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getCategoryWithSymbolsByKey } from '@/lib/storage';
import type { Symbol as SymbolType } from '@/db';
import { DynamicIcon } from '@/components/IconMap';

interface CategoryScreenProps {
  category: string; // A 'key' da categoria (ex: 'quero')
  onBack: () => void;
  onNavigateToPhrase: () => void;
}

export const CategoryScreen = ({ category, onBack, onNavigateToPhrase }: CategoryScreenProps) => {
  const [title, setTitle] = useState('');
  const [symbols, setSymbols] = useState<SymbolType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { category: cat, symbols: syms } = await getCategoryWithSymbolsByKey(category);
      if (cat) {
        setTitle(cat.name);
        setSymbols(syms);
      } else {
        setTitle('Categoria não encontrada');
        setSymbols([]);
      }
      setLoading(false);
    };

    fetchData();
  }, [category]);

  const toggleItem = (id: number, label: string) => {
    if (!id) return;
    const a = selectedItems.includes(id)
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

  const handleItemClick = (item: SymbolType) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(item.name);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
    if (item.id) {
      toggleItem(item.id, item.name);
    }
  };

  const handleAddToPhrase = () => {
    if (selectedItems.length > 0) {
      const selectedLabels = symbols
        .filter(item => item.id && selectedItems.includes(item.id))
        .map(item => item.name);
      
      toast({
        title: "Itens adicionados à frase",
        description: `${selectedLabels.join(', ')} foram adicionados`,
        duration: 3000,
      });
      
      setTimeout(() => {
        onNavigateToPhrase();
      }, 1000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="ml-4 text-lg">Carregando símbolos...</p>
      </div>
    );
  }

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
        <h1 className="text-xl font-bold text-center flex-1 mr-10">{title}</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-24">
        {symbols.map((item) => (
          <Card
            key={item.id}
            className={`p-4 flex flex-col items-center justify-center cursor-pointer transition-all 
              ${item.id && selectedItems.includes(item.id) ? 'ring-4 ring-blue-400 bg-blue-50' : 'bg-white'}
              hover:bg-gray-50 hover:shadow-md`}
            onClick={() => handleItemClick(item)}
          >
            <div className="h-20 w-20 flex items-center justify-center bg-gray-100 rounded-full mb-2">
              <DynamicIcon name={item.imageUrl} className="h-10 w-10 text-gray-600" />
            </div>
            <div className="text-center font-semibold text-sm">{item.name}</div>
            {item.id && selectedItems.includes(item.id) && (
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
