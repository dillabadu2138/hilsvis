import React, { useState } from 'react';

// Components
import DialogConditionSearch from '../dialog/DialogConditionSearch';
import MenuDrawerConditionTidalCurrents from './MenuDrawerConditionTidalCurrents';

// MUI
import { Box, Typography, Button, Menu, MenuItem, ListItemText } from '@mui/material';
import { AddRounded } from '@mui/icons-material';

const sxBox = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  my: '10px',
  '& .MuiTypography-root': {
    fontSize: '14px',
  },
};

const MenuDrawerCondition = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openSearchDialog, setOpenSearchDialog] = useState(false);

  const hanldeClickAddBtn = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAddBtn = () => {
    setAnchorEl(null);
  };

  const toggleSearchDialog = () => {
    // close anchor
    setAnchorEl(null);

    setOpenSearchDialog(!openSearchDialog);
  };

  return (
    <React.Fragment>
      {/* 데이터셋 추가 */}
      <Box sx={{ ...sxBox }}>
        <Typography sx={{ my: '10px' }}>해양상태 데이터셋</Typography>
        <Button
          variant='contained'
          size='small'
          startIcon={<AddRounded />}
          onClick={hanldeClickAddBtn}
        >
          추가
        </Button>

        {/* 해양상태 선택 메뉴 */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseAddBtn}>
          <MenuItem onClick={toggleSearchDialog}>
            <ListItemText primary='최강 창·낙조류' />
          </MenuItem>
          <MenuItem disabled>
            <ListItemText primary='실측 조위' />
          </MenuItem>
        </Menu>
      </Box>

      {/* 목록 검색 다이얼로그 */}
      {openSearchDialog && <DialogConditionSearch toggleDialog={toggleSearchDialog} />}

      {/* 데이터 리스트 */}
      <MenuDrawerConditionTidalCurrents />
    </React.Fragment>
  );
};

export default MenuDrawerCondition;
