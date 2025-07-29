// src/context/funds/FundState.js
import React, { useReducer } from 'react';
import FundContext from './fundContext';
import FundReducer from './fundReducer';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const FundState = (props) => {
  const initialState = {
    funds: [],
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(FundReducer, initialState);

  // Get all Funds
  const getFunds = async () => {
    try {
      const res = await api.get('/funds');
      dispatch({ type: 'GET_FUNDS_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'FUND_ERROR', payload: err.response?.data?.msg });
    }
  };

  // Add a new Fund
  const addFund = async (fundData) => {
    try {
      const res = await api.post('/funds', fundData);
      dispatch({ type: 'ADD_FUND_SUCCESS', payload: res.data });
      toast.success('New Fund created!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not create Fund');
      dispatch({ type: 'FUND_ERROR', payload: err.response?.data?.msg });
    }
  };

  return (
    <FundContext.Provider
      value={{
        funds: state.funds,
        loading: state.loading,
        error: state.error,
        getFunds,
        addFund,
      }}
    >
      {props.children}
    </FundContext.Provider>
  );
};

export default FundState;