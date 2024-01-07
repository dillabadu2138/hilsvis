import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllTyphoons, selectTyphoons } from '../../_actions/dangerAction';

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
				<Typography variant='h6'>태풍 위험사례 목록</Typography>
			)}
		</Toolbar>
	);
};

const DialogDangerSearch = ({ toggleDialog }) => {
	const dispatch = useDispatch();
	const loading = useSelector((state) => state.danger.loading);
	const typhoons = useSelector((state) => state.danger.typhoons);

	const [fullScreen, setFullScreen] = useState(false);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [selected, setSelected] = useState([]);

	const handleSubmit = () => {
		// sort indices by number
		const indices = selected.sort((a, b) => a - b);

		// get selected typhoons
		const layers = typhoons.filter((row) => {
			if (indices.indexOf(row.typhoon_id) !== -1) {
				return true;
			} else {
				return false;
			}
		});

		dispatch(selectTyphoons(layers));

		toggleDialog();
	};

	// cancel selection
	const handleCancel = () => {
		dispatch({ type: 'CLEAR_ALL_TYPHOONS_SEARCH' });

		toggleDialog();
	};

	const toggleScreen = () => {
		setFullScreen(!fullScreen);
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
			const allRows = typhoons.map((row) => row.typhoon_id);

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
		dispatch(getAllTyphoons());
	}, [dispatch]);

	return (
		<React.Fragment>
			{loading ? (
				<Spinner />
			) : (
				<Dialog open={true} fullScreen={fullScreen} onClose={handleCancel} sx={{ ...sxDialog }}>
					<DialogTitle>
						<Button disabled size='small' startIcon={<FilterListRounded />}>
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
													indeterminate={selected.length > 0 && selected.length < typhoons.length}
													checked={typhoons.length > 0 && selected.length === typhoons.length}
													onChange={handleSelectAllRows}
												/>
											</TableCell>
											<TableCell align='center'>아이디</TableCell>
											<TableCell align='center'>태풍명</TableCell>
											<TableCell align='center'>시작일시</TableCell>
											<TableCell align='center'>종료일시</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{typhoons
											// slice rows
											.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
											// create a table
											.map((row) => {
												// check if the row is selected
												const isRowSelected =
													selected.indexOf(row.typhoon_id) !== -1 ? true : false;

												return (
													<TableRow
														hover={true}
														role='checkbox'
														key={row.typhoon_id}
														selected={isRowSelected}
														onClick={(event) => handleSelectRow(event, row.typhoon_id)}
													>
														<TableCell padding='checkbox'>
															<Checkbox checked={isRowSelected} />
														</TableCell>
														<TableCell align='center'>{row.typhoon_id}</TableCell>
														<TableCell align='center'>{row.typhoon_name}</TableCell>
														<TableCell align='center'>
															{moment(row.time_start).format('YYYY-MM-DD HH:mm:ss')}
														</TableCell>
														<TableCell align='center'>
															{moment(row.time_end).format('YYYY-MM-DD HH:mm:ss')}
														</TableCell>
													</TableRow>
												);
											})}
									</TableBody>
									<TableFooter>
										<TableRow>
											<TablePagination
												count={typhoons.length}
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

export default DialogDangerSearch;
