import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import theme from './theme';
import App from './App'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}> 
      <ThemeProvider theme={theme}> 
        <CssBaseline />
        <App /> 
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
