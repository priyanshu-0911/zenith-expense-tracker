// src/context/goals/goalReducer.js
const goalReducer = (state, action) => {
  switch (action.type) {
    case 'GET_GOALS_SUCCESS':
      return {
        ...state,
        goals: action.payload,
        loading: false,
      };
    case 'ADD_GOAL_SUCCESS':
      return {
        ...state,
        goals: [...state.goals, action.payload],
      };
    case 'ADD_SAVINGS_SUCCESS':
      return {
        ...state,
        goals: state.goals.map(goal =>
          goal.id === action.payload.id ? action.payload : goal
        ),
      };
    case 'GOAL_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default goalReducer;