import React, { useState } from 'react';

// MUI
import { Slider, Button } from '@mui/material';
import { styled, withStyles } from '@material-ui/core/styles';
import { PlayArrowRounded, PasueRounded } from '@mui/icons-material';

const PositionContainer = styled('div')({
  position: 'absolute',
  zIndex: 1,
  bottom: '40px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const SliderInput = withStyles({
  root: {
    marginLeft: 12,
    width: '40%',
  },
  valueLabel: {
    '& span': {
      whiteSpace: 'nowrap',
      background: 'none',
      color: '#fff',
    },
  },
})(Slider);

const RangeInput = ({ min, max, value, animationSpeed, onChange, formatLabel }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <PositionContainer>
      <Button color='primary' onClick={() => setIsPlaying(!isPlaying)}></Button>
      <SliderInput />
    </PositionContainer>
  );
};

export default RangeInput;
