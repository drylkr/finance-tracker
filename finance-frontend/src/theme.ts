import { createTheme } from '@mui/material/styles';
import '@fontsource/poppins/100.css';  // Thin weight
import '@fontsource/poppins/200.css';  // Extra-light weight
import '@fontsource/poppins/300.css';  // Light weight
import '@fontsource/poppins/400.css';  // Regular weight 
import '@fontsource/poppins/500.css';  // Medium weight
import '@fontsource/poppins/600.css';  // Semi-bold weight
import '@fontsource/poppins/700.css';  // Bold weight
import '@fontsource/poppins/800.css';  // Extra-bold weight
import '@fontsource/poppins/900.css';  // Black weight
import { indigo, grey, green, yellow, red } from '@mui/material/colors';


const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
    fontWeightLight: 300,  // You can specify the light weight if needed
    fontWeightRegular: 400,  // Regular weight
    fontWeightMedium: 500,  // Medium weight
    fontWeightBold: 700,  // Bold weight
  },
  palette: {
    primary: {
      main: indigo['A700'], 
      light: '#e8eaf6'
    },
    secondary: {
      main: grey[200],
      dark: grey[500]
    },
    success: {
      main: green[500],
      light: 'rgba(76,175,80,0.1)'
    },
    error: {
      main: red[500],
      light: 'rgba(244,67,54,0.1)'
    },
    warning: {
      main: yellow[800],
      light: 'rgba(255,152,0,0.1)'
    },
  },
  shape: {
    borderRadius: 8, // Adjust rounded corners globally
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Avoid all-uppercase text
          borderRadius: '8px',
        },
      },
    },
  },
});

export default theme;
