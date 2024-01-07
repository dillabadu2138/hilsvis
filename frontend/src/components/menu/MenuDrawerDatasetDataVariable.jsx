// React, Redux
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateScalarVariable, updateVectorVariable } from '../../_actions/rasterAction';

// MUI
import { Typography, Grid, ToggleButtonGroup, ToggleButton } from '@mui/material';

// Constant
import { default_scalar_values } from '../../constants/Constants';

const MenuDrawerDatasetDataVariable = () => {
  // global redux state
  const dispatch = useDispatch();
  const scalar_variable = useSelector((state) => state.raster.scalar_variable);
  const vector_variable = useSelector((state) => state.raster.vector_variable);

  // local component state
  const [mode, setMode] = useState('ocean');

  // handle update mode
  const handleUpdateMode = (event) => {
    setMode(event.target.value);

    if (event.target.value === 'ocean') {
      // find the index of the object in the array
      const index = default_scalar_values.findIndex(
        (item) => item.mode === 'ocean' && item.var_name === 'temp'
      );

      // get the object in the array
      const values_to_update = default_scalar_values[index];

      // update the global redux state by dispatching an action
      dispatch(
        updateScalarVariable(
          values_to_update.var_name,
          values_to_update.min,
          values_to_update.max,
          values_to_update.scheme,
          values_to_update.title,
          values_to_update.tickFormat
        )
      );
    } else if (event.target.value === 'wave') {
      // find the index of the object in the array
      const index = default_scalar_values.findIndex(
        (item) => item.mode === 'wave' && item.var_name === 'VHM0'
      );

      // get the object in the array
      const values_to_update = default_scalar_values[index];

      // update the global redux state by dispatching an action
      dispatch(
        updateScalarVariable(
          values_to_update.var_name,
          values_to_update.min,
          values_to_update.max,
          values_to_update.scheme,
          values_to_update.title,
          values_to_update.tickFormat
        )
      );
    } else if (event.target.value === 'air') {
      // find the index of the object in the array
      const index = default_scalar_values.findIndex(
        (item) => item.mode === 'air' && item.var_name === 'TMP'
      );

      // get the object in the array
      const values_to_update = default_scalar_values[index];

      // update the global redux state by dispatching an action
      dispatch(
        updateScalarVariable(
          values_to_update.var_name,
          values_to_update.min,
          values_to_update.max,
          values_to_update.scheme,
          values_to_update.title,
          values_to_update.tickFormat
        )
      );
    }
  };

  // handle update scalar variable
  const handleUpdateScalarVariable = (event) => {
    // find the index of the object in the array
    const index = default_scalar_values.findIndex(
      (item) => item.mode === mode && item.var_name === event.target.value
    );

    // get the object in the array
    const values_to_update = default_scalar_values[index];

    // update the global redux state by dispatching an action
    dispatch(
      updateScalarVariable(
        event.target.value,
        values_to_update.min,
        values_to_update.max,
        values_to_update.scheme,
        values_to_update.title,
        values_to_update.tickFormat
      )
    );
  };

  // handle update vector variable
  const handleUpdateVectorVariable = (event) => {
    // update the global redux state by dispatching an action
    dispatch(updateVectorVariable(event.target.value));
  };

  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item xs={3}>
        <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
          모드
        </Typography>
      </Grid>
      <Grid item xs={9}>
        <ToggleButtonGroup
          size='small'
          fullWidth
          exclusive
          color='primary'
          value={mode}
          onChange={handleUpdateMode}
        >
          <ToggleButton value='ocean'>해양</ToggleButton>
          <ToggleButton value='wave'>파랑</ToggleButton>
          <ToggleButton value='air'>기상</ToggleButton>
        </ToggleButtonGroup>
      </Grid>

      <Grid item xs={3}>
        <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
          스칼라
        </Typography>
      </Grid>
      <Grid item xs={9}>
        <ToggleButtonGroup
          size='small'
          fullWidth
          exclusive
          color='primary'
          value={scalar_variable.var_name}
          onChange={handleUpdateScalarVariable}
        >
          {default_scalar_values
            // filter variables by mode
            .filter((item) => item.mode === mode)
            // map each variable in the array to render a HTML element
            .map((item, index) => (
              <ToggleButton key={index} value={item.var_name}>
                {item.var_name_kor}
              </ToggleButton>
            ))}
        </ToggleButtonGroup>
      </Grid>

      <Grid item xs={3}>
        <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
          벡터
        </Typography>
      </Grid>
      <Grid item xs={9}>
        <ToggleButtonGroup
          size='small'
          fullWidth
          exclusive
          color='primary'
          value={vector_variable.var_name}
          onChange={handleUpdateVectorVariable}
        >
          <ToggleButton value='uv'>표층해류</ToggleButton>
          <ToggleButton disabled value=''>
            파향
          </ToggleButton>
          <ToggleButton value='none'>비활성</ToggleButton>
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

export default MenuDrawerDatasetDataVariable;
