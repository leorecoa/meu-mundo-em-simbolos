import { motion } from 'framer-motion';
import { MessageSquare, Heart, Star } from 'lucide-react';

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
      
      {/* Ícone central */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <MessageSquare className="text-blue-600" style={{ width: iconSize, height: iconSize }} />
      </motion.div>
      
      {/* Ícones orbitando */}
      <motion.div
        className="absolute"
        style={{ width: size, height: size }}
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <motion.div 
          className="absolute"
          style={{ 
            top: size * 0.1, 
            left: size * 0.1,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Heart className="text-red-500" size={size * 0.15} />
        </motion.div>
      </motion.div>
      
      <motion.div
        className="absolute"
        style={{ width: size, height: size }}
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <motion.div 
          className="absolute"
          style={{ 
            bottom: size * 0.1, 
            right: size * 0.1,
            transform: 'translate(50%, 50%)'
          }}
        >
          <Star className="text-yellow-400" size={size * 0.15} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};