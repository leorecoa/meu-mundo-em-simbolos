import { useState, useEffect } from 'react';
import type { Symbol as DbSymbol } from '@/lib/db';

interface SymbolDisplayProps {
  symbol: DbSymbol;
}

export const SymbolDisplay = ({ symbol }: SymbolDisplayProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (symbol.image && symbol.image instanceof Blob) {
      const url = URL.createObjectURL(symbol.image);
      setImageUrl(url);
      // Limpa a URL do objeto quando o componente é desmontado
      return () => URL.revokeObjectURL(url);
    } else {
      setImageUrl(null);
    }
  }, [symbol.image]);

  if (imageUrl) {
    return <img src={imageUrl} alt={symbol.text} className="w-full h-full object-cover" />;
  }

  return (
    <span className="text-lg sm:text-xl font-bold text-center px-1 break-words">
      {symbol.text}
    </span>
  );
};
