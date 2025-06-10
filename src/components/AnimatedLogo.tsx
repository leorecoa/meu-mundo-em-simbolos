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
      
      {/* Símbolo do infinito com profundidade */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg 
          width={iconSize} 
          height={iconSize * 0.6} 
          viewBox="0 0 100 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Sombra para profundidade */}
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="objectBoundingBox">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0000004d" />
          </filter>
          
          {/* Gradiente para profundidade */}
          <linearGradient id="infinityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          
          {/* Símbolo do infinito mais realista */}
          <path 
            d="M25 30C25 41.046 16.046 50 5 50C-0.52285 50 -5 45.5228 -5 40C-5 34.4772 -0.52285 30 5 30C10.5228 30 15 34.4772 15 40C15 45.5228 10.5228 50 5 50C16.046 50 25 41.046 25 30ZM75 30C75 18.954 83.954 10 95 10C100.523 10 105 14.4772 105 20C105 25.5228 100.523 30 95 30C89.4772 30 85 25.5228 85 20C85 14.4772 89.4772 10 95 10C83.954 10 75 18.954 75 30ZM5 30C16.046 10 83.954 10 95 30C83.954 50 16.046 50 5 30Z" 
            fill="url(#infinityGradient)"
            filter="url(#shadow)"
          />
          
          {/* Efeito 3D - sombra interna */}
          <path 
            d="M5 32C16.046 14 83.954 14 95 32" 
            stroke="rgba(0,0,0,0.2)" 
            strokeWidth="3" 
            strokeLinecap="round"
          />
          
          {/* Destaque para mais profundidade */}
          <path 
            d="M5 28C16.046 8 83.954 8 95 28" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round"
            strokeOpacity="0.7"
          />
          
          {/* Reflexo adicional */}
          <path 
            d="M20 25C30 15 70 15 80 25" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            strokeOpacity="0.4"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};