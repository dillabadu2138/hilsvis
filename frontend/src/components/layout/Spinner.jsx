// MUI
import { CircularProgress } from '@mui/material';

const Spinner = () => {
  return (
    <CircularProgress
      color='primary'
      size='5rem'
      sx={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

export default Spinner;
