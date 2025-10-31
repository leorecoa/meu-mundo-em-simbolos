import { useLiveQuery } from 'dexie-react-hooks';
import { db, Symbol as DbSymbol } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

interface CategoryScreenProps {
  category: string;
  onBack: () => void;
  onNavigateToPhrase: () => void; // Adicionado para navegação
}

// Mapeamento de cores para os botões de símbolo
const colorMap: { [key: string]: { bg: string, text: string, hover: string } } = {
  rose: { bg: 'bg-rose-500/80', text: 'text-white', hover: 'hover:bg-rose-600/90' },
  amber: { bg: 'bg-amber-500/80', text: 'text-white', hover: 'hover:bg-amber-600/90' },
  sky: { bg: 'bg-sky-500/80', text: 'text-white', hover: 'hover:bg-sky-600/90' },
  slate: { bg: 'bg-slate-500/80', text: 'text-white', hover: 'hover:bg-slate-600/90' },
  default: { bg: 'bg-white/70', text: 'text-slate-800', hover: 'hover:bg-white/90' },
};

export const CategoryScreen = ({ category, onBack, onNavigateToPhrase }: CategoryScreenProps) => {
  // Busca os símbolos e categorias do banco de dados
  const data = useLiveQuery(async () => {
    const symbols = await db.symbols.where('categoryKey').equals(category).toArray();
    const cat = await db.categories.where('key').equals(category).first();
    return { symbols, categoryColor: cat?.color || 'default' };
  }, [category]);

  const getSymbolColor = () => {
    return colorMap[data?.categoryColor || 'default'] || colorMap.default;
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen font-sans">
      <header className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-1 text-sm sm:text-base text-slate-200 font-semibold">
          <ChevronLeft className="h-5 w-5" />
          Voltar
        </Button>
        <h1 className="text-lg sm:text-xl font-bold text-white capitalize">{category}</h1>
        <div className="w-16 sm:w-24"></div>
      </header>

      <main>
        <Card className="shadow-xl bg-black/30 border-white/10">
          <CardContent className="p-2 sm:p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
              {data?.symbols.map(symbol => {
                const colors = getSymbolColor();
                return (
                  <Button 
                    key={symbol.id} 
                    // Ao clicar em um símbolo, navega para o PhraseBuilder (a ser implementado)
                    onClick={onNavigateToPhrase}
                    variant="outline" 
                    className={`h-24 sm:h-28 text-lg sm:text-xl font-bold shadow-lg border-none transition-transform hover:scale-105 ${colors.bg} ${colors.text} ${colors.hover}`}>
                    {symbol.text}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
