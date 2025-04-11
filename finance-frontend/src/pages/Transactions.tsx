import { Box, Button, useTheme, Typography, CircularProgress, ButtonGroup } from "@mui/material";
import TransactionFilters from "../components/transactions/TransactionFilters";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";
import { useTransactions } from "../hooks/useTransactions";
import { useState, useEffect, useRef } from "react";

const Transactions = () => {
  const theme = useTheme();
  const initialLoadDone = useRef(false);

  const {
    filteredTransactions,
    selectedTransaction,
    handleFilter,
    handleEdit,
    handleAddTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    isLoading,
    refreshTransactions,
  } = useTransactions();

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [localLoading, setLocalLoading] = useState(true);
  const [showEmptyState, setShowEmptyState] = useState(false);

  // Only refresh once when component first mounts
  useEffect(() => {
    if (!initialLoadDone.current && refreshTransactions) {
      refreshTransactions();
      initialLoadDone.current = true;
    }
  }, [refreshTransactions]);
  
  // Handle loading states more carefully
  useEffect(() => {
    if (!isLoading) {
      // We wait for data to be fully loaded
      const timer = setTimeout(() => {
        setLocalLoading(false);
        // Only show empty state if transactions are definitely empty
        setShowEmptyState(!(filteredTransactions && filteredTransactions.length > 0));
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading, filteredTransactions]);

  // Safeguard against undefined data
  const sortedTransactions = filteredTransactions && filteredTransactions.length > 0 
    ? [...filteredTransactions].sort((a, b) =>
        sortOrder === "newest"
          ? new Date(b.date).getTime() - new Date(a.date).getTime()
          : new Date(a.date).getTime() - new Date(b.date).getTime()
      ) 
    : [];

  // Handle manual refresh with loading state
  const handleManualRefresh = () => {
    setLocalLoading(true);
    setShowEmptyState(false);
    if (refreshTransactions) {
      refreshTransactions();
    }
  };

  return (
    <div>
      {/* Header Row: Title on left, Buttons and Form on right */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" my={4}>
        <Typography variant="h4" fontWeight="bold">
          Transactions
        </Typography>

        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          {/* Sorting ButtonGroup */}
          <ButtonGroup size="small" variant="contained" disableElevation
                sx={{
                  "& .MuiButtonGroup-grouped:not(:last-of-type)": {
                    borderColor: "transparent"
                  }
                }}>
            <Button
              sx={{
                backgroundColor: sortOrder === "newest" ? '#bdbdbd' : theme.palette.secondary.main,
                color: sortOrder === "newest"
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: sortOrder === "newest" ? '#bdbdbd' : theme.palette.secondary.dark,
                },
              }}
              onClick={() => setSortOrder("newest")}
            >
              Newest
            </Button>
            <Button
              sx={{
                backgroundColor: sortOrder === "oldest" ? '#bdbdbd' : theme.palette.secondary.main,
                color: sortOrder === "oldest"
                  ? theme.palette.primary.contrastText
                  : theme.palette.text.secondary,
                "&:hover": {
                  backgroundColor: sortOrder === "oldest" ? '#bdbdbd' : theme.palette.secondary.dark,
                },
              }}
              onClick={() => setSortOrder("oldest")}
            >
              Oldest
            </Button>
          </ButtonGroup>

          {/* Add Transaction Form */}
          <TransactionForm
            onSave={handleAddTransaction}
            onUpdate={handleUpdateTransaction}
            transaction={selectedTransaction}
          />
        </Box>
      </Box>

      {/* Filters */}
      <TransactionFilters onFilter={handleFilter} />

      {/* Show loading spinner or transaction list */}
      {isLoading || localLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {!showEmptyState && sortedTransactions.length > 0 ? (
            <TransactionList
              transactions={sortedTransactions}
              onEdit={handleEdit}
              onDelete={handleDeleteTransaction}
            />
          ) : (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="40vh" gap={2}>
              <Typography variant="h6" color="text.secondary">
                No transactions found. Add a new transaction to get started.
              </Typography>
              <Button 
                variant="contained" 
                color="primary"
                onClick={handleManualRefresh}
              >
                Refresh Transactions
              </Button>
            </Box>
          )}
        </>
      )}
    </div>
  );
};

export default Transactions;