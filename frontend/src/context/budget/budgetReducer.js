// src/context/budget/budgetReducer.js

const budgetReducer = (state, action) => {
  switch (action.type) {
    // This action is dispatched when budgets are fetched successfully
    case 'GET_BUDGETS_SUCCESS':
      return {
        ...state,
        budgets: action.payload,
        loading: false,
        error: null,
      };
    
    // This action is dispatched when a new budget is created successfully
    case 'ADD_BUDGET_SUCCESS':
      return {
        ...state,
        // This correctly adds the new budget to the list in the UI
        budgets: [...state.budgets, action.payload],
        loading: false,
      };

    // These actions handle any errors from the API
    case 'GET_BUDGETS_FAIL':
    case 'ADD_BUDGET_FAIL':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
      
    default:
      return state;
  }
};

export default budgetReducer;