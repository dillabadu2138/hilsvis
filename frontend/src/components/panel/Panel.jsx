// Components
import PanelBasemap from './PanelBasemap';
import PanelCoastline from './PanelCoastline';
import PanelLegend from './PanelLegend';

// MUI
import { Stack } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// global style overrides
// Reference: https://mui.com/material-ui/customization/theme-components/
const themePanel = createTheme({
  components: {
    MuiPopover: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
        paper: {
          // borderRadius: 0,
          // add optional spacing between Popover and its anchor IconButton
          marginLeft: '-12px',
          overflowY: 'auto',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          display: 'flex',
          flexDirection: 'column',
          minWidth: 100,
          borderRadius: 0,
        },
      },
    },
  },
});

const Panel = () => {
  return (
    <Stack sx={{ position: 'absolute', top: '15px', right: '15px' }} spacing={1} direction='column'>
      <ThemeProvider theme={themePanel}>
        <PanelBasemap />
        <PanelCoastline />
        <PanelLegend />
      </ThemeProvider>
    </Stack>
  );
};

export default Panel;
