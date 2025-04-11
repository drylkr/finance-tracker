import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, TransactionFormData, TransactionState } from '../types/transaction.types';
import * as transactionService from '../services/transaction.service';

const initialState: TransactionState = {
  transactions: [],
  filteredTransactions: [],
  isLoading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  'transaction/fetchTransactions',
  async (_, { rejectWithValue }) => {
    try {
      const transactions = await transactionService.getTransactions();
      return transactions;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch transactions');
    }
  }
);

export const addTransaction = createAsyncThunk(
  'transaction/addTransaction',
  async (data: TransactionFormData, { rejectWithValue }) => {
    try {
      const transaction = await transactionService.addTransaction(data);
      return transaction;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add transaction');
    }
  }
);

export const updateTransaction = createAsyncThunk(
  'transaction/updateTransaction',
  async ({ id, data }: { id: string; data: Partial<TransactionFormData> }, { rejectWithValue }) => {
    try {
      const transaction = await transactionService.updateTransaction(id, data);
      return { id, transaction };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update transaction');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'transaction/deleteTransaction',
  async (id: string, { rejectWithValue }) => {
    try {
      await transactionService.deleteTransaction(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete transaction');
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    filterTransactions: (state, action: PayloadAction<{ type?: string; category?: string; startDate?: string; endDate?: string }>) => {
      const { type, category, startDate, endDate } = action.payload;
      let filtered = [...state.transactions];
      
      if (type) {
        filtered = filtered.filter(transaction => transaction.type === type);
      }
      
      if (category) {
        filtered = filtered.filter(transaction => transaction.category === category);
      }
      
      if (startDate) {
        filtered = filtered.filter(transaction => new Date(transaction.date) >= new Date(startDate));
      }
      
      if (endDate) {
        filtered = filtered.filter(transaction => new Date(transaction.date) <= new Date(endDate));
      }
      
      state.filteredTransactions = filtered;
    },
    clearFilters: (state) => {
      state.filteredTransactions = state.transactions;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.isLoading = false;
        state.transactions = action.payload;
        state.filteredTransactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.isLoading = false;
        state.transactions.push(action.payload);
        state.filteredTransactions = state.transactions;
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<{ id: string; transaction: Transaction }>) => {
        state.isLoading = false;
        const index = state.transactions.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.transactions[index] = action.payload.transaction;
          state.filteredTransactions = state.transactions;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
        state.filteredTransactions = state.transactions;
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { filterTransactions, clearFilters, clearError } = transactionSlice.actions;
export default transactionSlice.reducer;