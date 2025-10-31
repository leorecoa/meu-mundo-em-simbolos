import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Symbol as DbSymbol } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';

interface CategoryScreenProps {
  category: string;
  onBack: () => void;
  onNavigateToPhrase: () => void;
}

// --- Componente de Símbolo Reutilizável ---
const SymbolDisplay = ({ symbol }: { symbol: DbSymbol }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (symbol.image) {
      const url = URL.createObjectURL(symbol.image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [symbol.image]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      {imageUrl ? (
        <img src={imageUrl} alt={symbol.text} className="w-full h-full object-cover" />
      ) : (
        <span className="text-lg sm:text-xl font-bold text-center px-1">{symbol.text}</span>
      )}
    </div>
  );
};

const colorMap: { [key: string]: { bg: string, text: string, hover: string, imageOverlay: string } } = {
  rose: { bg: 'bg-rose-500/80', text: 'text-white', hover: 'hover:bg-rose-600/90', imageOverlay: 'from-rose-900/50' },
  amber: { bg: 'bg-amber-500/80', text: 'text-white', hover: 'hover:bg-amber-600/90', imageOverlay: 'from-amber-900/50' },
  sky: { bg: 'bg-sky-500/80', text: 'text-white', hover: 'hover:bg-sky-600/90', imageOverlay: 'from-sky-900/50' },
  slate: { bg: 'bg-slate-500/80', text: 'text-white', hover: 'hover:bg-slate-600/90', imageOverlay: 'from-slate-900/50' },
  default: { bg: 'bg-white/70', text: 'text-slate-800', hover: 'hover:bg-white/90', imageOverlay: 'from-black/30' },
};

export const CategoryScreen = ({ category, onBack, onNavigateToPhrase }: CategoryScreenProps) => {
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
                    onClick={onNavigateToPhrase}
                    variant="outline" 
                    className={`relative h-24 sm:h-28 text-lg sm:text-xl font-bold shadow-lg border-none transition-transform hover:scale-105 p-0 overflow-hidden ${colors.bg} ${colors.text} ${colors.hover}`}>
                    <SymbolDisplay symbol={symbol} />
                    {symbol.image && <div className={`absolute inset-0 bg-gradient-to-t ${colors.imageOverlay} to-transparent`}></div>}
                    <span className="absolute bottom-1 right-2 text-xs font-bold">{symbol.image ? symbol.text : ''}</span>
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
