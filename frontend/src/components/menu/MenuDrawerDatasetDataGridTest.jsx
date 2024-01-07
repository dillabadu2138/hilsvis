import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGridJsonFile } from '../../_actions/rasterAction';

// MUI
import { Grid, TextField, MenuItem, Typography } from '@mui/material';

const available_grid_points = [
  { value: null, label: 'none' },
  { value: 'hycom_1h_test_20120828_regrid_313x376.json', label: '313X376' },
  { value: 'hycom_1h_test_20120828_regrid_313x376_masked.json', label: '313X376_masked' },
  { value: 'hycom_1h_test_20120828_regrid_1205x1805.json', label: '1205x1805' },
  { value: 'hycom_1h_test_20120828_regrid_1205x1805_masked.json', label: '1205x1805_masked' },
];

const MenuDrawerDatasetDataGridTest = () => {
  const dispatch = useDispatch();
  const grid_json_file = useSelector((state) => state.raster.grid_json_file);

  const handleUpdateGridJsonFile = (event) => {
    dispatch(updateGridJsonFile(event.target.value));
  };

  return (
    <Grid container spacing={2} alignItems='center' sx={{ mt: 1, mb: 3, pl: 2 }}>
      {/* 팔레트 설정 */}
      <Grid item xs={3}>
        <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
          그리드
        </Typography>
      </Grid>
      <Grid item xs={9}>
        <TextField
          fullWidth
          size='small'
          select
          value={grid_json_file}
          onChange={handleUpdateGridJsonFile}
        >
          {available_grid_points.map((item, index) => (
            <MenuItem key={index} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );
};

export default MenuDrawerDatasetDataGridTest;
