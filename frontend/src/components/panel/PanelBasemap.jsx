import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBasemap } from '../../_actions/displayAction';

// MUI
import {
  Tooltip,
  Fade,
  Fab,
  Popover,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
} from '@mui/material';
import { MapRounded } from '@mui/icons-material';

const PanelBasemap = () => {
  const dispatch = useDispatch();
  const map_style = useSelector((state) => state.display.basemap.map_style);
  const view = useSelector((state) => state.display.view);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickButton = (event) => {
    // set the position of the popover relative to the HTML element
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleChangeBasemap = (event, newBasemap) => {
    // enforce that at least one button must be active
    if (newBasemap !== null) {
      dispatch(updateBasemap(newBasemap));
    }
  };

  return (
    view.type === 'MapView' && (
      <React.Fragment>
        <Tooltip
          title='베이스맵'
          placement='left'
          arrow={true}
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 500 }}
        >
          <Fab size='small' color='primary' disableRipple={true} onClick={handleClickButton}>
            <MapRounded />
          </Fab>
        </Tooltip>

        <Popover
          open={Boolean(anchorEl)} // if the value is not null, return true
          anchorEl={anchorEl}
          onClose={handleClosePopover}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          BackdropProps={{ invisible: true }}
        >
          <ToggleButtonGroup
            orientation='vertical'
            exclusive
            value={map_style}
            onChange={handleChangeBasemap}
            color='primary'
            sx={{
              minWidth: '300px',
              '& .MuiToggleButton-root': {
                display: 'flex',
                justifyContent: 'space-between',
              },
            }}
          >
            <ToggleButton value='dark-v11'>
              <Typography align='center' sx={{ flexGrow: 1 }}>
                다크
              </Typography>
              <img src='/data/basemap/dark-v11.png' height='40px' />
            </ToggleButton>
            <ToggleButton value='light-v11'>
              <Typography align='center' sx={{ flexGrow: 1 }}>
                라이트
              </Typography>
              <img src={`/data/basemap/light-v11.png`} height='40px' />
            </ToggleButton>
            <ToggleButton value='outdoors-v12'>
              <Typography align='center' sx={{ flexGrow: 1 }}>
                아웃도어
              </Typography>
              <img src='/data/basemap/outdoors-v12.png' height='40px' />
            </ToggleButton>
            <ToggleButton value='streets-v12'>
              <Typography align='center' sx={{ flexGrow: 1 }}>
                거리
              </Typography>
              <img src='/data/basemap/streets-v12.png' height='40px' />
            </ToggleButton>
            <ToggleButton value='satellite-v9'>
              <Typography align='center' sx={{ flexGrow: 1 }}>
                위성
              </Typography>
              <img src='/data/basemap/satellite-v9.png' height='40px' />
            </ToggleButton>
            <ToggleButton value='satellite-streets-v12'>
              <Typography align='center' sx={{ flexGrow: 1 }} noWrap={true}>
                위성-거리
              </Typography>
              <img src='/data/basemap/satellite-streets-v12.png' height='40px' />
            </ToggleButton>
          </ToggleButtonGroup>
        </Popover>
      </React.Fragment>
    )
  );
};

export default PanelBasemap;
