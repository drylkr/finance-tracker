import { useState, useEffect, useCallback  } from "react";
import { getTransactions, addTransaction, deleteTransaction, updateTransaction } from "../services/api";
import { Transaction, TransactionFormData } from "../types/transaction.types";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getTransactions();
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await getTransactions();
      console.log("Raw Transactions from Firebase:", data);
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (filters: {
    search: string;
    startDate: string;
    endDate: string;
    types: string[]; // Changed from 'type: string' to 'types: string[]'
    amountRange: [number, number];
  }) => {
    const filtered = transactions.filter(transaction => {
      // Search filter
      const searchMatch = !filters.search || 
        transaction.type.toLowerCase().includes(filters.search.toLowerCase()) ||
        transaction.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        (transaction.notes && transaction.notes.toLowerCase().includes(filters.search.toLowerCase()));
      
      // Date range filter
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;
      const transactionDate = new Date(transaction.date);
      
      const dateMatch = 
        (!startDate || transactionDate >= startDate) && 
        (!endDate || transactionDate <= endDate);
      
      // Type filter - Changed to handle array of types
      const typeMatch = filters.types.length === 0 || filters.types.includes(transaction.type);
      
      // Amount range filter
      const amountMatch = 
        transaction.amount >= filters.amountRange[0] && 
        transaction.amount <= filters.amountRange[1];
      
      return searchMatch && dateMatch && typeMatch && amountMatch;
    });
    
    setFilteredTransactions(filtered);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(null); // Reset first
    setTimeout(() => setSelectedTransaction(transaction), 0); // Delay for re-render
  };

  const handleAddTransaction = async (formData: TransactionFormData) => {
    try {
      const newTransaction = await addTransaction(formData);
      
      
      if (newTransaction && newTransaction.id) {
        setTransactions((prev) => [...prev, newTransaction]);
        setFilteredTransactions((prev) => [...prev, newTransaction]);
      } else {
        await fetchTransactions();
      }
    } catch (error) {
      await fetchTransactions();
    }
  };

  const handleUpdateTransaction = async (id: string, formData: TransactionFormData) => {
    try {
      await updateTransaction(id, formData);
      
      const updateState = (prevState: Transaction[]) => {
        return prevState.map(tx => {
          if (tx.id === id) {
            return {
              ...tx,
              ...formData,
              updatedAt: new Date().toISOString()
            };
          }
          return tx;
        });
      };
      
      setTransactions(updateState);
      setFilteredTransactions(updateState);
      
      setSelectedTransaction(null);
      
    } catch (error) {
      await fetchTransactions();
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      setFilteredTransactions((prev) => prev.filter((tx) => tx.id !== id));
    } catch (error) {
    }
  };

  return {
    filteredTransactions,
    transactions,
    selectedTransaction,
    isLoading,
    handleFilter,
    handleEdit,
    handleAddTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    refreshTransactions: fetchTransactions,
  };
};