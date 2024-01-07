const initialState = {
  loading: true,
  tidal_currents: [],
  tidal_currents_selected: [],
  tidal_currents_display_setting: {
    radius_min_pixels: 2,
    fill_color: [0, 0, 0], // black
    arrow_color_flood_tide: [255, 0, 0], // red
    arrow_color_ebb_tide: [0, 0, 255], // blue
    text_visible: true,
    picking: false,
  },
  tidal_currents_filter_setting: {
    show_flood: true,
    show_ebb: true,
    obs_period: 'all',
  },
  error: null,
};

const conditionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_TIDAL_CURRENTS': {
      return { ...state, loading: false, tidal_currents: action.payload };
    }
    case 'CLEAR_ALL_TIDAL_CURRENTS_SEARCH': {
      return {
        ...state,
        loading: true,
        tidal_currents: [],
      };
    }
    case 'SELECT_TIDAL_CURRENTS': {
      return {
        ...state,
        loading: true,
        tidal_currents: [],
        tidal_currents_selected: action.payload,
        error: null,
      };
    }
    case 'DELETE_ALL_TIDAL_CURRENTS': {
      return {
        ...state,
        tidal_currents_selected: {
          json_data: null,
          binary_data: null,
        },
      };
    }
    case 'UPDATE_RADIUS_MIN_PIXELS': {
      return {
        ...state,
        tidal_currents_display_setting: {
          ...state.tidal_currents_display_setting,
          radius_min_pixels: action.payload,
        },
      };
    }
    case 'UPDATE_FILL_COLOR': {
      return {
        ...state,
        tidal_currents_display_setting: {
          ...state.tidal_currents_display_setting,
          fill_color: action.payload,
        },
      };
    }
    case 'UPDATE_ARROW_COLOR_FLOOD_TIDE': {
      return {
        ...state,
        tidal_currents_display_setting: {
          ...state.tidal_currents_display_setting,
          arrow_color_flood_tide: action.payload,
        },
      };
    }
    case 'UPDATE_ARROW_COLOR_EBB_TIDE': {
      return {
        ...state,
        tidal_currents_display_setting: {
          ...state.tidal_currents_display_setting,
          arrow_color_ebb_tide: action.payload,
        },
      };
    }
    case 'TOGGLE_TEXT_VISIBILITY': {
      return {
        ...state,
        tidal_currents_display_setting: {
          ...state.tidal_currents_display_setting,
          text_visible: action.payload,
        },
      };
    }
    case 'TOGGLE_PICKING_TIDAL_CURRENT': {
      return {
        ...state,
        tidal_currents_display_setting: {
          ...state.tidal_currents_display_setting,
          picking: action.payload,
        },
      };
    }
    case 'TOGGLE_FLOOD_VISIBILITY': {
      return {
        ...state,
        tidal_currents_filter_setting: {
          ...state.tidal_currents_filter_setting,
          show_flood: action.payload,
        },
      };
    }
    case 'TOGGLE_EBB_VISIBILITY': {
      return {
        ...state,
        tidal_currents_filter_setting: {
          ...state.tidal_currents_filter_setting,
          show_ebb: action.payload,
        },
      };
    }
    case 'UPDATE_OBS_PERIOD': {
      return {
        ...state,
        tidal_currents_filter_setting: {
          ...state.tidal_currents_filter_setting,
          obs_period: action.payload,
        },
      };
    }
    default:
      return state;
  }
};

export default conditionReducer;
