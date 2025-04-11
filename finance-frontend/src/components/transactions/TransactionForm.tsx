import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, Box, FormControl, FormLabel } from '@mui/material';
import { Transaction, TransactionFormData, TransactionType } from '../../types/transaction.types';

interface TransactionFormProps {
  onSave: (transaction: TransactionFormData) => Promise<void>;
  onUpdate?: (id: string, transaction: TransactionFormData) => Promise<void>;
  transaction?: Transaction | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, onUpdate, transaction }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<TransactionFormData>({
    type: 'Expense',
    category: '',
    amount: 0,
    date: '',
    notes: '',
  });

  useEffect(() => {
    if (transaction) {
      console.log("Transaction received for editing:", transaction);
      // Format the date for the date input (YYYY-MM-DD)
      let formattedDate = '';
      if (transaction.date) {
        const date = new Date(transaction.date);
        formattedDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
      }

      setFormData({
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        date: formattedDate,
        notes: transaction.notes || '',
      });
      setOpen(true); 
    }
  }, [transaction]);
  

  const handleOpen = () => {
    setFormData({  // Reset form data when opening for new transaction
      type: 'Expense',
      category: '',
      amount: 0,
      date: '',
      notes: '',
    });
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    const formDataWithStandardDate = {
      ...formData,
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
    };
  
    try {
      console.log("Form data before save:", formDataWithStandardDate);
      if (transaction && onUpdate) {
        await onUpdate(transaction.id, formDataWithStandardDate);
      } else {
        await onSave(formDataWithStandardDate);
      }
      handleClose();
    } catch (error) {
    }
  };
  

  return (
    <>
      {/* Add Transaction Button (Now inside TransactionForm) */}
      <Button variant="contained" onClick={handleOpen}>
        Add Transaction
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{transaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel sx={{ mb: 1 }}>Type</FormLabel>
            <Grid container spacing={1}>
              {['Income', 'Expense', 'Investment'].map((option) => (
                <Grid item key={option}>
                  <Box
                    sx={{
                      bgcolor: formData.type === option 
                        ? option === 'Income' ? '#d1e7dd' 
                        : option === 'Expense' ? '#f8d7da' 
                        : '#ffecb5'
                        : '#f0f0f0',
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 1.5,
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      transition: '0.2s ease-in-out',
                      textAlign: 'center',
                      '&:hover': { opacity: 0.85 },
                    }}
                    onClick={() => setFormData({ ...formData, type: option as TransactionType })}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </FormControl>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Category"
                fullWidth
                variant="outlined"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Amount"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button variant="outlined" onClick={handleClose} sx={{ borderColor: 'secondary.dark', color: 'secondary.dark' }}>Cancel</Button>
          <Button variant="outlined"onClick={handleSave}>
            {transaction ? 'Save Changes' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TransactionForm;