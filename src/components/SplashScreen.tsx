
import { useState, useEffect } from 'react';
import { MessageCircle, Heart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLogo(true), 300);
    const timer2 = setTimeout(() => setShowText(true), 1000);
    const timer3 = setTimeout(() => setShowProgress(true), 1500);
    const timer4 = setTimeout(() => onComplete(), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-emerald-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorative elements inspired by the image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-16 w-40 h-40 bg-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-24 w-32 h-32 bg-emerald-200/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-24 left-1/3 w-48 h-48 bg-cyan-300/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-1/4 w-36 h-36 bg-emerald-300/25 rounded-full blur-2xl animate-pulse delay-700"></div>
        
        {/* Flowing organic shapes like in the image */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-cyan-200/10 to-transparent rounded-full transform -translate-x-32 -translate-y-32"></div>
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-200/10 to-transparent rounded-full transform translate-x-40"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-gradient-to-tr from-cyan-100/15 to-transparent rounded-full transform translate-y-36"></div>
      </div>

      {/* Main logo container */}
      <div className="relative z-10 flex flex-col items-center space-y-10">
        {/* Logo with infinity symbol inspired by the image */}
        <div 
          className={`transform transition-all duration-1500 ease-out ${
            showLogo ? 'scale-100 opacity-100 rotate-0' : 'scale-75 opacity-0 rotate-12'
          }`}
        >
          <div className="relative">
            {/* Infinity symbol with overlapping circles like in the image */}
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-2xl flex items-center justify-center relative backdrop-blur-sm">
                <MessageCircle className="w-10 h-10 text-white drop-shadow-lg" />
                <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 animate-ping"></div>
              </div>
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl flex items-center justify-center relative -ml-8 backdrop-blur-sm">
                <Heart className="w-10 h-10 text-white drop-shadow-lg" />
                <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 animate-ping delay-500"></div>
              </div>
            </div>
            
            {/* Connecting element */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full shadow-lg"></div>
          </div>
        </div>

        {/* App name and tagline */}
        <div 
          className={`text-center transform transition-all duration-1500 delay-500 ease-out ${
            showText ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 via-cyan-700 to-emerald-600 bg-clip-text text-transparent mb-3 tracking-tight">
            Meu Mundo
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-emerald-700 to-cyan-600 bg-clip-text text-transparent mb-4 tracking-tight">
            em Símbolos
          </h2>
          <p className="text-xl text-slate-600 font-medium tracking-wide">
            Conectando corações através da comunicação
          </p>
          <p className="text-sm text-slate-500 mt-3">
            Tecnologia inclusiva para um mundo mais acessível
          </p>
        </div>

        {/* Loading indicator */}
        <div 
          className={`transform transition-all duration-1500 delay-1000 ease-out ${
            showProgress ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-56 h-3 bg-slate-200/60 rounded-full overflow-hidden shadow-inner backdrop-blur-sm">
              <div className="h-full bg-gradient-to-r from-cyan-500 via-emerald-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
            </div>
            <p className="text-sm text-slate-500 animate-pulse font-medium">Inicializando experiência mágica...</p>
          </div>
        </div>
      </div>

      {/* Floating particles with organic movement */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${i % 2 === 0 ? 'bg-cyan-400/40' : 'bg-emerald-400/40'} rounded-full animate-bounce shadow-lg`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Subtle glow effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 pointer-events-none"></div>
    </div>
  );
};
