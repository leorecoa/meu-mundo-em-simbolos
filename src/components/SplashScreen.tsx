
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeout(onComplete, 1000); // Aguardar a animação de saída terminar
    }, 3000); // Mostrar splash por 3 segundos

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
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
            {/* Imagem do símbolo do infinito 3D azul */}
            <motion.img
              src="/lovable-uploads/e3f113b1-11eb-4777-bff3-164fac8b0f28.png"
              alt="Símbolo do Infinito 3D"
              className="w-48 h-auto drop-shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
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
          
          {/* Símbolo do infinito animado na parte inferior */}
          <motion.div
            className="absolute bottom-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.div
              animate={{ 
                rotateY: [0, 180, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.img
                src="/lovable-uploads/e3f113b1-11eb-4777-bff3-164fac8b0f28.png"
                alt="Símbolo do Infinito 3D"
                className="w-20 h-auto drop-shadow-xl"
              />
            </motion.div>
          </motion.div>
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
    </AnimatePresence>
  );
};
