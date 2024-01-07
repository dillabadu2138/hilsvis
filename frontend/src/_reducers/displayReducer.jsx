const initialState = {
  // TODO: 나중에 viewport 값 추가 일단 객체로 만듬
  view: { type: 'MapView' },
  basemap: { map_style: 'outdoors-v12' },
  coastline: 'ne_50m_clipped',
};

const displayReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_BASEMAP':
      return {
        ...state,
        basemap: { ...state.basemap, map_style: action.payload },
      };
    case 'UPDATE_VIEW':
      return {
        ...state,
        view: { ...state.view, type: action.payload },
      };
    case 'UPDATE_COASTLINE':
      return {
        ...state,
        coastline: action.payload,
      };
    default:
      return state;
  }
};

export default displayReducer;
