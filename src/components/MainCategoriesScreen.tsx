import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Heart, Smile, HandHeart, MessageSquarePlus, Settings, Trophy } from 'lucide-react';
import React from 'react';
import { InfinitySymbol } from './InfinitySymbol';
import { useNavigation } from '@/contexts/NavigationContext'; // Importa o hook de navegação

// ... (const categoryDetails)

export const MainCategoriesScreen = () => {
  const { navigateTo } = useNavigation(); // Usa o hook para obter a função de navegação
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['mainCategories'],
    queryFn: getCategories,
  });

  // ... (loading state)

  const mainCategories = categories.filter(c => categoryDetails[c.key]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="relative flex items-center justify-between py-4 mb-10">
        {/* ... (cabeçalho com logo) */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigateTo('myat')} aria-label="Painel do Usuário">
            <Trophy className="h-6 w-6 text-gray-600 hover:text-blue-600" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map(category => {
          const details = categoryDetails[category.key];
          if (!details) return null;

          const Icon = details.icon;
          return (
            <Card 
              key={category.id} 
              className="cursor-pointer hover:shadow-xl ..." 
              onClick={() => navigateTo('category', category.key)} // Usa a função do context
            >
             {/* ... (Conteúdo do Card) */}
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Card 
          className="cursor-pointer ..." 
          onClick={() => navigateTo('phrase')} // Usa a função do context
        >
          {/* ... (Conteúdo do Card "Frase Livre") */}
        </Card>
      </div>
    </div>
  );
};
