
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
    const timer1 = setTimeout(() => setShowLogo(true), 200);
    const timer2 = setTimeout(() => setShowText(true), 800);
    const timer3 = setTimeout(() => setShowProgress(true), 1200);
    const timer4 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-green-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/4 right-20 w-24 h-24 bg-green-200/40 rounded-full blur-lg animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-300/20 rounded-full blur-2xl animate-pulse delay-500"></div>
        <div className="absolute bottom-32 right-1/3 w-28 h-28 bg-green-300/30 rounded-full blur-xl animate-pulse delay-700"></div>
      </div>

      {/* Main logo container */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo with infinity symbol */}
        <div 
          className={`transform transition-all duration-1000 ${
            showLogo ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          <div className="relative">
            {/* Infinity symbol made with two circles */}
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-2xl flex items-center justify-center relative">
                <MessageCircle className="w-8 h-8 text-white" />
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-blue-400/20 to-blue-600/20 animate-ping"></div>
              </div>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-2xl flex items-center justify-center relative -ml-6">
                <Heart className="w-8 h-8 text-white" />
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-green-400/20 to-green-600/20 animate-ping delay-300"></div>
              </div>
            </div>
          </div>
        </div>

        {/* App name and tagline */}
        <div 
          className={`text-center transform transition-all duration-1000 delay-300 ${
            showText ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 bg-clip-text text-transparent mb-2">
            ComunicAção
          </h1>
          <p className="text-lg text-slate-600 font-medium tracking-wide">
            Conectando corações através da comunicação
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Tecnologia de ponta para comunicação inclusiva
          </p>
        </div>

        {/* Loading indicator */}
        <div 
          className={`transform transition-all duration-1000 delay-700 ${
            showProgress ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-slate-500 animate-pulse">Inicializando experiência...</p>
          </div>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-blue-400 rounded-full animate-bounce`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};
