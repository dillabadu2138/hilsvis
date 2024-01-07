import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deselectDataset } from '../../_actions/datasetAction';
import { clearSingleBandRaster, clearMultiBandRaster } from '../../_actions/rasterAction';

// Components
import DialogDatasetSearch from '../dialog/DialogDatasetSearch';
import DialogDatasetTable from '../dialog/DialogDatasetTable';
import MenuDrawerDatasetData from './MenuDrawerDatasetData.jsx';

// MUI
import {
  Box,
  Typography,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { AddRounded, DeleteRounded, InfoRounded } from '@mui/icons-material';

const sxBox = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  my: '10px',
  '& .MuiTypography-root': {
    fontSize: '14px',
  },
};
const sxList = {
  display: 'flex',
  flexDirection: 'column',
  '& .MuiListItem-root': {
    p: '0px',
  },
  '& .MuiListItemButton-root': {
    p: '0px',
    m: '4px',
  },
  '& .MuiIconButton-root': {
    p: '3px',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
  },
};
const sxListPriTypo = { fontSize: 11, lineHeight: '15px' };
const sxListSecTypo = {
  fontSize: 10,
  lineHeight: '15px',
  color: 'rgba(150,150,150)',
};

const MenuDrawerDataset = () => {
  const dispatch = useDispatch();
  const dataset = useSelector((state) => state.dataset.dataset);

  const [openSearchDialog, setOpenSearchDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [isBtnShown, setIsBtnShown] = useState(false);

  const toggleSearchDialog = () => {
    setOpenSearchDialog(!openSearchDialog);
  };

  const toggleInfoDialog = () => {
    setOpenInfoDialog(!openInfoDialog);
  };

  const handleDeselectDataset = () => {
    dispatch(deselectDataset());

    // clear rasters
    dispatch(clearSingleBandRaster());
    dispatch(clearMultiBandRaster());

    // reset dialog states
    //setOpenInfoDialog(false);
    //setOpenSearchDialog(false);
  };

  return (
    <React.Fragment>
      {/* 데이터셋 추가 */}
      <Box sx={{ ...sxBox }}>
        <Typography sx={{ my: '10px' }}>재현정보 데이터셋</Typography>
        {dataset === null && (
          <Button
            variant='contained'
            size='small'
            startIcon={<AddRounded />}
            onClick={toggleSearchDialog}
          >
            추가
          </Button>
        )}
      </Box>

      {/* 데이터셋 검색 다이얼로그 */}
      {openSearchDialog && <DialogDatasetSearch toggleSearchDialog={toggleSearchDialog} />}

      {/* 선택된 데이터셋 */}
      {dataset && (
        <React.Fragment>
          <List sx={{ ...sxList }}>
            <ListItem
              onMouseEnter={() => setIsBtnShown(true)}
              onMouseLeave={() => setIsBtnShown(false)}
            >
              <ListItemButton onClick={toggleInfoDialog}>
                <ListItemText
                  primary={dataset.dataset_name}
                  primaryTypographyProps={{ ...sxListPriTypo }}
                  secondary={`데이터셋 식별자 = ${dataset.dataset_id}`}
                  secondaryTypographyProps={{ ...sxListSecTypo }}
                />
                {isBtnShown && (
                  <IconButton size='small' onClick={handleDeselectDataset}>
                    <DeleteRounded />
                  </IconButton>
                )}
                <IconButton size='small' onClick={toggleInfoDialog}>
                  <InfoRounded />
                </IconButton>
              </ListItemButton>
            </ListItem>
          </List>

          {/* 데이터셋 정보 다이얼로그 */}
          {openInfoDialog && <DialogDatasetTable toggleInfoDialog={toggleInfoDialog} />}

          <Divider />

          {/* 래스터 데이터 세부 선택 옵션 */}
          <MenuDrawerDatasetData />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default MenuDrawerDataset;
