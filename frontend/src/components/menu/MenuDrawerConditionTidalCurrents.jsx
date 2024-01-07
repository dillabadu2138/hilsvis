import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateRadiusMinPixels,
  updateFillColor,
  updateArrowColorFloodTide,
  updateArrowColorEbbTide,
  toggleTextVisibility,
  togglePickingTidalCurrent,
  toggleFloodVisibility,
  toggleEbbVisibility,
  updateObsPeriod,
} from '../../_actions/conditionAction';

// Utility
import { hex2Rgb, rgb2Hex } from '../../utils/convertColorSpaces';

// MUI
import {
  Box,
  Typography,
  ButtonGroup,
  Button,
  Grid,
  TextField,
  MenuItem,
  Slider,
  Switch,
  Checkbox,
} from '@mui/material';
import { DeleteRounded, SettingsRounded } from '@mui/icons-material';

const sxBox = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  my: '10px',
  '& .MuiTypography-root': {
    fontSize: '14px',
  },
};

const available_obs_periods = [
  { value: 'all', label: '모두' },
  { value: 'more than 30 days', label: '30주야 이상' },
  { value: 'less than 30 days', label: '30주야 이하' },
];

const MenuDrawerConditionTidalCurrents = () => {
  const dispatch = useDispatch();
  const tidal_currents_selected = useSelector((state) => state.condition.tidal_currents_selected);
  const tidal_currents_display_setting = useSelector(
    (state) => state.condition.tidal_currents_display_setting
  );
  const tidal_currents_filter_setting = useSelector(
    (state) => state.condition.tidal_currents_filter_setting
  );

  const [openSetting, setOpenSetting] = useState(true);
  const [checkedTextVisibility, setCheckedTextVisibility] = useState(true);
  const [checkedPicking, setCheckedPicking] = useState(false);
  const [checkedToggleFlood, setCheckedToggleFlood] = useState(true);
  const [checkedToggleEbb, setCheckedToggleEbb] = useState(true);

  const toggleSetting = () => {
    setOpenSetting(!openSetting);
  };

  const handleUpdateRadiusMinPixels = (event) => {
    dispatch(updateRadiusMinPixels(event.target.value));
  };

  const handleUpdateFillColor = (event) => {
    // convert hex to rgb
    let rgb = hex2Rgb(event.target.value);

    dispatch(updateFillColor(rgb));
  };

  const handleUpdateArrowColorFloodTide = (event) => {
    // convert hex to rgb
    let rgb = hex2Rgb(event.target.value);

    dispatch(updateArrowColorFloodTide(rgb));
  };

  const handleUpdateArrowColorEbbTide = (event) => {
    // convert hex to rgb
    let rgb = hex2Rgb(event.target.value);

    dispatch(updateArrowColorEbbTide(rgb));
  };

  const handleToggleTextVisibility = (event) => {
    setCheckedTextVisibility(event.target.checked);

    dispatch(toggleTextVisibility(event.target.checked));
  };

  const handleTogglePicking = (event) => {
    setCheckedPicking(event.target.checked);

    dispatch(togglePickingTidalCurrent(event.target.checked));
  };

  const handleToggleFlood = (event) => {
    setCheckedToggleFlood(event.target.checked);

    dispatch(toggleFloodVisibility(event.target.checked));
  };

  const handleToggleEbb = (event) => {
    setCheckedToggleEbb(event.target.checked);

    dispatch(toggleEbbVisibility(event.target.checked));
  };

  const handleUpdateObsPeriod = (event) => {
    dispatch(updateObsPeriod(event.target.value));
  };

  return (
    tidal_currents_selected.length > 0 && (
      <>
        {/* 최강 창·낙조류 관련 버튼 모음 */}
        <Box sx={{ ...sxBox }}>
          {/* <Divider orientation='vertical' flexItem /> */}
          <Typography
            sx={{ borderLeft: '0.1em solid rgba(0, 0, 0, 0.12)', padding: '0.5em' }}
          >{`최강 창·낙조류(${tidal_currents_selected.length})`}</Typography>
          <ButtonGroup>
            <Button
              startIcon={<DeleteRounded />}
              size='small'
              onClick={() => dispatch({ type: 'DELETE_ALL_TIDAL_CURRENTS' })}
            >
              삭제
            </Button>
            <Button startIcon={<SettingsRounded />} size='small' onClick={toggleSetting}>
              설정
            </Button>
          </ButtonGroup>
        </Box>

        {openSetting && (
          <Grid container spacing={2} alignItems='center' sx={{ mt: 1, mb: 3, pl: 2 }}>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '14px' }}>디스플레이 설정</Typography>
            </Grid>

            {/* radius min pixels */}
            <Grid item xs={3}>
              <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                점 반지름
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Slider
                size='small'
                min={1}
                max={5}
                valueLabelDisplay='auto'
                value={tidal_currents_display_setting.radius_min_pixels}
                onChange={handleUpdateRadiusMinPixels}
              />
            </Grid>

            {/* fill color */}
            <Grid item xs={3}>
              <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                점 색
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size='small'
                type={'color'}
                value={rgb2Hex(...tidal_currents_display_setting.fill_color)}
                onChange={handleUpdateFillColor}
              ></TextField>
            </Grid>

            {/* fill color (flood tide) */}
            <Grid item xs={3}>
              <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                창조 색
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size='small'
                type={'color'}
                value={rgb2Hex(...tidal_currents_display_setting.arrow_color_flood_tide)}
                onChange={handleUpdateArrowColorFloodTide}
              ></TextField>
            </Grid>

            {/* fill color (ebb tide) */}
            <Grid item xs={3}>
              <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                낙조 색
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size='small'
                type={'color'}
                value={rgb2Hex(...tidal_currents_display_setting.arrow_color_ebb_tide)}
                onChange={handleUpdateArrowColorEbbTide}
              ></TextField>
            </Grid>

            {/* text visibility */}
            <Grid item xs={3}>
              <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                텍스트
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Switch checked={checkedTextVisibility} onChange={handleToggleTextVisibility} />
            </Grid>

            {/* picking */}
            <Grid item xs={3}>
              <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                picking
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Switch checked={checkedPicking} onChange={handleTogglePicking} />
            </Grid>

            {/* 최강 창·낙조류 필터 설정 */}
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '14px' }}>데이터 필터 설정</Typography>
            </Grid>

            {/* 창조 */}
            <Grid item xs={3}>
              <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                창조
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Checkbox checked={checkedToggleFlood} onChange={handleToggleFlood} />
            </Grid>

            {/* 낙조 */}
            <Grid item xs={3}>
              <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                낙조
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Checkbox checked={checkedToggleEbb} onChange={handleToggleEbb} />
            </Grid>

            {/* 30주야이상 */}
            <Grid item xs={6}>
              <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                조류 관측기간
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size='small'
                label='선택'
                select
                value={tidal_currents_filter_setting.obs_period}
                onChange={handleUpdateObsPeriod}
              >
                {available_obs_periods.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        )}
      </>
    )
  );
};

export default MenuDrawerConditionTidalCurrents;
