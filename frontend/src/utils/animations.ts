import { Variants } from 'framer-motion';

/**
 * Shared Framer Motion variants for Cyberpunk/Blueprint UI transitions.
 * These variants provide a consistent, snappy, high-tech feel across
 * custom node dropdowns, modals, and edge reveals.
 */

// ── Dropdown / List Reveals ──

export const cyberContainerVariants: Variants = {
  hidden: {
    opacity: 0,
    scaleY: 0.8,
    transformOrigin: 'top center',
    filter: 'blur(4px)'
  },
  visible: {
    opacity: 1,
    scaleY: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1], // Custom snappy ease-out
      when: 'beforeChildren',
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    scaleY: 0.9,
    filter: 'blur(2px)',
    transition: {
      duration: 0.15,
      ease: 'easeIn',
      when: 'afterChildren',
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
};

export const cyberItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -10,
    color: 'var(--color-text-muted)'
  },
  visible: { 
    opacity: 1, 
    x: 0,
    color: 'var(--color-text)',
    transition: { 
      duration: 0.15, 
      ease: 'easeOut' 
    } 
  },
  exit: { 
    opacity: 0, 
    x: 10,
    transition: { duration: 0.1 } 
  },
  hover: {
    x: 4,
    color: 'var(--color-brand-cyan)',
    backgroundColor: 'var(--color-brand-cyan-soft)',
    transition: { duration: 0.1 }
  },
  tap: {
    scale: 0.98,
    color: 'var(--color-text)',
    backgroundColor: 'var(--color-brand-cyan-subtle)',
    transition: { duration: 0.05 }
  }
};

// ── Selection / Confirmation Glitch Effect ──

export const glitchVariants: Variants = {
  idle: {
    x: 0,
    opacity: 1,
    filter: 'hue-rotate(0deg)'
  },
  glitch: {
    x: [-2, 2, -2, 2, 0],
    opacity: [1, 0.8, 1, 0.9, 1],
    filter: [
      'hue-rotate(0deg)', 
      'hue-rotate(90deg)', 
      'hue-rotate(-90deg)', 
      'hue-rotate(0deg)'
    ],
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
      times: [0, 0.2, 0.4, 0.6, 1]
    }
  }
};
