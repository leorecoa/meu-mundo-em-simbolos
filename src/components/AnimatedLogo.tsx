import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  size?: number;
  className?: string;
}

export const AnimatedLogo = ({ size = 120, className = '' }: AnimatedLogoProps) => {
  const iconSize = size * 0.5;
  
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    >
      {/* Círculos concêntricos */}
      <motion.div 
        className="absolute inset-0 rounded-full bg-blue-600"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute inset-[10%] rounded-full bg-blue-500"
        animate={{ scale: [1, 1.07, 1] }}
        transition={{ duration: 3, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute inset-[20%] rounded-full bg-blue-400"
        animate={{ scale: [1, 1.09, 1] }}
        transition={{ duration: 3, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute inset-[30%] rounded-full bg-white"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 3, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Símbolo do infinito simples (8 deitado) */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg 
          width={iconSize} 
          height={iconSize * 0.5} 
          viewBox="0 0 100 50" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Gradiente para o símbolo */}
          <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          
          {/* Símbolo do infinito simples (8 deitado) */}
          <path 
            d="M25 25C25 36.046 16.046 45 5 45C-0.52285 45 -5 40.5228 -5 35C-5 29.4772 -0.52285 25 5 25C10.5228 25 15 29.4772 15 35C15 40.5228 10.5228 45 5 45C16.046 45 25 36.046 25 25ZM75 25C75 13.954 83.954 5 95 5C100.523 5 105 9.47715 105 15C105 20.5228 100.523 25 95 25C89.4772 25 85 20.5228 85 15C85 9.47715 89.4772 5 95 5C83.954 5 75 13.954 75 25ZM5 25C16.046 5 83.954 5 95 25C83.954 45 16.046 45 5 25Z" 
            stroke="url(#infinityGradient)"
            strokeWidth="4"
            fill="none"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};