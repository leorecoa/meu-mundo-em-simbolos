import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Heart, Smile, HandHeart, MessageSquarePlus } from 'lucide-react'; // Ícone do Troféu removido
import React from 'react';
import { useProfile } from '@/contexts/ProfileContext';

// Caminho da imagem corrigido
const InfinityImage = () => (
  <img src="/infinity-symbol.png" alt="Símbolo do Infinito" className="h-10 w-auto" />
);

interface MainCategoriesScreenProps {
  onNavigateToCategory: (category: string) => void;
  onNavigateToPhrase: () => void;
  // Prop para navegar para o painel removida
}

const categoryDetails: { [key: string]: { icon: React.ElementType, description: string, gradient: string } } = {
  quero: { icon: Heart, description: 'Expresse seus desejos e vontades.', gradient: 'from-rose-500 to-fuchsia-600' },
  sinto: { icon: Smile, description: 'Comunique seus sentimentos e emoções.', gradient: 'from-yellow-400 to-orange-500' },
  preciso: { icon: HandHeart, description: 'Informe suas necessidades imediatas.', gradient: 'from-sky-400 to-cyan-500' },
};

export const MainCategoriesScreen = ({ onNavigateToCategory, onNavigateToPhrase }: MainCategoriesScreenProps) => {
  const { activeProfileId } = useProfile();
  const categories = useLiveQuery(() => 
    activeProfileId ? db.categories.where('profileId').equals(activeProfileId).toArray() : [], 
  [activeProfileId]);

  if (!categories) {
    return <div className="flex flex-col justify-center items-center h-screen"><Loader2 className="h-12 w-12 text-blue-600 animate-spin" /></div>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <header className="relative flex items-center justify-between py-4 mb-10">
        <div className="flex items-center gap-3">
          <InfinityImage />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Meu Mundo em Símbolos</h1>
        </div>
        {/* Seção do botão de troféu completamente removida */}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map(category => {
          if (category.key === 'geral') return null;
          const details = categoryDetails[category.key];
          if (!details) return null;
          const Icon = details.icon;
          return (
            <Card key={category.id} className="cursor-pointer h-full hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 bg-white border-gray-200 shadow-lg" onClick={() => onNavigateToCategory(category.key)}>
              <CardHeader className="items-center text-center pointer-events-none"><div className={`p-4 rounded-full bg-gradient-to-br ${details.gradient}`}><Icon className="h-10 w-10 text-white" /></div><CardTitle className="text-2xl font-semibold mt-4 text-gray-800">{category.name}</CardTitle></CardHeader>
              <CardContent className="pointer-events-none"><CardDescription className="text-center text-base text-gray-600">{details.description}</CardDescription></CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <Card className="cursor-pointer hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 p-4 bg-white border-gray-200 shadow-lg" onClick={onNavigateToPhrase}>
          <div className="flex items-center justify-center pointer-events-none"><MessageSquarePlus className="h-8 w-8 text-green-500 mr-4"/><div><h2 className="text-xl font-semibold text-gray-800">Frase Livre</h2><p className="text-gray-500">Monte suas próprias frases do zero.</p></div></div>
        </Card>
      </div>
    </div>
  );
};
