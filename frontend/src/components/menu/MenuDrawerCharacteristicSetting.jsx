import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// MUI
import { Box, Typography, Grid, TextField, Button, Slider } from '@mui/material';

// Utility
import { rgb2Hex, hex2Rgb } from '../../utils/convertColorSpaces';

const MenuDrawerCharacteristicSetting = ({ nodeId }) => {
  const dispatch = useDispatch();
  const checked_layers = useSelector((state) => state.characteristic.checked_layers);
  const curr_layer = checked_layers.find((item) => item.id === nodeId);

  return (
    <Grid container spacing={2} alignItems='center' sx={{ mt: 1, mb: 3, pl: 5 }}>
      {/* stroked & lineColor */}
      <Grid item xs={3}>
        <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
          stroked
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <TextField fullWidth size='small'></TextField>
      </Grid>
      <Grid item xs={3}>
        <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
          lineColor
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <TextField fullWidth size='small' type={'color'} value={curr_layer.lineColor}></TextField>
      </Grid>

      {/* filled & fillColor */}
      <Grid item xs={3}>
        <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
          filled
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <TextField fullWidth size='small'></TextField>
      </Grid>
      <Grid item xs={3}>
        <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
          fillColor
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <TextField fullWidth size='small' type={'color'}></TextField>
      </Grid>
    </Grid>
  );
};

export default MenuDrawerCharacteristicSetting;
