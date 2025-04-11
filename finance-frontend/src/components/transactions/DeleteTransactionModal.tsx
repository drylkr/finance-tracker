import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  useTheme,
  Box
} from '@mui/material';
import { Transaction } from '../../types/transaction.types';
import { DeleteForeverOutlined } from '@mui/icons-material';

interface DeleteTransactionModalProps {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteTransactionModal: React.FC<DeleteTransactionModalProps> = ({
  open,
  transaction,
  onClose,
  onConfirm
}) => {
  const theme = useTheme();
  if (!transaction) return null;

  const readonlyStyle = {
    inputProps: { readOnly: true },
    sx: {
      '& .MuiInputBase-input.Mui-disabled': {
        WebkitTextFillColor: theme.palette.text.primary, // keep text color strong
      },
      backgroundColor: theme.palette.action.hover, // subtle background
      borderRadius: 1,
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {/* <DialogTitle color="error.main">Delete Transaction?</DialogTitle> */}
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1} color="error.main">
            <DeleteForeverOutlined /> Delete Transaction?
        </Box>
    </DialogTitle>
      <DialogContent dividers>
        <Typography variant="caption" color="text.secondary">
          Are you sure you want to delete this transaction? This action cannot be undone.
        </Typography>

        <Grid container spacing={2} my={1}>
          <Grid item xs={6}>
            <TextField
              label="Type"
              value={transaction.type}
              fullWidth
              disabled
              size='small'
              {...readonlyStyle}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Category"
              value={transaction.category}
              fullWidth
              disabled
              size='small'
              {...readonlyStyle}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Amount"
              value={`$${transaction.amount}`}
              fullWidth
              disabled
              size='small'
              {...readonlyStyle}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date"
              value={transaction.date ? new Date(transaction.date).toLocaleDateString() : ''}
              fullWidth
              disabled
              size='small'
              {...readonlyStyle}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Notes"
              value={transaction.notes || ''}
              fullWidth
              multiline
              disabled
              size='small'
              {...readonlyStyle}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ borderColor: 'secondary.dark', color: 'secondary.dark' }}>
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="outlined" disableElevation>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTransactionModal;
