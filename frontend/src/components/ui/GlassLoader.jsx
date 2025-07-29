// src/components/ui/GlassLoader.jsx
import React from 'react';
import { motion } from 'framer-motion';

const GlassLoader = () => {
  return (
    <div className="glass-loader">
      <motion.div 
        className="glass"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          zIndex: 1000
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <div className="star-animation">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="star"
              style={{
                width: '8px',
                height: '8px',
                background: 'var(--nebula-primary)',
                borderRadius: '50%',
                margin: '0 4px'
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        <p style={{ color: 'var(--nebula-text-primary)', fontSize: '1.2rem' }}>
          Loading Financial Nebula...
        </p>
      </motion.div>
    </div>
  );
};

export default GlassLoader;
