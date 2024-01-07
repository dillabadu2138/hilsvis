import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTidalCurrents, selectTidalCurrents } from '../../_actions/conditionAction';

// Components
import Spinner from '../layout/Spinner';

// Third-party libraries
import moment from 'moment';

// MUI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Checkbox,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { FilterListRounded, FullscreenRounded, FullscreenExitRounded } from '@mui/icons-material';

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
  },
  '& .MuiTableCell-head': {
    color: 'primary.main',
  },
  '& .MuiDialogActions-root': {
    p: '16px',
    pt: '0px',
  },
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography color='inherit'>{numSelected} 선택됨</Typography>
      ) : (
        <Typography variant='h6'>최강 창·낙조류 목록</Typography>
      )}
    </Toolbar>
  );
};

const DialogConditionSearch = ({ toggleDialog }) => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.condition.loading);
  const tidal_currents = useSelector((state) => state.condition.tidal_currents);

  const [fullScreen, setFullScreen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selected, setSelected] = useState([]);

  const handleSubmit = () => {
    // sort by number
    const indices = selected.sort((a, b) => {
      const idA = Number(a.match(/\d+/));
      const idB = Number(b.match(/\d+/));

      if (idA < idB) {
        return -1;
      }
      if (idA > idB) {
        return 1;
      }

      // equal
      return 0;
    });

    // get selected tidal currents
    const selected_tidal_currents = tidal_currents.filter((row) => {
      if (indices.indexOf(row.obj_id) !== -1) {
        return true;
      } else {
        return false;
      }
    });

    dispatch(selectTidalCurrents(selected_tidal_currents));

    toggleDialog();
  };

  const handleCancel = () => {
    dispatch({ type: 'CLEAR_ALL_TIDAL_CURRENTS_SEARCH' });

    toggleDialog();
  };

  const toggleScreen = () => {
    setFullScreen(!fullScreen);
  };

  // TODO
  const handleOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const handleSelectAllRows = (event) => {
    // if checkbox is checked, add all rows to the list
    if (event.target.checked) {
      const allRows = tidal_currents.map((row) => row.obj_id);

      setSelected(allRows);
      return;
    }
    // otherwise empty the list
    setSelected([]);
  };

  const handleSelectRow = (event, id) => {
    const selectedIndex = selected.indexOf(id);

    let newSelected = [];
    if (selectedIndex === -1) {
      // if the id is not in the list, add to the new list
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      // if the id is in the list as the first element, copy everything except that element to new list
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      // if the id is in the list as the last element, copy everything except that element to new list
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      // if the id is in the list, copy everything except that element to new list
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  useEffect(() => {
    dispatch(getAllTidalCurrents());
  }, [dispatch]);

  return (
    <React.Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Dialog
          open={true}
          fullScreen={fullScreen}
          onClose={handleCancel}
          sx={{ ...sxDialog }}
          PaperProps={{ sx: { minWidth: '70%', minHeight: '70%' } }}
        >
          <DialogTitle>
            <Button
              disabled
              size='small'
              startIcon={<FilterListRounded />}
              onClick={handleOpenFilter}
            >
              필터
            </Button>
            <Button
              size='small'
              endIcon={fullScreen ? <FullscreenExitRounded /> : <FullscreenRounded />}
              onClick={toggleScreen}
            >
              {fullScreen ? '축소화면' : '전체화면'}
            </Button>
          </DialogTitle>
          <DialogContent>
            <Paper elevation={8}>
              <EnhancedTableToolbar numSelected={selected.length} />
              <TableContainer>
                <Table size={'small'}>
                  <TableHead>
                    <TableRow>
                      <TableCell padding='checkbox'>
                        <Checkbox
                          color='primary'
                          indeterminate={
                            selected.length > 0 && selected.length < tidal_currents.length
                          }
                          checked={
                            tidal_currents.length > 0 && selected.length === tidal_currents.length
                          }
                          onChange={handleSelectAllRows}
                        />
                      </TableCell>
                      <TableCell align='center'>아이디</TableCell>
                      <TableCell align='center'>구분</TableCell>
                      <TableCell align='center'>위도</TableCell>
                      <TableCell align='center'>경도</TableCell>
                      <TableCell align='center'>유향(°)</TableCell>
                      <TableCell align='center'>유속(m/s)</TableCell>
                      <TableCell align='center'>시작일시</TableCell>
                      <TableCell align='center'>종료일시</TableCell>
                      <TableCell align='center'>기준항</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tidal_currents
                      // sort
                      .sort((a, b) => {
                        const idA = Number(a.obj_id.match(/\d+/));
                        const idB = Number(b.obj_id.match(/\d+/));

                        if (idA < idB) {
                          return -1;
                        }
                        if (idA > idB) {
                          return 1;
                        }

                        // equal
                        return 0;
                      })
                      // slice rows
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      // create a table
                      .map((row) => {
                        // check if the row is selected
                        const isRowSelected = selected.indexOf(row.obj_id) !== -1 ? true : false;

                        return (
                          <TableRow
                            hover={true}
                            role='checkbox'
                            key={row.obj_id}
                            selected={isRowSelected}
                            onClick={(event) => handleSelectRow(event, row.obj_id)}
                          >
                            <TableCell padding='checkbox'>
                              <Checkbox checked={isRowSelected} />
                            </TableCell>
                            <TableCell align='center'>{row.obj_id}</TableCell>
                            <TableCell align='center'>{row.cat_ts}</TableCell>
                            <TableCell align='center'>{row.latitude.toFixed(4)}</TableCell>
                            <TableCell align='center'>{row.longitude.toFixed(4)}</TableCell>
                            <TableCell align='center'>{row.cur_dir}</TableCell>
                            <TableCell align='center'>{row.cur_spd.toFixed(4)}</TableCell>
                            <TableCell align='center'>
                              {moment(row.start_datetime).format('YYYY-MM-DD HH:mm:ss')}
                            </TableCell>
                            <TableCell align='center'>
                              {moment(row.end_datetime).format('YYYY-MM-DD HH:mm:ss')}
                            </TableCell>
                            <TableCell align='center'>{row.ref_tidal_station}</TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={tidal_currents.length}
                        page={page}
                        onPageChange={handleChangePage}
                        showFirstButton={true}
                        showLastButton={true}
                        labelRowsPerPage={'페이지당 행 수'}
                        labelDisplayedRows={({ from, to, count }) => {
                          return `총 ${count}개 중 ${from} - ${to}`;
                        }}
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
          <DialogActions>
            <Button size='small' variant='contained' onClick={handleSubmit}>
              추가
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </React.Fragment>
  );
};

export default DialogConditionSearch;
