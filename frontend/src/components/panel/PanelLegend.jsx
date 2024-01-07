import React, { useState } from 'react';

// Component
import PanelLegendContent from './PanelLegendContent';

// MUI
import {
  Tooltip,
  Fade,
  Fab,
  IconButton,
  Popover,
  Popper,
  Card,
  CardHeader,
  CardContent,
} from '@mui/material';
import { PaletteRounded, PushPinRounded, CloseFullscreenRounded } from '@mui/icons-material';

const PanelLegend = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [pinned, setPinned] = useState(false);

  const handleClickLegendButton = (event) => {
    // set the position of the popover relative to the HTML element
    setAnchorEl(event.currentTarget);
  };

  const handleClickPinButton = () => {
    setPinned(true);
  };

  const handleClickCollapseButton = () => {
    // collapse popper
    setPinned(false);

    // reset the anchor reference
    setAnchorEl(null);
  };

  return (
    <React.Fragment>
      {pinned !== true && (
        <Tooltip
          title='범례'
          placement='left'
          arrow={true}
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 500 }}
        >
          <Fab size='small' color='primary' disableRipple={true} onClick={handleClickLegendButton}>
            <PaletteRounded />
          </Fab>
        </Tooltip>
      )}

      {/* 
      <Popper vs. Popover>
        Popper
          * The scroll isn't blocked like with the Popover component.
          * Clicking away does not hide the Popper component.
        Popover
          * The scroll and click away are blocked unlike with the Popper component.
      */}
      {pinned ? (
        <Popper
          open={Boolean(anchorEl)}
          style={{ position: 'fixed', bottom: '15px', right: '15px', top: 'unset', left: 'unset' }}
        >
          <Card>
            <CardHeader
              action={
                <IconButton size='small' disableRipple={true} onClick={handleClickCollapseButton}>
                  <CloseFullscreenRounded />
                </IconButton>
              }
            />
            <CardContent>
              <PanelLegendContent />
            </CardContent>
          </Card>
        </Popper>
      ) : (
        <Popover
          open={Boolean(anchorEl)} // if the value is not null, return true
          anchorEl={anchorEl}
          onClose={() => {
            setAnchorEl(null);
          }}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Card>
            <CardHeader
              action={
                <IconButton size='small' disableRipple={true} onClick={handleClickPinButton}>
                  <PushPinRounded />
                </IconButton>
              }
            />
            <CardContent>
              <PanelLegendContent />
            </CardContent>
          </Card>
        </Popover>
      )}
    </React.Fragment>
  );
};

export default PanelLegend;
