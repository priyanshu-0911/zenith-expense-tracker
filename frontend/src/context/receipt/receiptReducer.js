const receiptReducer = (state, action) => {
  switch (action.type) {
    case 'GET_RECEIPTS_SUCCESS':
      return {
        ...state,
        receipts: action.payload,
        loading: false,
        error: null,
      };
    case 'ADD_RECEIPT_SUCCESS':
      return {
        ...state,
        receipts: [action.payload, ...state.receipts], // Add to top of the list
        loading: false,
      };
    case 'UPDATE_RECEIPT_SUCCESS':
      return {
        ...state,
        receipts: state.receipts.map((receipt) =>
          receipt.id === action.payload.id ? action.payload : receipt
        ),
        loading: false,
      };
    case 'DELETE_RECEIPT_SUCCESS':
      return {
        ...state,
        receipts: state.receipts.filter(
          (receipt) => receipt.id !== action.payload
        ),
        loading: false,
      };
    case 'SET_CURRENT':
      return {
        ...state,
        current: action.payload,
      };
    case 'CLEAR_CURRENT':
      return {
        ...state,
        current: null,
      };
    case 'GET_RECEIPTS_FAIL':
    case 'ADD_RECEIPT_FAIL':
    case 'UPDATE_RECEIPT_FAIL':
    case 'DELETE_RECEIPT_FAIL':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default receiptReducer;