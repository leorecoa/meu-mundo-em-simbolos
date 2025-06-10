import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedLogo } from './AnimatedLogo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(onComplete, 1000); // Aguardar a animação de saída terminar
    }, 3000); // Mostrar splash por 3 segundos

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {showSplash && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <motion.div
              className="mb-8"
              animate={{ 
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 2, 
                ease: "easeInOut",
                repeat: Infinity
              }}
            >
              <AnimatedLogo size={160} />
            </motion.div>
            
            <motion.h1
              className="text-3xl font-bold text-white mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Meu Mundo em Símbolos
            </motion.h1>
            
            <motion.p
              className="text-white text-center max-w-xs px-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Tecnologia inclusiva para que todas as vozes sejam compreendidas
            </motion.p>
          </motion.div>
          
          <motion.div
            className="absolute bottom-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 1, duration: 2, repeat: Infinity }}
          >
            <div className="w-16 h-1 bg-white rounded-full"></div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};