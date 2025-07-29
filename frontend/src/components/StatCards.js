// src/components/StatCards.js
import React, { useContext } from 'react';
import ReceiptContext from '../context/receipt/receiptContext';

const StatCards = () => {
  const receiptContext = useContext(ReceiptContext);
  const { receipts } = receiptContext;

  // Calculate stats
  const monthlySpend = receipts
    .filter(r => new Date(r.transaction_date).getMonth() === new Date().getMonth())
    .reduce((acc, r) => acc + parseFloat(r.amount), 0);

  const transactionCount = receipts.length;

  const averageTransaction = transactionCount > 0 ? monthlySpend / transactionCount : 0;

  return (
    <div className="stat-cards-grid">
      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#e0f2fe' }}>
          <i className="fas fa-wallet" style={{ color: '#0ea5e9' }}></i>
        </div>
        <div className="stat-info">
          <p>Total Spend (This Month)</p>
          <h3>₹{monthlySpend.toFixed(2)}</h3>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#dcfce7' }}>
          <i className="fas fa-exchange-alt" style={{ color: '#22c55e' }}></i>
        </div>
        <div className="stat-info">
          <p>Total Transactions</p>
          <h3>{transactionCount}</h3>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon" style={{ background: '#fef3c7' }}>
          <i className="fas fa-divide" style={{ color: '#f59e0b' }}></i>
        </div>
        <div className="stat-info">
          <p>Average Transaction</p>
          <h3>₹{averageTransaction.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
