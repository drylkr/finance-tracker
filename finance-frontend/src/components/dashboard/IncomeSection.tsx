import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ArrowUpward } from '@mui/icons-material';
import { Transaction } from '../../types/transaction.types';

interface IncomeSectionProps {
  transactions: Transaction[];
  period?: number;
  onChangePeriod: (period: number) => void;
}

const IncomeSection: React.FC<IncomeSectionProps> = ({ transactions, period = 7, onChangePeriod }) => {
  // Track which bar is being hovered
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Filter only income transactions
  const incomeTransactions = transactions.filter(t => t.type === 'Income');

  // Calculate total income
  const totalIncome = incomeTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  // Get dates for the last N days (based on period)
  const getDaysArray = (period: number) => {
    const result = [];
    for (let i = period - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      result.push(d);
    }
    return result;
  };

  const daysArray = getDaysArray(period);

  // Format date to YYYY-MM-DD for comparison
  const formatDateForComparison = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Group income by day for the selected period
  const dailyIncome = daysArray.map(day => {
    const dayFormatted = formatDateForComparison(day);
    
    const dayIncomes = incomeTransactions.filter(transaction => {
      const txDate = transaction.date ? new Date(transaction.date) : null;
      return txDate && formatDateForComparison(txDate) === dayFormatted;
    });
    
    const totalAmount = dayIncomes.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    
    return {
      date: day,
      displayDate: day.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }),
      shortDisplay: day.toLocaleDateString('en-US', { weekday: 'short' }),
      amount: totalAmount,
      transactions: dayIncomes // Store the actual transactions for this day
    };
  });

  // Find the max value for scaling (ensure it's at least 1 to avoid division by zero)
  const maxTotal = Math.max(...dailyIncome.map(day => day.amount), 1);

  // Generate y-axis labels
  const yAxisLabels = [];
  const stepCount = 5; // Number of steps on y-axis
  
  for (let i = 0; i <= stepCount; i++) {
    const value = Math.round((maxTotal / stepCount) * (stepCount - i));
    yAxisLabels.push({
      value,
      position: (i / stepCount) * 200 // 200px is the height of our chart area
    });
  }

  const handlePeriodChange = () => {
    const newPeriod = period === 7 ? 14 : period === 14 ? 30 : 7;
    if (onChangePeriod) {
      onChangePeriod(newPeriod);
    }
  };

  return (
    <Box sx={{ p: 3, borderRadius: 3, mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6" fontWeight="bold">Income</Typography>
          <Typography variant="h5" fontWeight="bold" color="success.main" mt={1}>
            ${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          size="small"
          endIcon={<ArrowUpward />}
          sx={{ borderRadius: 2 }}
          onClick={handlePeriodChange}
        >
          {period} Days
        </Button>
      </Box>

      <Box sx={{ display: 'flex', mt: 3, height: 220 }}>
        {/* Y-axis */}
        <Box sx={{ width: 50, height: 200, position: 'relative', mr: 1 }}>
          {yAxisLabels.map((label, index) => (
            <Box key={index} sx={{ position: 'absolute', top: label.position, right: 0, transform: 'translateY(-50%)' }}>
              <Typography variant="caption" color="text.secondary" align="right" sx={{ pr: 1 }}>
                ${label.value.toLocaleString()}
              </Typography>
              <Box sx={{ 
                position: 'absolute', 
                right: -8, 
                top: '50%', 
                width: 4, 
                height: 1, 
                bgcolor: 'divider',
                display: index === yAxisLabels.length - 1 ? 'none' : 'block'
              }} />
            </Box>
          ))}
        </Box>

        {/* Bar Chart */}
        <Box sx={{ flex: 1, height: 220, display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
          <Box sx={{ display: 'flex', width: '100%', height: 200, alignItems: 'flex-end' }}>
            {dailyIncome.map((day, index) => (
              <Box 
                key={index} 
                sx={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: hoveredBarIndex === index ? 20 : 1
                }}
              >
                <Box 
                  sx={{ 
                    height: `${Math.max((day.amount / maxTotal) * 200, 4)}px`, 
                    width: 16, 
                    bgcolor: new Date().toLocaleDateString() === day.date.toLocaleDateString() 
                      ? 'success.light' 
                      : 'success.main',
                    borderRadius: 3,
                    mb: 1,
                    '&:hover': {
                      opacity: 0.8,
                      cursor: 'pointer'
                    },
                    position: 'relative'
                  }}
                  onMouseEnter={() => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  {/* Enhanced Tooltip */}
                  {hoveredBarIndex === index && day.transactions.length > 0 && (
                    <Paper
                      elevation={3}
                      sx={{ 
                        position: 'absolute', 
                        bottom: '100%',
                        left: '50%', 
                        transform: 'translateX(-50%)', 
                        minWidth: '180px',
                        maxWidth: '250px',
                        p: 1,
                        mt: '-8px',
                        zIndex: 10,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ borderBottom: '1px solid #eee', pb: 0.5, mb: 0.5 }}>
                        {day.displayDate}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main" sx={{ mb: 1 }}>
                        Total: ${day.amount.toFixed(2)}
                      </Typography>
                      
                      {/* Transaction List */}
                      <Box sx={{ maxHeight: '150px', overflowY: 'auto' }}>
                        {day.transactions.map((tx, txIndex) => (
                          <Box 
                            key={txIndex} 
                            sx={{ 
                              mb: 0.5,
                              pb: 0.5,
                              borderBottom: txIndex < day.transactions.length - 1 ? '1px dashed #eee' : 'none'
                            }}
                          >
                            <Typography variant="caption" fontWeight="medium" display="block">
                              {tx.category || 'Uncategorized'}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="caption" color="text.secondary">
                                {tx.notes?.substring(0, 20) || 'No notes'}
                                {tx.notes && tx.notes.length > 20 ? '...' : ''}
                              </Typography>
                              <Typography variant="caption" fontWeight="bold">
                                ${Number(tx.amount).toFixed(2)}
                              </Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Paper>
                  )}
                </Box>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{
                    fontSize: '0.65rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%'
                  }}
                >
                  {period <= 14 ? day.shortDisplay : day.shortDisplay}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default IncomeSection;