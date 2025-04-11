import React from 'react';
import { Box, Typography } from '@mui/material';
import { ArrowUpward, ArrowDownward, AttachMoney } from '@mui/icons-material';
import { Transaction } from '../../types/transaction.types';

interface TransactionItemProps {
  transaction: Transaction;
  onClick: (transaction: Transaction) => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, onClick }) => {
  // Choose color based on transaction type
  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Income':
        return 'success.main'; // Green
      case 'Expense':
        return 'error.main'; // Red
      case 'Investment':
        return 'warning.main'; // Yellow/Orange
      default:
        return 'text.primary';
    }
  };
  
  // Choose background color based on transaction type
  const getTypeBgColor = (type: string) => {
    switch(type) {
      case 'Income':
        return 'success.light'; // Light green
      case 'Expense':
        return 'error.light'; // Light red
      case 'Investment':
        return 'warning.light'; // Light yellow/orange
      default:
        return 'rgba(0,0,0,0.05)';
    }
  };
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderRadius: 2,
        mb: 1,
        cursor: 'pointer',
        '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
      }}
      onClick={() => onClick(transaction)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ 
          mr: 2, 
          bgcolor: getTypeBgColor(transaction.type), 
          p: 1.5, 
          borderRadius: '50%' 
        }}>
          <Box sx={{ 
            width: 24, 
            height: 24, 
            bgcolor: getTypeColor(transaction.type),
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {transaction.type === 'Income' && <ArrowUpward sx={{ color: 'white', fontSize: 16 }} />}
            {transaction.type === 'Expense' && <ArrowDownward sx={{ color: 'white', fontSize: 16 }} />}
            {transaction.type === 'Investment' && <AttachMoney sx={{ color: 'white', fontSize: 16 }} />}
          </Box>
        </Box>
        <Box>
          <Typography variant="body1" fontWeight="medium">{transaction.category || 'Uncategorized'}</Typography>
          <Typography variant="body2" color="text.secondary">
            {transaction.notes || (transaction.type === 'Income' ? 'Payment Received' : 'Payment')}
          </Typography>
        </Box>
      </Box>
      <Typography 
        variant="body1" 
        fontWeight="medium" 
        color={getTypeColor(transaction.type)}
      >
        {transaction.type === 'Income' ? '+' : '-'}{Number(transaction.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}$
      </Typography>
    </Box>
  );
};

export default TransactionItem;