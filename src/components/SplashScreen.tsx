import { useEffect } from 'react';
import { AnimatedInfinitySymbol } from './AnimatedInfinitySymbol';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    // Aumenta o tempo para que a animação completa seja apreciada
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    // 1. Fundo com gradiente, exatamente como no SVG
    <div 
      className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 animate-in fade-in duration-500"
    >
      <div className="relative z-10 flex flex-col items-center text-white">
        
        {/* 2. Símbolo do infinito profissional no lugar do círculo verde */}
        <AnimatedInfinitySymbol className="w-40 h-20 animate-pulse-slow mb-8" /> 
        
        {/* 3. Textos com a mesma fonte e animação de entrada */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-in fade-in slide-in-from-bottom-5 delay-300 duration-1000">
          Meu Mundo em Símbolos
        </h1>
        <p className="text-lg md:text-xl font-light mt-3 animate-in fade-in slide-in-from-bottom-5 delay-500 duration-1000">
          Tecnologia inclusiva para que todas as vozes sejam compreendidas
        </p>

      </div>
    </div>
  );
};
