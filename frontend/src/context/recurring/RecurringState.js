// src/context/recurring/RecurringState.js

import React, { useReducer } from 'react';
import RecurringContext from './recurringContext';
import RecurringReducer from './recurringReducer';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const RecurringState = (props) => {
  const initialState = {
    recurringTransactions: [],
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(RecurringReducer, initialState);

  // Get Recurring Transactions
  const getRecurring = async () => {
    try {
      const res = await api.get('/recurring');
      dispatch({ type: 'GET_RECURRING_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'GET_RECURRING_FAIL', payload: err.response?.data?.msg });
    }
  };

  // Add Recurring Transaction Rule
  const addRecurring = async (recurringData) => {
    try {
      const res = await api.post('/recurring', recurringData);
      dispatch({ type: 'ADD_RECURRING_SUCCESS', payload: res.data });
      toast.success('Recurring transaction added!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not add rule');
      dispatch({ type: 'ADD_RECURRING_FAIL', payload: err.response?.data?.msg });
    }
  };

  // --- ADD THESE TWO NEW FUNCTIONS ---

  // Update Recurring Transaction Rule
  const updateRecurring = async (rule) => {
    try {
        const res = await api.put(`/recurring/${rule.id}`, rule);
        dispatch({ type: 'UPDATE_RECURRING_SUCCESS', payload: res.data });
        toast.success('Recurring rule updated!');
    } catch (err) {
        toast.error(err.response?.data?.msg || 'Could not update rule');
        dispatch({ type: 'UPDATE_RECURRING_FAIL', payload: err.response?.data?.msg });
    }
  };

  // Delete Recurring Transaction Rule
  const deleteRecurring = async (id) => {
    if (window.confirm('Are you sure you want to delete this recurring rule?')) {
        try {
            await api.delete(`/recurring/${id}`);
            dispatch({ type: 'DELETE_RECURRING_SUCCESS', payload: id });
            toast.success('Recurring rule deleted!');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Could not delete rule');
            dispatch({ type: 'DELETE_RECURRING_FAIL', payload: err.response?.data?.msg });
        }
    }
  };

  return (
    <RecurringContext.Provider
      value={{
        recurringTransactions: state.recurringTransactions,
        loading: state.loading,
        error: state.error,
        getRecurring,
        addRecurring,
        updateRecurring, // <-- Add to provider
        deleteRecurring, // <-- Add to provider
      }}
    >
      {props.children}
    </RecurringContext.Provider>
  );
};

export default RecurringState;