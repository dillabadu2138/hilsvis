import React from 'react';
import { useSelector } from 'react-redux';

// MUI
import { Stack, Alert, AlertTitle } from '@mui/material';

const CustomAlert = () => {
  const alerts = useSelector((state) => state.alerts);

  return (
    <Stack
      spacing={2}
      sx={{
        zIndex: 2000,
        position: 'absolute',
        bottom: '20px',
        right: '20px',
      }}
    >
      {alerts.map((alert) => (
        <Alert key={alert.id} variant='filled' severity={alert.alertType}>
          <AlertTitle>에러 메세지</AlertTitle>
          {alert.message}
        </Alert>
      ))}
    </Stack>
  );
};

export default CustomAlert;
