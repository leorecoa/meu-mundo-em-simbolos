import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WebSplashProps {
  duration?: number;
}

export const WebSplash = ({ duration = 3000 }: WebSplashProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-40 h-40 mb-8">
              {/* Círculos concêntricos */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-blue-500"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="absolute inset-[15%] rounded-full bg-blue-400"
                animate={{ scale: [1, 1.07, 1] }}
                transition={{ duration: 2, delay: 0.2, repeat: Infinity }}
              />
              <motion.div 
                className="absolute inset-[30%] rounded-full bg-blue-300"
                animate={{ scale: [1, 1.09, 1] }}
                transition={{ duration: 2, delay: 0.4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute inset-[45%] rounded-full bg-white"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, delay: 0.6, repeat: Infinity }}
              />
              
              {/* Símbolo do infinito */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <svg 
                  width="60" 
                  height="30" 
                  viewBox="0 0 100 50" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25 25C25 36.046 16.046 45 5 45C-0.52285 45 -5 40.5228 -5 35C-5 29.4772 -0.52285 25 5 25C10.5228 25 15 29.4772 15 35C15 40.5228 10.5228 45 5 45C16.046 45 25 36.046 25 25ZM75 25C75 13.954 83.954 5 95 5C100.523 5 105 9.47715 105 15C105 20.5228 100.523 25 95 25C89.4772 25 85 20.5228 85 15C85 9.47715 89.4772 5 95 5C83.954 5 75 13.954 75 25ZM5 25C16.046 5 83.954 5 95 25C83.954 45 16.046 45 5 25Z"
                    stroke="white"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </motion.div>
            </div>
            
            <motion.h1
              className="text-2xl font-bold text-white mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Meu Mundo em Símbolos
            </motion.h1>
            
            <motion.p
              className="text-sm text-white text-center max-w-xs px-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
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