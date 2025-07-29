// src/components/layout/AnimatedLayout.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 1, 1]
    }
  }
};

const childVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

const AnimatedLayout = ({ children }) => {
  const location = useLocation();
  
  return (
    <motion.div
      key={location.pathname}
      className="animated-page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        minHeight: '100vh',
        padding: '2rem',
        position: 'relative'
      }}
    >
      <motion.div variants={childVariants}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedLayout;
