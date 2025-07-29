// src/components/charts/SpendingOrbit.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RadialBarChart, 
  RadialBar, 
  Legend, 
  Tooltip,
  ResponsiveContainer,
  PolarAngleAxis 
} from 'recharts';
import GlassCard from '../ui/GlassCard';

// Custom tooltip for the radial chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        className="glass"
        style={{ padding: '1rem', minWidth: '200px' }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <p style={{ color: 'var(--nebula-text-primary)', fontWeight: 'bold' }}>
          {payload[0].payload.category}
        </p>
        <p style={{ color: 'var(--nebula-secondary)' }}>
          Amount: ${payload[0].value.toLocaleString()}
        </p>
        <p style={{ color: 'var(--nebula-text-secondary)', fontSize: '0.9rem' }}>
          {payload[0].payload.percentage}% of total spending
        </p>
      </motion.div>
    );
  }
  return null;
};

// Animated legend component
const AnimatedLegend = ({ data }) => {
  return (
    <motion.div 
      className="orbit-legend"
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.5rem',
        marginTop: '1rem'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, staggerChildren: 0.1 }}
    >
      {data.map((item, index) => (
        <motion.div
          key={item.category}
          className="legend-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)'
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ background: 'rgba(255, 255, 255, 0.1)' }}
        >
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: item.fill
            }}
          />
          <span style={{ color: 'var(--nebula-text-primary)', fontSize: '0.9rem' }}>
            {item.category}
          </span>
          <span style={{ color: 'var(--nebula-text-secondary)', fontSize: '0.8rem', marginLeft: 'auto' }}>
            ${item.amount.toLocaleString()}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};

const SpendingOrbit = ({ receipts }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Process receipt data into chart format
  useEffect(() => {
    if (!receipts || receipts.length === 0) return;

    const categoryTotals = receipts.reduce((acc, receipt) => {
      const category = receipt.category || 'Other';
      acc[category] = (acc[category] || 0) + parseFloat(receipt.total || 0);
      return acc;
    }, {});

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    const colors = [
      '#8A2BE2', '#4FD1C5', '#FF6B6B', '#4ECDC4', '#45B7D1', 
      '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];

    const processedData = Object.entries(categoryTotals)
      .map(([category, amount], index) => ({
        category,
        amount,
        percentage: ((amount / total) * 100).toFixed(1),
        fill: colors[index % colors.length],
        // Normalize values for the radial chart (0-100 scale)
        value: Math.max((amount / total) * 100, 5) // Minimum 5% for visibility
      }))
      .sort((a, b) => b.amount - a.amount);

    setChartData(processedData);
  }, [receipts]);

  if (chartData.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-6xl mb-4">🌌</div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--nebula-text-primary)' }}>
            Your Financial Orbit Awaits
          </h3>
          <p style={{ color: 'var(--nebula-text-secondary)' }}>
            Add some receipts to see your spending patterns visualized as a beautiful orbital chart
          </p>
        </motion.div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: 'var(--nebula-text-primary)' }}
        >
          🌌 Spending Orbit
        </h2>
        
        <div style={{ height: '400px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="80%"
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis 
                type="number" 
                domain={[0, 100]} 
                angleAxisId={0} 
                tick={false} 
              />
              <RadialBar
                minAngle={15}
                label={{
                  position: 'insideStart',
                  fill: '#fff',
                  fontSize: 12,
                  formatter: (value, entry) => `${entry.category}`
                }}
                background
                clockWise
                dataKey="value"
                cornerRadius={4}
                onClick={(data) => setSelectedCategory(data)}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>

        <AnimatedLegend data={chartData} />

        {/* Selected category details */}
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              className="glass mt-4 p-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <h4 style={{ color: 'var(--nebula-primary)' }}>
                Selected: {selectedCategory.category}
              </h4>
              <p style={{ color: 'var(--nebula-text-secondary)' }}>
                This category represents {selectedCategory.percentage}% of your total spending
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </GlassCard>
  );
};

export default SpendingOrbit;
