import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCoastline } from '../../_actions/displayAction';

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
import { PolylineRounded } from '@mui/icons-material';

const PanelCoastline = () => {
  const dispatch = useDispatch();
  const coastline = useSelector((state) => state.display.coastline);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClickButton = (event) => {
    // set the position of the popover relative to the HTML element
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleChangeCoastline = (event, newCoastline) => {
    // enforce that at least one button must be active
    if (newCoastline !== null) {
      dispatch(updateCoastline(newCoastline));
    }
  };

  return (
    <React.Fragment>
      <Tooltip
        title='해안선'
        placement='left'
        arrow={true}
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 500 }}
      >
        <Fab size='small' color='primary' disableRipple={true} onClick={handleClickButton}>
          <PolylineRounded />
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
          value={coastline}
          onChange={handleChangeCoastline}
          color='primary'
          sx={{
            minWidth: '300px',
            '& .MuiToggleButton-root': {
              display: 'flex',
              justifyContent: 'space-between',
            },
          }}
        >
          <ToggleButton value='deactivated'>
            <Typography align='center' sx={{ flexGrow: 1 }}>
              해안선 비활성화
            </Typography>
          </ToggleButton>
          <ToggleButton value='ne_110m_clipped'>
            <Typography align='center' sx={{ flexGrow: 1 }}>
              저해상도(1:110m)
            </Typography>
            <img src='/data/coastline/110m.jpg' height='40px' />
          </ToggleButton>
          <ToggleButton value='ne_50m_clipped'>
            <Typography align='center' sx={{ flexGrow: 1 }}>
              중해상도(1:50m)
            </Typography>
            <img src='/data/coastline/50m.jpg' height='40px' />
          </ToggleButton>
          <ToggleButton value='ne_10m_clipped'>
            <Typography align='center' sx={{ flexGrow: 1 }}>
              고해상도(1:10m)
            </Typography>
            <img src='/data/coastline/10m.jpg' height='40px' />
          </ToggleButton>
        </ToggleButtonGroup>
      </Popover>
    </React.Fragment>
  );
};

export default PanelCoastline;
