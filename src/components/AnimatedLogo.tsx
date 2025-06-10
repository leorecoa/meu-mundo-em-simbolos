
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  size?: number;
  className?: string;
}

export const AnimatedLogo = ({ size = 120, className = '' }: AnimatedLogoProps) => {
  const iconSize = size * 0.7;
  
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Fundo com efeito de profundidade */}
      <motion.div 
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(96, 165, 250, 0.3), rgba(34, 197, 94, 0.2), transparent 70%)',
          filter: 'blur(20px)'
        }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Símbolo do infinito 3D baseado na imagem */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        animate={{ 
          rotateY: [0, 360],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        <svg 
          width={iconSize} 
          height={iconSize * 0.5} 
          viewBox="0 0 200 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-2xl"
        >
          <defs>
            {/* Gradientes para efeito 3D */}
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
            
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#84CC16" />
              <stop offset="50%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
            
            {/* Filtros para sombra e profundidade */}
            <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3"/>
              <feOffset dx="2" dy="2" result="offset"/>
              <feFlood floodColor="#000000" floodOpacity="0.3"/>
              <feComposite in2="offset" operator="in"/>
            </filter>
            
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Círculo azul (lado esquerdo) */}
          <motion.circle 
            cx="50" 
            cy="50" 
            r="35"
            fill="url(#blueGradient)"
            filter="url(#glow)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          />
          
          {/* Círculo verde (lado direito) */}
          <motion.circle 
            cx="150" 
            cy="50" 
            r="35"
            fill="url(#greenGradient)"
            filter="url(#glow)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          />
          
          {/* Conexão central - parte do infinito */}
          <motion.path
            d="M 85 50 Q 100 30, 115 50 Q 100 70, 85 50"
            fill="url(#blueGradient)"
            opacity="0.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
          />
          
          {/* Ícone de mensagem no círculo azul */}
          <motion.g
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <rect x="40" y="40" width="20" height="14" rx="3" fill="white" opacity="0.9"/>
            <path d="M42 42h16M42 46h12M42 50h8" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round"/>
          </motion.g>
          
          {/* Ícone de coração no círculo verde */}
          <motion.g
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <path 
              d="M150 42c-2.5-2.5-6.5-2.5-9 0l-1 1-1-1c-2.5-2.5-6.5-2.5-9 0-2.5 2.5-2.5 6.5 0 9l10 10 10-10c2.5-2.5 2.5-6.5 0-9z" 
              fill="white" 
              opacity="0.9"
            />
          </motion.g>
          
          {/* Efeitos de brilho */}
          <motion.ellipse
            cx="50"
            cy="35"
            rx="15"
            ry="8"
            fill="rgba(255,255,255,0.3)"
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.ellipse
            cx="150"
            cy="35"
            rx="15"
            ry="8"
            fill="rgba(255,255,255,0.3)"
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>
      
      {/* Partículas flutuantes */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-60"
            style={{
              top: `${20 + (i * 10)}%`,
              left: `${15 + (i * 12)}%`,
            }}
            animate={{
              y: [-5, 5, -5],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2 + (i * 0.3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};
