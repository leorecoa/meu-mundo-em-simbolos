import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Heart, Smile, HandHeart, MessageSquarePlus, Settings, Trophy } from 'lucide-react';
import React from 'react';
import { InfinitySymbol } from './InfinitySymbol';

interface MainCategoriesScreenProps {
  onNavigateToCategory: (categoryKey: string) => void;
  onNavigateToPhrase: () => void;
  onNavigateToMyAT: () => void;
}

// ... (categoryDetails)

export const MainCategoriesScreen = ({ onNavigateToCategory, onNavigateToPhrase, onNavigateToMyAT }: MainCategoriesScreenProps) => {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['mainCategories'],
    queryFn: getCategories,
  });

  // ... (loading state)

  const mainCategories = categories.filter(c => categoryDetails[c.key]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* ... (header) */}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mainCategories.map(category => (
          <button key={category.id} onClick={() => onNavigateToCategory(category.key)} className="text-left w-full">
            <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              {/* ... (CardHeader e CardContent) */}
            </Card>
          </button>
        ))}
      </div>

      <div className="mt-12 text-center">
        <button onClick={onNavigateToPhrase} className="text-left w-full">
          <Card className="bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-4">
            <div className="flex items-center justify-center">
              <MessageSquarePlus className="h-8 w-8 text-green-600 mr-4"/>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Frase Livre</h2>
                <p className="text-gray-500">Monte suas próprias frases do zero.</p>
              </div>
            </div>
          </Card>
        </button>
      </div>
    </div>
  );
};
