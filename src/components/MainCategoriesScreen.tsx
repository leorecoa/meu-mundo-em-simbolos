import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Heart, Smile, HandHeart, MessageSquarePlus, Trophy } from 'lucide-react';
import React from 'react';
import { InfinitySymbol } from './InfinitySymbol';

interface MainCategoriesScreenProps {
  onNavigateToCategory: (category: string) => void;
  onNavigateToPhrase: () => void;
  onNavigateToMyAT: () => void;
}

// Mapeamento de ícones e descrições para as categorias
const categoryDetails: { [key: string]: { icon: React.ElementType, description: string, gradient: string } } = {
  quero: { icon: Heart, description: 'Expresse seus desejos e vontades.', gradient: 'from-rose-500 to-pink-500' },
  sinto: { icon: Smile, description: 'Comunique seus sentimentos e emoções.', gradient: 'from-yellow-500 to-amber-500' },
  preciso: { icon: HandHeart, description: 'Informe suas necessidades imediatas.', gradient: 'from-sky-500 to-cyan-500' },
};

export const MainCategoriesScreen = ({ onNavigateToCategory, onNavigateToPhrase, onNavigateToMyAT }: MainCategoriesScreenProps) => {
  const categories = useLiveQuery(() => db.categories.toArray(), []);

  if (!categories) {
    // A tela de splash screen agora é gerenciada pelo App.tsx, aqui apenas um loader simples de fallback.
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <header className="relative flex items-center justify-between py-4 mb-10">
        <div className="flex items-center gap-3">
          <svg width="48" height="48" viewBox="0 0 100 50" className="h-10 w-auto">
            <defs>
              <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" />  {/* Rose 500 */}
                <stop offset="25%" stopColor="#f97316" /> {/* Orange 500 */}
                <stop offset="50%" stopColor="#eab308" /> {/* Yellow 500 */}
                <stop offset="75%" stopColor="#22c55e" /> {/* Green 500 */}
                <stop offset="100%" stopColor="#3b82f6" />{/* Blue 500 */}
              </linearGradient>
            </defs>
            <path 
              d="M 25,25 C 25,0 75,0 75,25 C 75,50 25,50 25,25 Z M 75,25 C 75,0 125,0 125,25 C 125,50 75,50 75,25 Z"
              stroke="url(#rainbow)"
              strokeWidth="12"
              fill="none"
              transform="scale(0.8) translate(-12, 0)"
            />
          </svg>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Meu Mundo em Símbolos</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onNavigateToMyAT} aria-label="Painel do Usuário">
            <Trophy className="h-6 w-6 text-slate-300 hover:text-white" />
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map(category => {
          if (category.key === 'geral') return null;
          
          const details = categoryDetails[category.key];
          if (!details) return null;
          const Icon = details.icon;
          return (
            // Card com fundo semi-transparente, sem blur
            <Card 
              key={category.id} 
              className="cursor-pointer h-full hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 bg-black/30 border-white/10 shadow-lg text-white" 
              onClick={() => onNavigateToCategory(category.key)}
            >
              <CardHeader className="items-center text-center pointer-events-none">
                <div className={`p-4 rounded-full bg-gradient-to-br ${details.gradient}`}>
                  <Icon className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-semibold mt-4">{category.name}</CardTitle>
              </CardHeader>
              <CardContent className="pointer-events-none">
                <CardDescription className="text-center text-base text-slate-300">{details.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        {/* Card de Frase Livre com fundo semi-transparente */}
        <Card 
          className="cursor-pointer hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 p-4 bg-black/30 border-white/10 shadow-lg text-white" 
          onClick={onNavigateToPhrase} 
        >
          <div className="flex items-center justify-center pointer-events-none">
            <MessageSquarePlus className="h-8 w-8 text-green-400 mr-4"/>
            <div>
              <h2 className="text-xl font-semibold">Frase Livre</h2>
              <p className="text-slate-300">Monte suas próprias frases do zero.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
