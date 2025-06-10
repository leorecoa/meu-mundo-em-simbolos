import { useState, useEffect, useRef } from 'react';

interface Symbol {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  rotation: number;
  velocityY: number;
}

export const BackgroundSymbols = () => {
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const requestRef = useRef<number>();
  const MAX_SYMBOLS = 100;
  const containerRef = useRef<HTMLDivElement>(null);

  // Função para criar um novo símbolo
  const createSymbol = () => {
    if (!containerRef.current) return null;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * width,
      y: -50, // Começa acima da tela
      size: Math.random() * 30 + 10,
      opacity: Math.random() * 0.5 + 0.1,
      rotation: Math.random() * 360,
      velocityY: Math.random() * 1 + 0.5
    };
  };

  // Função de animação usando requestAnimationFrame
  const animate = (time: number) => {
    setSymbols(prevSymbols => {
      if (!containerRef.current) return prevSymbols;
      
      const height = containerRef.current.clientHeight;
      
      // Atualizar posições dos símbolos existentes
      const updatedSymbols = prevSymbols.map(symbol => ({
        ...symbol,
        y: symbol.y + symbol.velocityY,
        rotation: symbol.rotation + 0.2
      })).filter(symbol => symbol.y < height + 100); // Remover símbolos que saíram da tela
      
      // Adicionar novos símbols se necessário
      if (Math.random() > 0.95 && updatedSymbols.length < MAX_SYMBOLS) {
        const newSymbol = createSymbol();
        if (newSymbol) {
          updatedSymbols.push(newSymbol);
        }
      }
      
      // Se exceder o limite, remover os mais antigos
      if (updatedSymbols.length > MAX_SYMBOLS) {
        return updatedSymbols.slice(updatedSymbols.length - MAX_SYMBOLS);
      }
      
      return updatedSymbols;
    });
    
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {symbols.map(symbol => (
        <div
          key={symbol.id}
          className="absolute"
          style={{
            left: `${symbol.x}px`,
            top: `${symbol.y}px`,
            width: `${symbol.size}px`,
            height: `${symbol.size * 0.5}px`,
            opacity: symbol.opacity,
            transform: `rotate(${symbol.rotation}deg)`,
          }}
        >
          <svg
            viewBox="0 0 100 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25 25C25 36.046 16.046 45 5 45C-0.52285 45 -5 40.5228 -5 35C-5 29.4772 -0.52285 25 5 25C10.5228 25 15 29.4772 15 35C15 40.5228 10.5228 45 5 45C16.046 45 25 36.046 25 25ZM75 25C75 13.954 83.954 5 95 5C100.523 5 105 9.47715 105 15C105 20.5228 100.523 25 95 25C89.4772 25 85 20.5228 85 15C85 9.47715 89.4772 5 95 5C83.954 5 75 13.954 75 25ZM5 25C16.046 5 83.954 5 95 25C83.954 45 16.046 45 5 25Z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};