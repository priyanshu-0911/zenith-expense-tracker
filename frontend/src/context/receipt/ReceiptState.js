// src/context/receipt/ReceiptState.js

import React, { useReducer } from 'react';
import ReceiptContext from './receiptContext';
import ReceiptReducer from './receiptReducer';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const ReceiptState = (props) => {
  // All hooks (like useReducer) MUST be called at the top level of the component.
  const initialState = {
    receipts: [],
    current: null,
    filtered: null,
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(ReceiptReducer, initialState);

  // --- Functions ---
  const getReceipts = async () => {
    try {
      const res = await api.get('/receipts');
      dispatch({ type: 'GET_RECEIPTS_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'GET_RECEIPTS_FAIL', payload: err.response?.data?.msg });
    }
  };

  const addReceipt = async (receiptData) => {
    try {
      const res = await api.post('/receipts', receiptData);
      dispatch({ type: 'ADD_RECEIPT_SUCCESS', payload: res.data });
      toast.success('Transaction added!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not add transaction');
      dispatch({ type: 'ADD_RECEIPT_FAIL', payload: err.response?.data?.msg });
    }
  };

  const updateReceipt = async (receiptData) => {
    try {
      const res = await api.put(`/receipts/${receiptData.id}`, receiptData);
      dispatch({ type: 'UPDATE_RECEIPT_SUCCESS', payload: res.data });
      toast.success('Transaction updated!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not update transaction');
      dispatch({ type: 'UPDATE_RECEIPT_FAIL', payload: err.response?.data?.msg });
    }
  };

  const deleteReceipt = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await api.delete(`/receipts/${id}`);
        dispatch({ type: 'DELETE_RECEIPT_SUCCESS', payload: id });
        toast.success('Transaction deleted!');
      } catch (err) {
        toast.error(err.response?.data?.msg || 'Could not delete transaction');
        dispatch({ type: 'DELETE_RECEIPT_FAIL', payload: err.response?.data?.msg });
      }
    }
  };

  const setCurrent = (receipt) => dispatch({ type: 'SET_CURRENT', payload: receipt });
  const clearCurrent = () => dispatch({ type: 'CLEAR_CURRENT' });

  return (
    <ReceiptContext.Provider
      value={{
        receipts: state.receipts,
        current: state.current,
        filtered: state.filtered,
        loading: state.loading,
        error: state.error,
        getReceipts,
        addReceipt,
        updateReceipt,
        deleteReceipt,
        setCurrent,
        clearCurrent,
      }}
    >
      {props.children}
    </ReceiptContext.Provider>
  );
};

export default ReceiptState;