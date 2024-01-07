const initialState = {
  loading: true,
  checked_layers: [],
  error: null,
};

const characteristicReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHECK_CHARACTERISTIC': {
      return { ...state, checked_layers: [...state.checked_layers, action.payload] };
    }
    case 'UNCHECK_CHARACTERISTIC_BY_ID': {
      return {
        ...state,
        checked_layers: state.checked_layers.filter((item) => item.id !== action.payload),
      };
    }
    default:
      return state;
  }
};

export default characteristicReducer;
