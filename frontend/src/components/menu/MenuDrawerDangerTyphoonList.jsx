import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateLineColor,
  updateLineWidth,
  updateIconSize,
  togglePickingTyphoon,
} from '../../_actions/dangerAction';

// Components
import MenuDrawerDangerTyphoonListItem from './MenuDrawerDangerTyphoonListItem';

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
  Slider,
  Switch,
  List,
} from '@mui/material';
import {
  DeleteRounded,
  SettingsRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
} from '@mui/icons-material';

const sxBox = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  my: '10px',
  '& .MuiTypography-root': {
    fontSize: '14px',
  },
};
const sxList = {
  display: 'flex',
  flexDirection: 'column',
  '& .MuiListItem-root': {
    p: '0px',
  },
  '& .MuiListItemButton-root': {
    p: '0px',
    m: '4px',
  },
  '& .MuiIconButton-root': {
    p: '3px',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
  },
};

const MenuDrawerDangerTyphoonList = () => {
  const dispatch = useDispatch();
  const typhoons_selected = useSelector((state) => state.danger.typhoons_selected);
  const typhoons_display_setting = useSelector((state) => state.danger.typhoons_display_setting);

  const [openSetting, setOpenSetting] = useState(true);
  const [openList, setOpenList] = useState(true);
  const [checkedPicking, setCheckedPicking] = useState(false);

  const toggleSetting = () => {
    setOpenSetting(!openSetting);
  };

  const toggleList = () => {
    setOpenList(!openList);
  };

  const handleUpdateLineColor = (event) => {
    // convert hex to rgb
    let rgb = hex2Rgb(event.target.value);

    dispatch(updateLineColor(rgb));
  };

  const handleUpdateLineWidth = (event) => {
    dispatch(updateLineWidth(event.target.value));
  };

  const handleUpdateIconSize = (event) => {
    dispatch(updateIconSize(event.target.value));
  };

  const handleTogglePicking = (event) => {
    setCheckedPicking(event.target.checked);

    dispatch(togglePickingTyphoon(event.target.checked));
  };

  return (
    typhoons_selected.length > 0 && (
      <>
        {/* 태풍 관련 버튼 모음 */}
        <Box sx={{ ...sxBox }}>
          <Typography
            sx={{ borderLeft: '0.1em solid rgba(0, 0, 0, 0.12)', padding: '0.5em' }}
          >{`태풍(${typhoons_selected.length})`}</Typography>
          <ButtonGroup>
            <Button
              startIcon={<DeleteRounded />}
              size='small'
              onClick={() => dispatch({ type: 'DELETE_ALL_TYPHOONS' })}
            >
              삭제
            </Button>
            <Button startIcon={<SettingsRounded />} size='small' onClick={toggleSetting}>
              설정
            </Button>
            <Button
              startIcon={openList === true ? <ExpandLessRounded /> : <ExpandMoreRounded />}
              size='small'
              onClick={toggleList}
            >
              {openList === true ? '숨기기' : '펼치기'}
            </Button>
          </ButtonGroup>
        </Box>

        {/* 태풍 경로 디스플레이 설정 */}
        {openSetting && (
          <Grid container spacing={2} alignItems='center' sx={{ mt: 1, mb: 3, pl: 2 }}>
            <Grid item xs={12}>
              <Typography sx={{ fontSize: '14px' }}>디스플레이 설정</Typography>
            </Grid>

            {/* lineColor */}
            <Grid item xs={3}>
              <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                선 색
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <TextField
                fullWidth
                size='small'
                type={'color'}
                value={rgb2Hex(...typhoons_display_setting.line_color)}
                onChange={handleUpdateLineColor}
              ></TextField>
            </Grid>

            {/* lineWidth */}
            <Grid item xs={3}>
              <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                선 두께
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Slider
                size='small'
                min={1}
                max={5}
                valueLabelDisplay='auto'
                value={typhoons_display_setting.line_width}
                onChange={handleUpdateLineWidth}
              />
            </Grid>

            {/* iconSize */}
            <Grid item xs={3}>
              <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                icon 크기
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Slider
                size='small'
                min={5}
                max={30}
                valueLabelDisplay='auto'
                value={typhoons_display_setting.icon_size}
                onChange={handleUpdateIconSize}
              />
            </Grid>

            {/* enable picking */}
            <Grid item xs={3}>
              <Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
                picking
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Switch checked={checkedPicking} onChange={handleTogglePicking} />
            </Grid>
          </Grid>
        )}

        {/* 태풍 경로 선택 목록 */}
        {openList !== false && (
          <List sx={{ ...sxList }}>
            {typhoons_selected.map((row) => (
              <MenuDrawerDangerTyphoonListItem key={row.typhoon_id} typhoon={row} />
            ))}
          </List>
        )}
      </>
    )
  );
};

export default MenuDrawerDangerTyphoonList;
