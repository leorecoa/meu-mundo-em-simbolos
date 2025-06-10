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
      
      {/* Símbolo do infinito */}
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
          className="text-blue-600"
        >
          <path 
            d="M30 30C30 41.046 21.046 50 10 50C4.47715 50 0 45.5228 0 40C0 34.4772 4.47715 30 10 30C15.5228 30 20 34.4772 20 40C20 45.5228 15.5228 50 10 50C21.046 50 30 41.046 30 30ZM70 30C70 18.954 78.954 10 90 10C95.5228 10 100 14.4772 100 20C100 25.5228 95.5228 30 90 30C84.4772 30 80 25.5228 80 20C80 14.4772 84.4772 10 90 10C78.954 10 70 18.954 70 30ZM10 30C21.046 10 78.954 10 90 30C78.954 50 21.046 50 10 30Z" 
            fill="currentColor"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};