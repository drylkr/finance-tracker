import React from 'react';
import { Box, Typography } from '@mui/material';

interface SpendingCategoryProps {
  icon: React.ReactNode;
  title: string; 
  amount: number;
}

const SpendingCategory: React.FC<SpendingCategoryProps> = ({ icon, title, amount }) => (
  <Box sx={{ 
    p: 2, 
    borderRadius: 3, 
    bgcolor: 'background.paper', 
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  }}>
    {/* Category Icon */}
    <Box 
      sx={{ 
        mb: 1, 
        p: 1.5, 
        borderRadius: 2, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40
      }}
    >
      {icon}
    </Box>

    {/* Category Name */}
    <Typography variant="body2" fontWeight="normal" color="text.secondary">
      {title}
    </Typography>

    {/* Amount */}
    <Typography variant="h6" fontWeight="medium">
      ${typeof amount === 'number' ? amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : amount}
    </Typography>
  </Box>
);

export default SpendingCategory;
