import axios from 'axios';

// get all tidal currents
export const getAllTidalCurrents = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/tidal_current');

    dispatch({
      type: 'GET_ALL_TIDAL_CURRENTS',
      payload: res.data,
    });
  } catch (err) {
    console.log(err);
  }
};

// select tidal currents
export const selectTidalCurrents = (rows) => async (dispatch) => {
  try {
    dispatch({
      type: 'SELECT_TIDAL_CURRENTS',
      payload: rows,
    });
  } catch (err) {
    console.log(err);
  }
};

// delete tidal current by id
export const deleteTidalCurrentById = (id) => async (dispatch) => {
  try {
  } catch (err) {
    console.log(err);
  }
};

// update radius min pixels
export const updateRadiusMinPixels = (pixels) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_RADIUS_MIN_PIXELS',
      payload: pixels,
    });
  } catch (err) {
    console.log(err);
  }
};

// update fill color
export const updateFillColor = (color) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_FILL_COLOR',
      payload: color,
    });
  } catch (err) {
    console.log(err);
  }
};

// update arrow color for flood tide
export const updateArrowColorFloodTide = (color) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_ARROW_COLOR_FLOOD_TIDE',
      payload: color,
    });
  } catch (err) {
    console.log(err);
  }
};

// update arrow color for flood tide
export const updateArrowColorEbbTide = (color) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_ARROW_COLOR_EBB_TIDE',
      payload: color,
    });
  } catch (err) {
    console.log(err);
  }
};

// toggle text visibility
export const toggleTextVisibility = (boolean) => (dispatch) => {
  try {
    dispatch({
      type: 'TOGGLE_TEXT_VISIBILITY',
      payload: boolean,
    });
  } catch (err) {
    console.log(err);
  }
};

// toggle picking
export const togglePickingTidalCurrent = (boolean) => (dispatch) => {
  try {
    dispatch({
      type: 'TOGGLE_PICKING_TIDAL_CURRENT',
      payload: boolean,
    });
  } catch (err) {
    console.log(err);
  }
};

// toggle flood visibility
export const toggleFloodVisibility = (boolean) => async (dispatch) => {
  try {
    dispatch({
      type: 'TOGGLE_FLOOD_VISIBILITY',
      payload: boolean,
    });
  } catch (err) {
    console.log(err);
  }
};

// toggle ebb visibility
export const toggleEbbVisibility = (boolean) => async (dispatch) => {
  try {
    dispatch({
      type: 'TOGGLE_EBB_VISIBILITY',
      payload: boolean,
    });
  } catch (err) {
    console.log(err);
  }
};

// update observation period
export const updateObsPeriod = (period) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_OBS_PERIOD',
      payload: period,
    });
  } catch (err) {
    console.log(err);
  }
};
