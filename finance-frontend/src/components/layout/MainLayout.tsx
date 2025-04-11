import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Box, CssBaseline } from '@mui/material';

const MainLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      
      {/* Navbar at the top */}
      <Navbar />
      
      {/* Main content area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          px: 5,
          width: '100%',
          backgroundColor: '#f9f9f9'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;