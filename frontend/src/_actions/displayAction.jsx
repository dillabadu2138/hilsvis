// update basemap
export const updateBasemap = (value) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_BASEMAP',
      payload: value,
    });
  } catch (err) {
    console.log(err);
  }
};

// update view
export const updateView = (value) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_VIEW',
      payload: value,
    });
  } catch (err) {
    console.log(err);
  }
};

// update coastline
export const updateCoastline = (value) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_COASTLINE',
      payload: value,
    });
  } catch (err) {
    console.log(err);
  }
};
