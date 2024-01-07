import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { getPathsByTyphoon } from '../../_actions/dangerAction';
import Spinner from '../layout/Spinner';

// Third-party libraries
import moment from 'moment';

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
  TableFooter,
  TablePagination,
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
  '& .MuiDialogActions-root': {
    p: '16px',
    pt: '0px',
  },
};

const DialogDangerLayerTable = ({ toggleDialog, typhoonId, typhoonName }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.danger.loading);
  const typhoons_selected = useSelector((state) => state.danger.typhoons_selected);
  const typhoon = typhoons_selected.filter((item) => item.typhoon_id === typhoonId);

  const [fullScreen, setFullScreen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // defaults to 10 rows per page

  // cancel selection
  const handleCancel = () => {
    // close dialog
    toggleDialog();
  };

  const handleToggleScreen = () => {
    setFullScreen(!fullScreen);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  useEffect(() => {
    dispatch(getPathsByTyphoon());
  }, [dispatch]);

  return (
    <Dialog open={true} fullScreen={fullScreen} onClose={handleCancel} sx={{ ...sxDialog }}>
      {loading ? (
        <Spinner />
      ) : (
        <React.Fragment>
          <DialogTitle>
            <Button
              size='small'
              endIcon={fullScreen ? <FullscreenExitRounded /> : <FullscreenRounded />}
              onClick={handleToggleScreen}
            >
              {fullScreen ? '축소화면' : '전체화면'}
            </Button>
          </DialogTitle>
          <DialogContent>
            <Paper>
              <Toolbar>
                <Typography variant='h6'>{`태풍 ${typhoonName}`}</Typography>
              </Toolbar>
              <TableContainer>
                <Table size={'small'}>
                  <TableHead>
                    <TableRow>
                      <TableCell>일시</TableCell>
                      <TableCell>위도</TableCell>
                      <TableCell>경도</TableCell>
                      <TableCell>기압(hPa)</TableCell>
                      <TableCell>풍속(m/s)</TableCell>
                      <TableCell>강풍반경(km)</TableCell>
                      <TableCell>강도</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {typhoon[0].paths
                      /// slice rows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      // make a deep copy and update the value of kma_grade
                      .map((row) => {
                        if (row.kma_grade === 'normal') {
                          return { ...row, kma_grade: '중' };
                        } else if (row.kma_grade === 'strong') {
                          return { ...row, kma_grade: '강' };
                        } else if (row.kma_grade === 'very strong') {
                          return { ...row, kma_grade: '매우 강' };
                        } else if (row.kma_grade === 'super strong') {
                          return { ...row, kma_grade: '초강력' };
                        }

                        return row;
                      })
                      // create a table
                      .map((row) => (
                        <TableRow hover={true} role='checkbox' key={row.path_id}>
                          <TableCell>
                            {moment(row.datetime).format('YYYY-MM-DD HH:mm:ss')}
                          </TableCell>
                          <TableCell>{row.lat.toFixed(1)}</TableCell>
                          <TableCell>{row.lon.toFixed(1)}</TableCell>
                          <TableCell>{row.kma_pres}</TableCell>
                          <TableCell>{row.kma_wind}</TableCell>
                          <TableCell>{row.kma_r15}</TableCell>
                          <TableCell>{row.kma_grade}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={typhoon[0].paths.length}
                        page={page}
                        onPageChange={handleChangePage}
                        showFirstButton={true}
                        showLastButton={true}
                        labelRowsPerPage={'페이지당 행 수'}
                        rowsPerPageOptions={[5, 10, 15]}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </TableContainer>
            </Paper>
          </DialogContent>
        </React.Fragment>
      )}
    </Dialog>
  );
};

export default DialogDangerLayerTable;
