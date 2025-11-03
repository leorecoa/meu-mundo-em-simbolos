import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Symbol as DbSymbol } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Search, PlusCircle, Award } from 'lucide-react'; // Adicionado Award
import { useProfile } from '@/contexts/ProfileContext';
import { useToast } from '@/hooks/use-toast'; // Importar useToast

interface CategoryScreenProps {
  category: string;
  onBack: () => void;
  onNavigateToPhrase: (symbolId: number) => void;
  onNavigateToAddSymbol: () => void;
}

const SymbolDisplay = ({ symbol }: { symbol: DbSymbol }) => { /* ...código... */ return null; };
const colorMap: { [key: string]: { bg: string, text: string, hover: string, imageOverlay: string } } = { /* ...código... */ };

export const CategoryScreen = ({ category, onBack, onNavigateToPhrase, onNavigateToAddSymbol }: CategoryScreenProps) => {
  const { activeProfileId } = useProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const data = useLiveQuery(async () => { /* ...código... */ }, [category, searchTerm, activeProfileId]);
  
  useEffect(() => {
    const checkCategoryGoal = async () => {
      try {
        const goal = await db.dailyGoals.get('goal_categories');
        if (!goal || goal.completed) return;

        const visitedKey = 'visitedCategories';
        const visited: string[] = JSON.parse(sessionStorage.getItem(visitedKey) || '[]');
        
        if (!visited.includes(category)) {
          visited.push(category);
          sessionStorage.setItem(visitedKey, JSON.stringify(visited));

          const newCurrent = visited.length;
          if (newCurrent >= goal.target) {
            await db.dailyGoals.update(goal.id, { current: newCurrent, completed: true });
            await db.coins.where('id').equals(1).modify(c => { c.total += goal.reward; });
            toast({ title: 'Meta Cumprida!', description: `${goal.name} (+${goal.reward} moedas)`, action: <Award/> });
          } else {
            await db.dailyGoals.update(goal.id, { current: newCurrent });
          }
        }
      } catch (error) {
        console.error("Erro ao checar meta de categorias:", error);
      }
    };
    checkCategoryGoal();
  }, [category, toast]);
  
  const handleSymbolClick = async (symbol: DbSymbol) => {
    if (!symbol.id) return;
    try {
      await db.usageEvents.add({
        type: 'symbol_click',
        itemId: symbol.text,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Failed to log usage event:', error);
    }
    onNavigateToPhrase(symbol.id);
  };

  const getSymbolColor = () => { return colorMap[data?.categoryColor || 'default'] || colorMap.default; };

  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen font-sans">
      <header className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack}><ChevronLeft />Voltar</Button>
        <h1 className="text-lg sm:text-xl font-bold text-white capitalize">{category}</h1>
        <Button variant="ghost" onClick={onNavigateToAddSymbol}><PlusCircle />Adicionar</Button>
      </header>
      <main>
        <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-100/80 rounded-lg pl-10 pr-4 py-2" /></div>
        <Card className="shadow-xl bg-black/30">
          <CardContent className="p-2 sm:p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
              {data?.symbols.map(symbol => {
                const colors = getSymbolColor();
                return (<Button key={symbol.id} onClick={() => handleSymbolClick(symbol)} variant="outline" className={`relative h-24 sm:h-28 font-bold shadow-lg p-0 ${colors.bg} ${colors.text} ${colors.hover}`}><SymbolDisplay symbol={symbol} />{symbol.image && <div className={`absolute inset-0 bg-gradient-to-t ${colors.imageOverlay}`}></div>}<span className="absolute bottom-1 right-2 text-xs">{symbol.image ? symbol.text : ''}</span></Button>)
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
