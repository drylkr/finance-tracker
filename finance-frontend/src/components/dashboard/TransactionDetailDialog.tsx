import React from 'react';
import { Box, Typography, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { ArrowUpward, ArrowDownward, AttachMoney } from '@mui/icons-material';
import { Transaction } from '../../types/transaction.types';

interface TransactionDetailDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
}

const TransactionDetailDialog: React.FC<TransactionDetailDialogProps> = ({ transaction, open, onClose }) => {
  if (!transaction) return null;
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">Transaction Details</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: transaction.type === 'Income' 
              ? 'success.light' 
              : transaction.type === 'Expense'
                ? 'error.light'
                : 'warning.light'
          }}>
            <Box sx={{ 
              mr: 2,
              width: 40,
              height: 40,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: transaction.type === 'Income' 
                ? 'success.main' 
                : transaction.type === 'Expense'
                  ? 'error.main'
                  : 'warning.main'
            }}>
              {transaction.type === 'Income' && <ArrowUpward sx={{ color: 'white' }} />}
              {transaction.type === 'Expense' && <ArrowDownward sx={{ color: 'white' }} />}
              {transaction.type === 'Investment' && <AttachMoney sx={{ color: 'white' }} />}
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Amount</Typography>
              <Typography variant="h4" fontWeight="bold" color={
                transaction.type === 'Income' 
                  ? 'success.main' 
                  : transaction.type === 'Expense'
                    ? 'error.main'
                    : 'warning.main'
              }>
                ${Number(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Type</Typography>
              <Typography variant="body1" fontWeight="medium">{transaction.type}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Category</Typography>
              <Typography variant="body1" fontWeight="medium">{transaction.category || 'Uncategorized'}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Date</Typography>
              <Typography variant="body1" fontWeight="medium">{formatDate(transaction.date)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Transaction ID</Typography>
              <Typography variant="body1" fontWeight="medium" sx={{ wordBreak: 'break-all' }}>{transaction.id}</Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" color="text.secondary">Notes</Typography>
          <Typography variant="body1" mt={1} mb={2}>
            {transaction.notes || 'No notes provided.'}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Created</Typography>
              <Typography variant="body1" fontWeight="medium">{formatDate(transaction.createdAt)}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">Last Updated</Typography>
              <Typography variant="body1" fontWeight="medium">
                {transaction.updatedAt ? formatDate(transaction.updatedAt) : 'Not updated'}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionDetailDialog;