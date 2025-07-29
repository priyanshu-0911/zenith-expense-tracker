// src/components/ui/GlassCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const GlassCard = ({ 
  children, 
  className, 
  interactive = false, 
  onClick,
  ...props 
}) => {
  const cardVariants = {
    hover: {
      y: -4,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.div
      className={clsx(
        'glass',
        interactive && 'glass-interactive cursor-pointer',
        className
      )}
      variants={interactive ? cardVariants : undefined}
      whileHover={interactive ? "hover" : undefined}
      whileTap={interactive ? "tap" : undefined}
      onClick={onClick}
      layout
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Glass Button Component
export const GlassButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick,
  disabled = false,
  className,
  ...props 
}) => {
  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 }
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-500',
    secondary: 'bg-gradient-to-r from-teal-500 to-cyan-500',
    ghost: 'bg-transparent border-2 border-white/20'
  };

  return (
    <motion.button
      className={clsx(
        'glass-interactive rounded-lg font-semibold text-white',
        'transition-all duration-300 disabled:opacity-50',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      variants={buttonVariants}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default GlassCard;
