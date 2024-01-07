import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTimeId } from '../../_actions/rasterAction';

// Third-party libraries
import moment from 'moment';

// MUI
import { Typography, Grid, TextField, MenuItem, ButtonGroup, IconButton } from '@mui/material';
import {
	KeyboardDoubleArrowLeftRounded,
	KeyboardArrowLeftRounded,
	KeyboardArrowRightRounded,
	KeyboardDoubleArrowRightRounded,
} from '@mui/icons-material';

// create an array of dates
function createDates(time_start, time_end, time_step) {
	const dateArray = [];
	let currentDate = moment(time_start);
	const endDate = moment(time_end);
	while (currentDate <= endDate) {
		dateArray.push(moment(currentDate).format('YYYY-MM-DDTHH:mm:ss'));
		currentDate = moment(currentDate).add(time_step, 'seconds');
	}
	return dateArray;
}

const MenuDrawerDatasetDataTime = () => {
	const dispatch = useDispatch();
	const dataset = useSelector((state) => state.dataset.dataset);
	const scalar_variable = useSelector((state) => state.raster.scalar_variable);

	// create a timestep array of the dataset
	const timesteps = createDates(dataset.time_start, dataset.time_end, dataset.time_step);

	// update timestep
	const handleUpdateTimestep = (event) => {
		// find the index of the current timestep in the timesteps array
		const zero_based_index = timesteps.findIndex((element) => element === event.target.value);

		// add 1, because javascript index is 0-based and time_id(PostgreSQL) is 1-based
		const new_time_id = zero_based_index + 1;

		dispatch(updateTimeId(new_time_id));
	};

	// handle move to the first timestep
	const handleGetFirstTimestep = () => {
		dispatch(updateTimeId(1));
	};

	const handleDecrementTimestep = () => {
		const new_time_id = scalar_variable.time_id - 1;

		dispatch(updateTimeId(new_time_id));
	};

	const handleIncrementTimestep = () => {
		const new_time_id = scalar_variable.time_id + 1;

		dispatch(updateTimeId(new_time_id));
	};

	const handleGetLastTimestep = () => {
		// get the last index of the timestep array
		const last_index = timesteps.length - 1;

		// determine a last time_id (add 1, because time_id(PostgreSQL) is 1-based)
		const last_time_id = last_index + 1;

		dispatch(updateTimeId(last_time_id));
	};

	return (
		<Grid container spacing={2} alignItems='center'>
			{/* 현재 */}
			<Grid item xs={3}>
				<Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
					현재
				</Typography>
			</Grid>
			<Grid item xs={9}>
				<TextField
					fullWidth
					size='small'
					select
					// subtract 1 because time_id(PostgreSQL) is one-based index
					value={timesteps[scalar_variable.time_id - 1]}
					onChange={handleUpdateTimestep}
				>
					{timesteps.map((item, ind) => (
						<MenuItem key={ind} value={item}>
							{item}
						</MenuItem>
					))}
				</TextField>
			</Grid>

			{/* 제어 */}
			<Grid item xs={3}>
				<Typography variant='subtitle2' sx={{ color: 'text.secondary' }}>
					제어
				</Typography>
			</Grid>
			<Grid item xs={9}>
				<ButtonGroup sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<IconButton
						// subtract 1 because time_id(PostgreSQL) is one-based index
						disabled={timesteps[scalar_variable.time_id - 1] === dataset.time_start}
						onClick={handleGetFirstTimestep}
					>
						<KeyboardDoubleArrowLeftRounded />
					</IconButton>
					<IconButton
						disabled={timesteps[scalar_variable.time_id - 1] === dataset.time_start}
						onClick={handleDecrementTimestep}
					>
						<KeyboardArrowLeftRounded />
					</IconButton>
					<IconButton
						disabled={timesteps[scalar_variable.time_id - 1] === dataset.time_end}
						onClick={handleIncrementTimestep}
					>
						<KeyboardArrowRightRounded />
					</IconButton>
					<IconButton
						disabled={timesteps[scalar_variable.time_id - 1] === dataset.time_end}
						onClick={handleGetLastTimestep}
					>
						<KeyboardDoubleArrowRightRounded />
					</IconButton>
				</ButtonGroup>
			</Grid>
		</Grid>
	);
};

export default MenuDrawerDatasetDataTime;
