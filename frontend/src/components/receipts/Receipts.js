// src/components/receipts/Receipts.js
import React, { useContext, useEffect } from 'react';
import ReceiptContext from '../../context/receipt/receiptContext';
import ReceiptItem from './ReceiptItem';
import { motion, AnimatePresence } from 'framer-motion';

const ReceiptsEmptyState = () => (
  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
    <i className="fas fa-receipt fa-3x" style={{ marginBottom: '1rem', opacity: 0.5 }}></i>
    <h4>No Transactions Yet</h4>
    <p>Add your first receipt using the form to see it here.</p>
  </div>
);

const ReceiptSkeleton = () => (
  <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', marginRight: '1rem' }}></div>
    <div style={{ flexGrow: 1 }}>
      <div style={{ height: '20px', width: '60%', background: '#e2e8f0', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
      <div style={{ height: '16px', width: '40%', background: '#e2e8f0', borderRadius: '4px' }}></div>
    </div>
    <div style={{ height: '24px', width: '80px', background: '#e2e8f0', borderRadius: '4px' }}></div>
  </div>
);

const Receipts = () => {
  const { receipts, filtered, getReceipts, loading } = useContext(ReceiptContext);

  useEffect(() => {
    getReceipts();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    // Optionally, render as many skeletons as you like
    return (
      <div>
        <ReceiptSkeleton />
        <ReceiptSkeleton />
        <ReceiptSkeleton />
      </div>
    );
  }

  const receiptsToDisplay = filtered || receipts;

  if (!receiptsToDisplay || receiptsToDisplay.length === 0) {
    return <ReceiptsEmptyState />;
  }

  return (
    <AnimatePresence>
      {receiptsToDisplay.map(receipt => (
        <motion.div
          key={receipt.id || receipt._id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -32, transition: { duration: 0.2 } }}
          layout
        >
          <ReceiptItem receipt={receipt} />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default Receipts;
