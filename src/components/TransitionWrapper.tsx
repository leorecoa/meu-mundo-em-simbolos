import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TransitionWrapperProps {
  children: ReactNode;
}

export const TransitionWrapper = ({ children }: TransitionWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};