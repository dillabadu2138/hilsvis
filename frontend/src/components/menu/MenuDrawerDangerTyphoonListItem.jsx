import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteTyphoonByTyphoonId } from '../../_actions/dangerAction';

// Components
import DialogDangerLayerTable from '../dialog/DialogDangerLayerTable';

// MUI
import { IconButton, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { DeleteRounded, TableRowsRounded } from '@mui/icons-material';

const sxListPriTypo = { fontSize: 14, lineHeight: '15px' };
const sxListSecTypo = {
  fontSize: 12,
  lineHeight: '15px',
  color: 'rgba(150,150,150)',
};

const MenuDrawerDangerTyphoonListItem = ({ typhoon: { typhoon_id, typhoon_name } }) => {
  const dispatch = useDispatch();

  const [isDeleteBtnShown, setIsDeleteBtnShown] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const toggleDialog = () => {
    setOpenDialog(!openDialog);
  };

  return (
    <React.Fragment>
      <ListItem
        onMouseEnter={() => setIsDeleteBtnShown(true)}
        onMouseLeave={() => setIsDeleteBtnShown(false)}
      >
        <ListItemButton>
          <ListItemText
            primary={typhoon_name}
            primaryTypographyProps={{ ...sxListPriTypo }}
            secondary={`태풍아이디 식별자 = ${typhoon_id}`}
            secondaryTypographyProps={{ ...sxListSecTypo }}
          />
          {isDeleteBtnShown && (
            <IconButton onClick={() => dispatch(deleteTyphoonByTyphoonId(typhoon_id))}>
              <DeleteRounded />
            </IconButton>
          )}
          <IconButton onClick={toggleDialog}>
            <TableRowsRounded />
          </IconButton>
        </ListItemButton>
      </ListItem>

      {/* 데이터셋 정보 다이얼로그 */}
      {openDialog && (
        <DialogDangerLayerTable
          toggleDialog={toggleDialog}
          typhoonId={typhoon_id}
          typhoonName={typhoon_name}
        />
      )}
    </React.Fragment>
  );
};

export default MenuDrawerDangerTyphoonListItem;
