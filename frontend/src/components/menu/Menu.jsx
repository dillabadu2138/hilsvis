// React
import React, { useState } from 'react';

// MUI
import { Fab } from '@mui/material';
import { KeyboardArrowRight } from '@mui/icons-material';

// Components
import MenuDrawer from './MenuDrawer';

const Menu = () => {
  const [open, setOpen] = useState(false);

  const handleToggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <Fab
        sx={{
          position: 'absolute',
          top: '15px',
          left: open ? '410px' : '15px',
          transition: '0.5s all',
        }}
        color='primary'
        size='small'
        disableRipple={true}
        onClick={handleToggleDrawer}
      >
        <KeyboardArrowRight sx={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </Fab>

      <MenuDrawer open={open} toggleDrawer={handleToggleDrawer} />
    </React.Fragment>
  );
};

export default Menu;
