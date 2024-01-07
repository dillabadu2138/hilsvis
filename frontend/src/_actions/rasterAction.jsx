import axios from 'axios';
import { setAlert } from './alertAction';
import { parse as parseRaster } from '../utils/parseRaster';

// update a scalar variable
export const updateScalarVariable =
  (var_name, min, max, scheme, title, tickFormat) => (dispatch) => {
    try {
      dispatch({
        type: 'UPDATE_SCALAR_VARIABLE',
        payload: { var_name, min, max, scheme, title, tickFormat },
      });
    } catch (err) {
      console.log(err);
    }
  };

// update a vector variable
export const updateVectorVariable = (var_name) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_VECTOR_VARIABLE',
      payload: var_name,
    });
  } catch (err) {
    console.log(err);
  }
};

// update a time_id
export const updateTimeId = (time_id) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_TIME_ID',
      payload: time_id,
    });
  } catch (err) {
    console.log(err);
  }
};

// get a single-band raster
export const getSingleBandRaster = (dataset_id, var_name, time_id) => async (dispatch) => {
  try {
    // send a GET API request
    const res = await axios.get(`/api/data/wkb/${dataset_id}/var/${var_name}/time/${time_id}`, {
      responseType: 'arraybuffer',
    });

    if (res.status == 200) {
      // parse raster as a JavaScript object.
      const raster = await parseRaster(res.data);

      dispatch({
        type: 'GET_SINGLE_BAND_RASTER',
        payload: raster,
      });
    }
  } catch (err) {
    // clear the existing single band raster
    dispatch(clearSingleBandRaster());

    // handle errors
    if (err.response) {
      // the client was given an error response
      dispatch(setAlert(`${err.response.status} ${err.response.statusText}`, 'error'));
    } else if (err.request) {
      // the client never received a response, and the request was never left
      dispatch(setAlert(`${err.request}`, 'error'));
    } else {
      // anything else
      dispatch(setAlert(err.message, 'error'));
    }
  }
};

// get a multi-band raster
export const getMultiBandRaster = (dataset_id, var_name, time_id) => async (dispatch) => {
  try {
    // send a GET API request
    const res = await axios.get(`/api/data/wkb/${dataset_id}/var/${var_name}/time/${time_id}`, {
      responseType: 'arraybuffer',
    });

    if (res.status == 200) {
      // parse the raster as a JavaScript object
      const raster = await parseRaster(res.data);

      dispatch({
        type: 'GET_MULTI_BAND_RASTER',
        payload: raster,
      });

      // populate multi band data array
      if (raster) {
        const data = await createMultiBandDataArray(raster);

        dispatch({ type: 'UPDATE_MULTI_BAND_DATA_ARRAY', payload: data });
      }
    }
  } catch (err) {
    // clear the existing single band raster
    dispatch(clearMultiBandRaster());

    // handle errors
    if (err.response) {
      // the client was given an error response
      dispatch(setAlert(`${err.response.status} ${err.response.statusText}`, 'error'));
    } else if (err.request) {
      // the client never received a response, and the request was never left
      dispatch(setAlert(`${err.request}`, 'error'));
    } else {
      // anything else
      dispatch(setAlert(err.message, 'error'));
    }
  }
};

// create multi band data array
const createMultiBandDataArray = (raster) => {
  // destructure raster
  const {
    metadata: { ipX, ipY, scaleX, scaleY, width, height },
    bands,
  } = raster;

  // destructure bands
  const [
    { metadata: bandMetadataU, data: bandDataU },
    { metadata: bandMetadataV, data: bandDataV },
  ] = bands;

  // convert TypedArray to Array
  const dataU = Array.from(bandDataU);
  const dataV = Array.from(bandDataV);

  // create positions
  const positions = new Array(width * height * 3);
  for (let i = 0; i < width; ++i) {
    for (let j = 0; j < height; ++j) {
      const index = (i + j * width) * 3;
      positions[index + 0] = ipX + i * scaleX;
      positions[index + 1] = ipY + j * scaleY;
      positions[index + 2] = 0;
    }
  }

  // TODO:
  // get 2d indices
  //console.log('(width, height): ', `(${width},${height})`);
  const maxWidthLength = 100;
  const maxHeightLength = 100;

  const dW = Math.floor(width / maxWidthLength);
  const dH = Math.floor(height / maxHeightLength);
  //console.log('🔺w: ', dW); // 94
  //console.log('🔺h: ', dH); // 125

  const i_indices_2d = [];
  for (const i of range(0, width - 1, dW)) {
    i_indices_2d.push(i);
  }
  const j_indices_2d = [];
  for (const j of range(0, height - 1, dH)) {
    j_indices_2d.push(j);
  }
  //console.log('i_indices_2d: ', i_indices_2d);
  //console.log('j_indices_2d: ', j_indices_2d);

  // find 1d indices at 2d indices
  const indices_1d = [];
  for (let m = 0; m < j_indices_2d.length; m++) {
    for (let n = 0; n < i_indices_2d.length; n++) {
      indices_1d.push(i_indices_2d[n] + j_indices_2d[m] * width);
    }
  }
  //console.log(indices_1d);

  // create an array of objects containing positions, u, v
  const data = indices_1d
    .map((index) => {
      return {
        u: dataU[index],
        v: dataV[index],
        position: [positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2]],
      };
    })
    .filter((item) => item.u > -999);

  return data;
};

// custom function
function* range(start, end, step = 1) {
  let state = start;
  while (state < end) {
    yield state;
    state += step;
  }
  return;
}

// clear single band raster raster
export const clearSingleBandRaster = () => (dispatch) => {
  dispatch({
    type: 'CLEAR_SINGLE_BAND_RASTER',
  });
};

// clear multi band raster raster
export const clearMultiBandRaster = () => (dispatch) => {
  dispatch({
    type: 'CLEAR_MULTI_BAND_RASTER',
  });
};

// update an opacity
export const updateOpacity = (value) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_OPACITY',
      payload: value,
    });
  } catch (err) {
    console.log(err);
  }
};

// update a color scheme
export const updateColorScheme = (scheme) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_COLOR_SCHEME',
      payload: scheme,
    });
  } catch (err) {
    console.log(err);
  }
};

// update min value
export const updateDomainMinValue = (min) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_DOMAIN_MIN_VALUE',
      payload: min,
    });
  } catch (err) {
    console.log(err);
  }
};

// update max value
export const updateDomainMaxValue = (max) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_DOMAIN_MAX_VALUE',
      payload: max,
    });
  } catch (err) {
    console.log(err);
  }
};

// update a grid json file (for test)
export const updateGridJsonFile = (file) => (dispatch) => {
  try {
    dispatch({
      type: 'UPDATE_GRID_JSON_FILE',
      payload: file,
    });
  } catch (err) {
    console.log(err);
  }
};
