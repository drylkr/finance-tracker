import React from 'react';
import { Box, Typography, IconButton, Card } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: number | string;
  color: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, color }) => (
  <Card sx={{ p: 3, bgcolor: color, borderRadius: 2, height: '100%', position: 'relative', overflow: 'visible' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Typography variant="body2" color="text.secondary" fontWeight="medium">
        {title}
      </Typography>
      <IconButton size="small" sx={{ bgcolor: 'white', width: 32, height: 32 }}>
        <ArrowForward fontSize="small" />
      </IconButton>
    </Box>
    <Typography variant="h4" fontWeight="bold" my={1}>
      ${typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
    </Typography>
  </Card>
);

export default MetricCard;