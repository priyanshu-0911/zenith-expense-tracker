// src/context/funds/fundReducer.js
const fundReducer = (state, action) => {
  switch (action.type) {
    case 'GET_FUNDS_SUCCESS':
      return {
        ...state,
        funds: action.payload,
        loading: false,
      };
    case 'ADD_FUND_SUCCESS':
      return {
        ...state,
        funds: [action.payload, ...state.funds],
      };
    case 'FUND_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default fundReducer;