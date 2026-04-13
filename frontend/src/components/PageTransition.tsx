import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';

const spatialVariants: Variants = {
  initial: { scale: 0.96, opacity: 0, y: 15 },
  animate: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 1.04, opacity: 0, y: -15 },
};

const spatialTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={spatialVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={spatialTransition}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
