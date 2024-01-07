import React, { useState } from 'react';

// MUI
import { Drawer, Box, Tabs, Tab } from '@mui/material';

// Components
import MenuDrawerDataset from './MenuDrawerDataset';
import MenuDrawerDanger from './MenuDrawerDanger';
import MenuDrawerCondition from './MenuDrawerCondition';
import MenuDrawerCharacteristicTree from './MenuDrawerCharacteristicTree';

// Custom TabPanel component
function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && <Box sx={{ m: 2 }}>{children}</Box>}
    </div>
  );
}

const MenuDrawer = ({ open, toggleDrawer }) => {
  const [value, setValue] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Drawer
      variant='persistent'
      hideBackdrop={true}
      PaperProps={{ style: { position: 'fixed', width: 380, height: '95%', margin: 20 } }}
      transitionDuration={500}
      open={open}
      onClose={toggleDrawer}
    >
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tabs
            // indicatorColor='primary'
            // variant='scrollable'
            // scrollButtons={true}
            sx={{
              '& .MuiTabs-flexContainer': {
                flexWrap: 'wrap',
                justifyContent: 'center',
              },
              '& .MuiTab-root': {
                fontSize: '14px',
                fontWeight: '600',
              },
            }}
            // disable the tab indicator because it doesn't work well with wrapped container
            TabIndicatorProps={{ sx: { display: 'none' } }}
            value={value}
            onChange={handleChangeTab}
          >
            <Tab wrapped label='위험사례(재현)' />
            <Tab wrapped label='위험사례(관측)' />
            <Tab wrapped label='해역특성' />
            <Tab wrapped label='해양상태' />
            <Tab wrapped disabled label='최적항로' />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <MenuDrawerDataset />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <MenuDrawerDanger />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <MenuDrawerCharacteristicTree />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <MenuDrawerCondition />
        </TabPanel>
        <TabPanel value={value} index={4}></TabPanel>
      </Box>
    </Drawer>
  );
};

export default MenuDrawer;
