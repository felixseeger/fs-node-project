import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cyberContainerVariants, cyberItemVariants, glitchVariants } from '../utils/animations';

interface CyberDropdownProps {
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export default function CyberDropdown({
  options,
  value,
  onChange,
  label,
  className = ''
}: CyberDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  const handleSelect = (val: string) => {
    onChange(val);
    setIsGlitching(true);
    setTimeout(() => {
      setIsGlitching(false);
      setIsOpen(false);
    }, 300);
  };

  return (
    <div className={`relative ${className}`}>
      {label && <label className="block text-xs uppercase tracking-wider text-brand-cyan mb-1">{label}</label>}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-surface border border-border rounded px-3 py-2 text-sm text-text hover:border-brand-cyan transition-colors"
        variants={glitchVariants}
        animate={isGlitching ? 'glitch' : 'idle'}
      >
        <span>{selectedOption?.label}</span>
        <svg
          className={`w-4 h-4 text-brand-cyan transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            variants={cyberContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute z-50 w-full mt-1 bg-surface border border-brand-cyan rounded shadow-lg overflow-hidden"
            style={{ boxShadow: 'var(--glow-cyan)' }}
          >
            {options.map((option) => (
              <motion.li
                key={option.value}
                variants={cyberItemVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleSelect(option.value)}
                className={`px-3 py-2 text-sm cursor-pointer ${
                  option.value === value ? 'bg-brand-cyan-soft text-brand-cyan' : 'text-text-muted'
                }`}
              >
                {option.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
