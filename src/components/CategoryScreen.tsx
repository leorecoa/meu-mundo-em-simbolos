import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Symbol as DbSymbol } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Search, PlusCircle, Award, Frown, Loader2 } from 'lucide-react'; // Adicionado ícones
import { useProfile } from '@/contexts/ProfileContext';
import { useToast } from '@/hooks/use-toast';

interface CategoryScreenProps {
  category: string;
  onBack: () => void;
  onNavigateToPhrase: (symbolId: number) => void;
  onNavigateToAddSymbol: () => void;
}

const SymbolDisplay = ({ symbol }: { symbol: DbSymbol }) => { /* ...código... */ return null; };
const colorMap: { [key: string]: { bg: string, text: string, hover: string, imageOverlay: string, shadow: string } } = {
  sky: { bg: 'bg-gradient-to-br from-sky-400 to-blue-600', text: 'text-white', hover: 'hover:from-sky-500 hover:to-blue-700', imageOverlay: 'from-transparent to-sky-900/70', shadow: 'shadow-xl shadow-sky-200/50' },
  rose: { bg: 'bg-gradient-to-br from-rose-400 to-red-500', text: 'text-white', hover: 'hover:from-rose-500 hover:to-red-600', imageOverlay: 'from-transparent to-rose-900/70', shadow: 'shadow-xl shadow-rose-200/50' },
  amber: { bg: 'bg-gradient-to-br from-amber-400 to-yellow-600', text: 'text-white', hover: 'hover:from-amber-500 hover:to-yellow-700', imageOverlay: 'from-transparent to-amber-900/70', shadow: 'shadow-xl shadow-amber-200/50' },
  emerald: { bg: 'bg-gradient-to-br from-emerald-400 to-green-600', text: 'text-white', hover: 'hover:from-emerald-500 hover:to-green-700', imageOverlay: 'from-transparent to-emerald-900/70', shadow: 'shadow-xl shadow-emerald-200/50' },
  orange: { bg: 'bg-gradient-to-br from-orange-400 to-yellow-500', text: 'text-white', hover: 'hover:from-orange-500 hover:to-yellow-600', imageOverlay: 'from-transparent to-orange-900/70', shadow: 'shadow-xl shadow-orange-200/50' },
  slate: { bg: 'bg-gradient-to-br from-slate-400 to-zinc-600', text: 'text-white', hover: 'hover:from-slate-500 hover:to-zinc-700', imageOverlay: 'from-transparent to-slate-900/70', shadow: 'shadow-xl shadow-slate-200/50' },
  blue: { bg: 'bg-gradient-to-br from-blue-400 to-indigo-600', text: 'text-white', hover: 'hover:from-blue-500 hover:to-indigo-700', imageOverlay: 'from-transparent to-blue-900/70', shadow: 'shadow-xl shadow-blue-200/50' },
  pink: { bg: 'bg-gradient-to-br from-pink-400 to-rose-600', text: 'text-white', hover: 'hover:from-pink-500 hover:to-rose-700', imageOverlay: 'from-transparent to-pink-900/70', shadow: 'shadow-xl shadow-pink-200/50' },
  green: { bg: 'bg-gradient-to-br from-green-400 to-lime-600', text: 'text-white', hover: 'hover:from-green-500 hover:to-lime-700', imageOverlay: 'from-transparent to-green-900/70', shadow: 'shadow-xl shadow-green-200/50' },
  default: { bg: 'bg-gradient-to-br from-gray-400 to-gray-600', text: 'text-white', hover: 'hover:from-gray-500 hover:to-gray-700', imageOverlay: 'from-transparent to-gray-900/70', shadow: 'shadow-xl shadow-gray-200/50' }
};

// --- Componentes de Estado ---
const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <p className="text-lg font-medium">Carregando símbolos...</p>
    </div>
);

const EmptyState = ({ onAddClick }: { onAddClick: () => void }) => (
    <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400 bg-black/10 rounded-lg p-6">
        <Frown className="h-12 w-12 mb-4" />
        <h3 className="text-xl font-bold mb-2 text-white">Categoria Vazia</h3>
        <p className="mb-4">Não há símbolos aqui ainda. Que tal adicionar o primeiro?</p>
        <Button onClick={onAddClick}><PlusCircle className="mr-2 h-4 w-4" /> Adicionar Símbolo</Button>
    </div>
);


export const CategoryScreen = ({ category, onBack, onNavigateToPhrase, onNavigateToAddSymbol }: CategoryScreenProps) => {
  const { activeProfileId } = useProfile();
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // useLiveQuery agora retorna undefined enquanto carrega
  const data = useLiveQuery(async () => {
    if (!activeProfileId) return null;
    const lowerSearchTerm = searchTerm.toLowerCase();
    const symbolsQuery = db.symbols.where({ profileId: activeProfileId, categoryKey: category });
    const filteredSymbols = await symbolsQuery.filter(s => s.text.toLowerCase().includes(lowerSearchTerm)).toArray();
    const sortedSymbols = filteredSymbols.sort((a, b) => a.order - b.order);
    const cat = await db.categories.where({ profileId: activeProfileId, key: category }).first();
    return { symbols: sortedSymbols, categoryColor: cat?.color || 'default' };
  }, [category, searchTerm, activeProfileId]);
  
  useEffect(() => { /* ...código de gamificação... */ }, [category, toast]);
  
  const handleSymbolClick = async (symbol: DbSymbol) => { /* ...código... */ };

  const getSymbolColor = () => { return colorMap[data?.categoryColor || 'default'] || colorMap.default; };

  const renderGrid = () => {
    if (data === undefined) { // Estado de carregamento inicial
      return <LoadingState />;
    }
    if (data === null || data.symbols.length === 0) { // Categoria vazia ou nula
      return <EmptyState onAddClick={onNavigateToAddSymbol} />;
    }

    return (
        <Card className="shadow-xl bg-black/30">
          <CardContent className="p-2 sm:p-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
              {data.symbols.map(symbol => {
                const colors = getSymbolColor();
                return (<Button key={symbol.id} onClick={() => handleSymbolClick(symbol)} variant="outline" className={`relative h-24 sm:h-28 font-bold p-0 ${colors.bg} ${colors.text} ${colors.hover} ${colors.shadow} transition-all hover:scale-105`}><SymbolDisplay symbol={symbol} />{symbol.image && <div className={`absolute inset-0 bg-gradient-to-t ${colors.imageOverlay}`}></div>}<span className="absolute bottom-1 right-2 text-xs">{symbol.image ? symbol.text : ''}</span></Button>)
              })}
            </div>
          </CardContent>
        </Card>
    );
  };

  return (
    <div className="p-2 sm:p-4 md:p-6 min-h-screen font-sans">
      <header className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={onBack}><ChevronLeft />Voltar</Button>
        <h1 className="text-lg sm:text-xl font-bold text-white capitalize">{category}</h1>
        <Button variant="ghost" onClick={onNavigateToAddSymbol}><PlusCircle />Adicionar</Button>
      </header>
      <main>
        <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-100/80 rounded-lg pl-10 pr-4 py-2" /></div>
        {renderGrid()}
      </main>
    </div>
  );
};
