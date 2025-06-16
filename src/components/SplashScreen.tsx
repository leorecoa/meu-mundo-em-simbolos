
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete(); // Transição direta para a tela principal
    }, 2000); // Reduzido para 2 segundos para uma experiência mais rápida

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.1, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Imagem do símbolo do infinito 3D azul */}
          <motion.img
            src="/lovable-uploads/e3f113b1-11eb-4777-bff3-164fac8b0f28.png"
            alt="Símbolo do Infinito 3D"
            className="w-48 h-auto drop-shadow-2xl mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 1.5, 
              ease: "easeOut",
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
          
          <motion.h1
            className="text-3xl font-bold text-white mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Meu Mundo em Símbolos
          </motion.h1>
          
          <motion.p
            className="text-white text-center max-w-xs px-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Tecnologia inclusiva para que todas as vozes sejam compreendidas
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
