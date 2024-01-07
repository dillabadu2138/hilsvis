const initialState = {
  loading: true,
  datasets: [],
  dataset: null,
  error: null,
};

const datasetReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DATASETS': {
      return {
        ...state,
        datasets: action.payload,
        loading: false,
      };
    }
    case 'CLEAR_ALL_DATASETS': {
      return {
        ...state,
        datasets: [],
        loading: true,
        error: null,
      };
    }
    case 'SELECT_DATASET': {
      return {
        ...state,
        datasets: [],
        dataset: action.payload,
        error: null,
      };
    }
    case 'DESELECT_DATASET': {
      return {
        ...state,
        datasets: [],
        dataset: null,
        error: null,
      };
    }
    default:
      return state;
  }
};

export default datasetReducer;
