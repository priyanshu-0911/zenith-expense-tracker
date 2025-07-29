// src/context/category/categoryReducer.js

const categoryReducer = (state, action) => {
  switch (action.type) {
    case 'GET_CATEGORIES_SUCCESS':
      return {
        ...state,
        categories: action.payload,
        loading: false,
      };
    case 'ADD_CATEGORY_SUCCESS':
      return {
        ...state,
        categories: [...state.categories, action.payload].sort((a, b) => a.name.localeCompare(b.name)),
      };
    case 'UPDATE_CATEGORY_SUCCESS':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.payload.id ? action.payload : cat
        ).sort((a, b) => a.name.localeCompare(b.name)),
      };
    case 'DELETE_CATEGORY_SUCCESS':
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload),
      };
    case 'GET_CATEGORIES_FAIL':
    case 'ADD_CATEGORY_FAIL':
    case 'UPDATE_CATEGORY_FAIL':
    case 'DELETE_CATEGORY_FAIL':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default categoryReducer;