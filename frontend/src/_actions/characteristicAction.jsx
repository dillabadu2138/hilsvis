import axios from 'axios';

// check characteristic
export const checkCharacteristic = (obj) => async (dispatch) => {
  try {
    const res = await axios.get(
      `/api/characteristic/schema/characteristics_${obj.schema}/table/${obj.table}`
    );
    dispatch({
      type: 'CHECK_CHARACTERISTIC',
      payload: { ...obj, data: res.data },
    });
  } catch (err) {
    console.log(err);
  }
};

// uncheck characteristic by id
export const uncheckCharacteristicById = (id) => async (dispatch) => {
  try {
    dispatch({
      type: 'UNCHECK_CHARACTERISTIC_BY_ID',
      payload: id,
    });
  } catch (err) {
    console.log(err);
  }
};
