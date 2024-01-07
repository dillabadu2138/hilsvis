import axios from 'axios';
import { setAlert } from './alertAction';

// get all datasets
export const getDatasets = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/dataset');

    dispatch({
      type: 'GET_ALL_DATASETS',
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: 'DATASET_ERROR',
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// select dataset
export const selectDataset = (row) => (dispatch) => {
  try {
    dispatch({
      type: 'SELECT_DATASET',
      payload: row,
    });
  } catch (err) {
    console.log(err);
  }
};

// deselect the dataset
export const deselectDataset = () => (dispatch) => {
  try {
    dispatch({
      type: 'DESELECT_DATASET',
    });
  } catch (err) {
    console.log(err);
  }
};
