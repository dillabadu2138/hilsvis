import React from 'react';

// MUI
import {
  Dialog,
  DialogContent,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';

const DialogCharacteristicDescription = ({ handleSelectNode, node }) => {
  const handleClose = () => {
    handleSelectNode(node.id);
  };

  return (
    <Dialog open={true} onClose={handleClose}>
      <DialogContent>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Typography sx={{ mb: 2 }} variant='h5' component='div'>
              {node.title}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              {`설명: ${node.description}`}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color='text.secondary'>
              {`출처: ${node.source}`}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size='small' href={node.url} target='_blank'>
              자세히 알아보기
            </Button>
          </CardActions>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCharacteristicDescription;
