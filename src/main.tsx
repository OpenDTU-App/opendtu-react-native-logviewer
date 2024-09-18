import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import LogFileProvider from './contexts/LogFileContext';

import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LogFileProvider>
        <App />
      </LogFileProvider>
    </ThemeProvider>
  </StrictMode>,
);
