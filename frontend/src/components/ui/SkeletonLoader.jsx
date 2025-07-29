// src/components/ui/SkeletonLoader.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SkeletonLoader = ({ width = '100%', height = '20px', className = '' }) => {
  return (
    <motion.div
      className={`skeleton-loader ${className}`}
      style={{
        width,
        height,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
        borderRadius: '4px'
      }}
      animate={{
        backgroundPosition: ['200% 0', '-200% 0']
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );
};

export const ChartSkeleton = () => (
  <div className="glass p-6">
    <SkeletonLoader width="60%" height="24px" className="mb-6 mx-auto" />
    <div className="flex justify-center items-center" style={{ height: '300px' }}>
      <div className="relative">
        <SkeletonLoader width="200px" height="200px" className="rounded-full" />
        <SkeletonLoader width="100px" height="100px" className="rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <SkeletonLoader width="12px" height="12px" className="rounded-full" />
          <SkeletonLoader width="120px" height="16px" />
          <SkeletonLoader width="60px" height="16px" className="ml-auto" />
        </div>
      ))}
    </div>
  </div>
);

export default SkeletonLoader;
