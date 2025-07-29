// src/components/receipts/ReceiptFilter.js
import React, { useContext, useRef, useEffect } from 'react';
import ReceiptContext from '../../context/receipt/receiptContext';

const ReceiptFilter = () => {
  const receiptContext = useContext(ReceiptContext);
  const text = useRef('');

  const { filterReceipts, clearFilter, filtered } = receiptContext;

  useEffect(() => {
    if (filtered === null) {
      text.current.value = '';
    }
  });

  const onChange = (e) => {
    if (text.current.value !== '') {
      filterReceipts(e.target.value);
    } else {
      clearFilter();
    }
  };

  return (
    <form>
      <input
        ref={text}
        type='text'
        placeholder='Filter Receipts...'
        onChange={onChange}
      />
    </form>
  );
};

export default ReceiptFilter;
