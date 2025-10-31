import { useEffect } from 'react';
import { InfinitySymbol } from './InfinitySymbol';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    // Simula um tempo de carregamento e depois chama onComplete
    const timer = setTimeout(() => {
      onComplete();
    }, 2500); // Duração de 2.5 segundos

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className="h-screen w-screen flex flex-col items-center justify-center bg-cover bg-center animate-in fade-in duration-500"
      style={{ backgroundImage: "url('/lovable-uploads/e3f113b1-11eb-4777-bff3-164fac8b0f28.png')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div> {/* Sobreposição escura */}
      <div className="relative z-10 flex flex-col items-center text-white">
        <InfinitySymbol className="h-24 w-24 text-white animate-pulse" />
        <p className="text-xl font-semibold mt-4 tracking-wider">Carregando seu mundo...</p>
      </div>
    </div>
  );
};
