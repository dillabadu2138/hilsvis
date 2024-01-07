// React, Redux
import React, { useEffect } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { getSingleBandRaster, getMultiBandRaster } from '../../_actions/rasterAction';

// Components
import DialogRasterDataTable from '../dialog/DialogRasterDataTable';
import MenuDrawerDatasetDataVariable from './MenuDrawerDatasetDataVariable';
import MenuDrawerDatasetDataTime from './MenuDrawerDatasetDataTime';
import MenuDrawerDatasetDataColor from './MenuDrawerDatasetDataColor';
import MenuDrawerDatasetDataGridTest from './MenuDrawerDatasetDataGridTest';

// MUI
import { Box, Typography } from '@mui/material';

const MenuDrawerDatasetData = () => {
	const dispatch = useDispatch();
	const dataset = useSelector((state) => state.dataset.dataset);
	const scalar_variable = useSelector((state) => state.raster.scalar_variable);
	const vector_variable = useSelector((state) => state.raster.vector_variable);

	// control raster re-rendering
	useEffect(() => {
		// should only result in one combined re-render, not two
		batch(() => {
			// get single band raster
			dispatch(
				getSingleBandRaster(dataset.dataset_id, scalar_variable.var_name, scalar_variable.time_id)
			);

			// get multi band raster
			if (vector_variable.var_name !== 'none') {
				dispatch(
					getMultiBandRaster(dataset.dataset_id, vector_variable.var_name, scalar_variable.time_id)
				);
			}
		});
	}, [scalar_variable, vector_variable]);

	return (
		<React.Fragment>
			<Box sx={{ my: '20px' }}>
				<Typography sx={{ fontSize: '14px' }}>
					재현정보 데이터셋 내 시간 및 변수별 데이터 선택
				</Typography>
			</Box>

			{/* 데이터 선택 옵션: 변수 */}
			<Box sx={{ my: '20px' }}>
				<Typography variant='subtitle1' sx={{ fontWeight: 'bold', fontSize: '14px', my: '10px' }}>
					변수
				</Typography>
				<MenuDrawerDatasetDataVariable />
			</Box>

			{/* 데이터 선택 옵션: 시간 */}
			<Box sx={{ my: '20px' }}>
				<Typography variant='subtitle1' sx={{ fontWeight: 'bold', fontSize: '14px', my: '10px' }}>
					시간
				</Typography>
				<MenuDrawerDatasetDataTime />
			</Box>

			{/* 데이터 선택 옵션: 색상 */}
			<Box sx={{ my: '20px' }}>
				<Typography variant='subtitle1' sx={{ fontWeight: 'bold', fontSize: '14px', my: '10px' }}>
					색상
				</Typography>
				<MenuDrawerDatasetDataColor />
			</Box>

			{/* 데이터 선택 옵션: 그리드 포인트 테스트 */}
			{/* <Box sx={{ my: '20px' }}>
        <Typography variant='subtitle1' sx={{ fontWeight: 'bold', fontSize: '14px', my: '10px' }}>
          테스트
        </Typography>
        <MenuDrawerDatasetDataGridTest />
      </Box> */}
		</React.Fragment>
	);
};

export default MenuDrawerDatasetData;
