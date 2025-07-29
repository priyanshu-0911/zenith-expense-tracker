// src/context/goals/GoalState.js
import React, { useReducer } from 'react';
import GoalContext from './goalContext';
import GoalReducer from './goalReducer';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const GoalState = (props) => {
  const initialState = {
    goals: [],
    loading: true,
    error: null,
  };

  const [state, dispatch] = useReducer(GoalReducer, initialState);

  // Get Goals
  const getGoals = async () => {
    try {
      const res = await api.get('/goals');
      dispatch({ type: 'GET_GOALS_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ type: 'GOAL_ERROR', payload: err.response?.data?.msg });
    }
  };

  // Add a new Goal
  const addGoal = async (goalData) => {
    try {
      const res = await api.post('/goals', goalData);
      dispatch({ type: 'ADD_GOAL_SUCCESS', payload: res.data });
      toast.success('New goal created!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Could not create goal');
      dispatch({ type: 'GOAL_ERROR', payload: err.response?.data?.msg });
    }
  };

  // Add savings to a goal
  const addSavingsToGoal = async (goalId, amount) => {
    try {
        const res = await api.put(`/goals/${goalId}/add-savings`, { amount });
        dispatch({ type: 'ADD_SAVINGS_SUCCESS', payload: res.data });
        toast.success(`$${amount} added to your goal!`);
    } catch (err) {
        toast.error(err.response?.data?.msg || 'Could not add savings');
        dispatch({ type: 'GOAL_ERROR', payload: err.response?.data?.msg });
    }
  };

  return (
    <GoalContext.Provider
      value={{
        goals: state.goals,
        loading: state.loading,
        error: state.error,
        getGoals,
        addGoal,
        addSavingsToGoal,
      }}
    >
      {props.children}
    </GoalContext.Provider>
  );
};

export default GoalState;