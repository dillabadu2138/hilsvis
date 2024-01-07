const initialState = {
  opacity: 100, // TODO: 나중에 스칼라랑 벡터로 구분
  sband_raster: {},
  mband_raster: {},
  mband_data_array: [],
  scalar_variable: {
    var_name: 'temp',
    time_id: 1,
    min: 0,
    max: 35,
    scheme: 'Blues',
    title: '수온(°C)',
    tickFormat: '.0f',
  },
  vector_variable: {
    var_name: 'none',
    time_id: 1,
  },
  grid_json_file: null,
};

const rasterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_SINGLE_BAND_RASTER': {
      return {
        ...state,
        sband_raster: action.payload,
      };
    }
    case 'GET_MULTI_BAND_RASTER': {
      return {
        ...state,
        mband_raster: action.payload,
      };
    }
    case 'UPDATE_MULTI_BAND_DATA_ARRAY': {
      return {
        ...state,
        mband_data_array: action.payload,
      };
    }
    case 'CLEAR_SINGLE_BAND_RASTER': {
      return {
        ...state,
        sband_raster: {},
      };
    }
    case 'CLEAR_MULTI_BAND_RASTER': {
      return {
        ...state,
        mband_raster: {},
        mband_data_array: [],
      };
    }
    case 'UPDATE_SCALAR_VARIABLE': {
      return {
        ...state,
        scalar_variable: {
          ...state.scalar_variable,
          var_name: action.payload.var_name,
          min: action.payload.min,
          max: action.payload.max,
          scheme: action.payload.scheme,
          title: action.payload.title,
          tickFormat: action.payload.tickFormat,
        },
      };
    }
    case 'UPDATE_VECTOR_VARIABLE': {
      return {
        ...state,
        vector_variable: { ...state.vector_variable, var_name: action.payload },
      };
    }
    case 'UPDATE_TIME_ID': {
      return {
        ...state,
        scalar_variable: { ...state.scalar_variable, time_id: action.payload },
        vector_variable: { ...state.vector_variable, time_id: action.payload },
      };
    }
    case 'UPDATE_OPACITY': {
      return {
        ...state,
        opacity: action.payload,
      };
    }
    case 'UPDATE_COLOR_SCHEME': {
      return {
        ...state,
        scalar_variable: { ...state.scalar_variable, scheme: action.payload },
      };
    }
    case 'UPDATE_DOMAIN_MIN_VALUE': {
      return {
        ...state,
        scalar_variable: { ...state.scalar_variable, min: action.payload },
      };
    }
    case 'UPDATE_DOMAIN_MAX_VALUE': {
      return {
        ...state,
        scalar_variable: { ...state.scalar_variable, max: action.payload },
      };
    }
    case 'UPDATE_GRID_JSON_FILE': {
      return {
        ...state,
        grid_json_file: action.payload,
      };
    }
    default:
      return state;
  }
};

export default rasterReducer;
