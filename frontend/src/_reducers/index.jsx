import { combineReducers } from 'redux';

import alertReducer from './alertReducer';
import datasetReducer from './datasetReducer';
import rasterReducer from './rasterReducer';
import dangerReducer from './dangerReducer';
import displayReducer from './displayReducer';
import conditionReducer from './conditionReducer';
import characteristicReducer from './characteristicReducer';

const rootReducer = combineReducers({
  alerts: alertReducer,
  dataset: datasetReducer,
  raster: rasterReducer,
  danger: dangerReducer,
  display: displayReducer,
  condition: conditionReducer,
  characteristic: characteristicReducer,
});

export default rootReducer;
