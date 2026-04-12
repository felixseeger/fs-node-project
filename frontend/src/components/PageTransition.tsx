import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

const spatialVariants = {
  initial: { opacity: 0, scale: 0.96, y: 15 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1.04, y: -15 },
};

const noiseVariants = {
  initial: { opacity: 0.15 },
  animate: { opacity: 0.03, transition: { duration: 0.8, ease: "easeOut" } },
  exit: { opacity: 0.15, transition: { duration: 0.4, ease: "easeIn" } },
};

const spatialTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

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
      <motion.div
        variants={noiseVariants}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
        }}
      />
      {children}
    </motion.div>
  );
};

export default PageTransition;
