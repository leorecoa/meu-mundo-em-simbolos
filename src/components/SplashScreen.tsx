import { useEffect } from 'react';
import { AnimatedInfinitySymbol } from './AnimatedInfinitySymbol'; // Importando nosso novo componente

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); // Aumentando ligeiramente a duração para a nova animação ser apreciada

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="h-screen w-screen flex flex-col items-center justify-center bg-[#1E1E1E] animate-in fade-in duration-500"
    >
      <div className="relative z-10 flex flex-col items-center text-white">
        {/* Usando o novo símbolo animado */}
        <AnimatedInfinitySymbol className="w-48 h-24 animate-pulse-slow" /> 
        <p className="text-xl font-semibold mt-6 tracking-wider animate-in fade-in delay-500 duration-1000">Carregando seu mundo...</p>
      </div>
    </div>
  );
};
