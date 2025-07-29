// src/context/recurring/recurringReducer.js

const recurringReducer = (state, action) => {
  switch (action.type) {
    case 'GET_RECURRING_SUCCESS':
      return {
        ...state,
        recurringTransactions: action.payload,
        loading: false,
      };
    case 'ADD_RECURRING_SUCCESS':
      return {
        ...state,
        recurringTransactions: [...state.recurringTransactions, action.payload],
      };
    case 'UPDATE_RECURRING_SUCCESS':
        return {
            ...state,
            recurringTransactions: state.recurringTransactions.map(rule =>
                rule.id === action.payload.id ? action.payload : rule
            ),
        };
    case 'DELETE_RECURRING_SUCCESS':
        return {
            ...state,
            recurringTransactions: state.recurringTransactions.filter(rule => rule.id !== action.payload),
        };
    case 'GET_RECURRING_FAIL':
    case 'ADD_RECURRING_FAIL':
    case 'UPDATE_RECURRING_FAIL':
    case 'DELETE_RECURRING_FAIL':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default recurringReducer;