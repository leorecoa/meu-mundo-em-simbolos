import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface MainCategoriesScreenProps {
  onNavigateToCategory: (categoryKey: string) => void;
  onNavigateToPhrase: () => void;
}

export const MainCategoriesScreen = ({ onNavigateToCategory, onNavigateToPhrase }: MainCategoriesScreenProps) => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['mainCategories'],
    queryFn: () => getCategories(), // Busca todas as categorias
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-10 w-10" /></div>;
  }

  // Filtra para mostrar apenas as categorias principais, se necessário
  const mainCategories = categories.filter(c => ['quero', 'sinto', 'preciso'].includes(c.key));

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Meu Mundo em Símbolos</h1>
      <div className="grid grid-cols-1 gap-4">
        {mainCategories.map(category => (
          <Button 
            key={category.id}
            className="w-full h-24 text-xl" 
            onClick={() => onNavigateToCategory(category.key)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      <div className="pt-4">
        <Button 
          className="w-full h-20 text-lg" 
          variant="outline" 
          onClick={onNavigateToPhrase}
        >
          Montar Frase Livre
        </Button>
      </div>
    </div>
  );
};
