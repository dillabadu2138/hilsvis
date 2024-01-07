const initialState = {
  loading: true,
  typhoons: [],
  typhoons_selected: [],
  typhoons_display_setting: {
    line_color: [0, 0, 0], // black
    line_width: 1,
    icon_size: 20,
    picking: false,
  },
  error: null,
};

const dangerReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_TYPHOONS': {
      return {
        ...state,
        loading: false,
        typhoons: action.payload,
      };
    }
    case 'CLEAR_ALL_TYPHOONS_SEARCH': {
      return {
        ...state,
        loading: true,
        typhoons: [],
      };
    }
    case 'SELECT_TYPHOONS': {
      return {
        ...state,
        loading: true,
        typhoons: [],
        typhoons_selected: action.payload,
        error: null,
      };
    }
    case 'DELETE_ALL_TYPHOONS': {
      return {
        ...state,
        typhoons_selected: [],
      };
    }
    case 'DELETE_TYPHOON_BY_TYPHOON_ID': {
      return {
        ...state,
        typhoons_selected: state.typhoons_selected.filter(
          (item) => item.typhoon_id !== action.payload
        ),
      };
    }
    case 'GET_PATHS_BY_TYPHOON': {
      return {
        ...state,
        loading: false,
      };
    }
    case 'UPDATE_LINE_COLOR': {
      return {
        ...state,
        typhoons_display_setting: { ...state.typhoons_display_setting, line_color: action.payload },
      };
    }
    case 'UPDATE_LINE_WIDTH': {
      return {
        ...state,
        typhoons_display_setting: { ...state.typhoons_display_setting, line_width: action.payload },
      };
    }
    case 'UPDATE_ICON_SIZE': {
      return {
        ...state,
        typhoons_display_setting: { ...state.typhoons_display_setting, icon_size: action.payload },
      };
    }
    case 'TOGGLE_PICKING_TYPHOON': {
      return {
        ...state,
        typhoons_display_setting: { ...state.typhoons_display_setting, picking: action.payload },
      };
    }
    default:
      return state;
  }
};

export default dangerReducer;
