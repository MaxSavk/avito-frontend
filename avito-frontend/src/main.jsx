// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AppRouter from './router';            
import './index.css';                        

const theme = createTheme({
  palette: {
    background: {
      default: '#f5f7fa',   
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRouter />
    </ThemeProvider>
  </React.StrictMode>,
);
