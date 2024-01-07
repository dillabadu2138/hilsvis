// React, Redux
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Paper,
  Toolbar,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
} from '@mui/material';
import { FullscreenRounded, FullscreenExitRounded } from '@mui/icons-material';

const sxDialog = {
  '& .MuiDialogTitle-root': {
    display: 'flex',
    justifyContent: 'space-between',
    p: '16px',
  },
  '& .MuiDialogContent-root': {
    px: '16px',
  },
  '& .MuiTableRow-root': {
    wordBreak: 'keep-all',
    whiteSpace: 'nowrap',
  },
  '& .MuiTableCell-root': {
    padding: '6px 6px 6px 6px',
    textAlign: 'center',
  },
  '& .MuiTableRow-head': {
    bgcolor: 'primary.main',
  },
  '& .MuiTableCell-head': {
    color: 'primary.contrastText',
  },
};

const DialogDatasetTable = ({ toggleInfoDialog }) => {
  const dataset = useSelector((state) => state.dataset.dataset);

  const [fullScreen, setFullScreen] = useState(false);

  // handle close dialog
  const handleClose = () => {
    toggleInfoDialog();
  };

  // handle toggle screen
  const handleToggleFullscreen = () => {
    setFullScreen(!fullScreen);
  };

  return (
    <Dialog open={true} fullScreen={fullScreen} onClose={handleClose} sx={{ ...sxDialog }}>
      <React.Fragment>
        <DialogTitle>
          <Button
            size='small'
            variant='outlined'
            endIcon={fullScreen ? <FullscreenExitRounded /> : <FullscreenRounded />}
            onClick={handleToggleFullscreen}
          >
            {fullScreen ? '축소화면' : '전체화면'}
          </Button>
        </DialogTitle>
        <DialogContent>
          <Paper>
            <Toolbar>
              <Typography variant='h6'>해양환경 데이터셋 속성정보</Typography>
            </Toolbar>
            <TableContainer>
              <Table size={'small'}>
                <TableHead>
                  <TableRow>
                    <TableCell>속성명</TableCell>
                    <TableCell>속성값</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(dataset).map(([k, v], i) => (
                    <TableRow key={i} hover={true}>
                      <TableCell>{k}</TableCell>
                      <TableCell>{v}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </DialogContent>
      </React.Fragment>
    </Dialog>
  );
};

export default DialogDatasetTable;
