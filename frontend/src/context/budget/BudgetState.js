// src/context/budget/BudgetState.js

import React, { useReducer } from 'react';
import BudgetContext from './budgetContext';
import BudgetReducer from './budgetReducer';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const BudgetState = (props) => {
  // All hooks (like useReducer) MUST be called at the top level of the component.
  const initialState = {
    budgets: [],
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(BudgetReducer, initialState);

  // --- Functions ---
  const getBudgets = async (month, year) => {
    try {
      const res = await api.get(`/budgets?month=${month}&year=${year}`);
      dispatch({ type: 'GET_BUDGETS_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'GET_BUDGETS_FAIL', payload: err.response?.data?.msg });
    }
  };

  const addBudget = async (budgetData) => {
    try {
      const res = await api.post('/budgets', budgetData);
      dispatch({ type: 'ADD_BUDGET_SUCCESS', payload: res.data });
      toast.success('Budget created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not create budget');
      dispatch({ type: 'ADD_BUDGET_FAIL', payload: err.response?.data?.msg });
    }
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets: state.budgets,
        loading: state.loading,
        error: state.error,
        getBudgets,
        addBudget,
      }}
    >
      {props.children}
    </BudgetContext.Provider>
  );
};

export default BudgetState;