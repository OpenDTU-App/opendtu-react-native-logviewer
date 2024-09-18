import { styled } from '@mui/material';

const Pre = styled('pre')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  color: theme.palette.error.main,
  overflow: 'auto',
  fontFamily: 'monospace',
}));

export default Pre;
