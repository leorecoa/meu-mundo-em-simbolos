import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Heart, Smile, HandHeart, MessageSquarePlus, Settings, Trophy } from 'lucide-react';
import React from 'react';

interface MainCategoriesScreenProps {
  onNavigateToCategory: (categoryKey: string) => void;
  onNavigateToPhrase: () => void;
  onNavigateToMyAT: () => void;
}

const categoryDetails: { [key: string]: { icon: React.ElementType, description: string } } = {
  quero: { icon: Heart, description: 'Expresse seus desejos e vontades.' },
  sinto: { icon: Smile, description: 'Comunique seus sentimentos e emoções.' },
  preciso: { icon: HandHeart, description: 'Informe suas necessidades imediatas.' },
};

export const MainCategoriesScreen = ({ onNavigateToCategory, onNavigateToPhrase, onNavigateToMyAT }: MainCategoriesScreenProps) => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['mainCategories'],
    queryFn: getCategories,
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-12 w-12 text-blue-600" /></div>;
  }

  const mainCategories = categories.filter(c => categoryDetails[c.key]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="relative text-center mb-10">
        <div className="absolute top-0 right-0 flex gap-2">
          <Button variant="ghost" size="icon" onClick={onNavigateToMyAT}>
            <Trophy className="h-6 w-6 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onNavigateToMyAT}>
            <Settings className="h-6 w-6 text-gray-600" />
          </Button>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 tracking-tight">Meu Mundo em Símbolos</h1>
        <p className="text-lg text-gray-500 mt-2">Selecione uma categoria para começar a se comunicar.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mainCategories.map(category => {
          const details = categoryDetails[category.key];
          const Icon = details.icon;
          return (
            <Card key={category.id} className="cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300" onClick={() => onNavigateToCategory(category.key)}>
              <CardHeader className="items-center text-center">
                <div className="p-4 bg-blue-100 rounded-full">
                  <Icon className="h-10 w-10 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-semibold mt-4">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">{details.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Card className="cursor-pointer bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4" onClick={onNavigateToPhrase}>
          <div className="flex items-center justify-center">
            <MessageSquarePlus className="h-8 w-8 text-green-600 mr-4"/>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Frase Livre</h2>
              <p className="text-gray-500">Monte suas próprias frases do zero.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
