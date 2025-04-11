import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, IconButton, CircularProgress } from '@mui/material';
import { MoreHoriz, ArrowUpward, ArrowDownward, ArrowForward } from '@mui/icons-material';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../types/transaction.types';
import { getTopExpenseCategories, getCategoryIcon } from '../utils/dashboardHelpers';
import MetricCard from '../components/dashboard/MetricCard';
import BarChart from '../components/dashboard/BarChart';
import SpendingCategory from '../components/dashboard/SpendingCategory';
import TransactionItem from '../components/dashboard/TransactionItem';
import TransactionDetailDialog from '../components/dashboard/TransactionDetailDialog';
import IncomeSection from '../components/dashboard/IncomeSection';
import sampleTransactions from '../data/sampleTransactions';

// Dynamic icon imports
import { Fastfood, ShoppingBag, DirectionsCar, LocalHospital, Category } from '@mui/icons-material';

// Helper function to get the icon component based on name
const getIconComponent = (iconName: string) => {
  switch(iconName) {
    case 'Fastfood':
      return <Fastfood />;
    case 'ShoppingBag':
      return <ShoppingBag />;
    case 'DirectionsCar':
      return <DirectionsCar />;
    case 'LocalHospital':
      return <LocalHospital />;
    default:
      return <Category />;
  }
};

const Dashboard: React.FC = () => {
  const { 
    transactions: apiTransactions, 
    filteredTransactions, 
    isLoading, 
  } = useTransactions();
  
  const [spendingPeriod, setSpendingPeriod] = useState(12);
  const [localLoading, setLocalLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [period, setPeriod] = React.useState(12);

  
  // Use either API transactions or sample data if API transactions are empty
  const transactions = apiTransactions && apiTransactions.length > 0 
    ? apiTransactions 
    : sampleTransactions;
  
  // Ensure we're not endlessly loading
  useEffect(() => {
    // Set loading to false after a timeout to prevent endless loading
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Set loading to false when transactions are available
  useEffect(() => {
    if (apiTransactions && apiTransactions.length > 0) {
      setLocalLoading(false);
    }
  }, [apiTransactions]);

  // Calculate metrics from transactions
  const totalIncome = transactions
    .filter(t => t.type === 'Income')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    
  const totalInvestments = transactions
    .filter(t => t.type === 'Investment')
    .reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
    
  // Calculate balance (income - expense)
  const balance = totalIncome - totalExpense;
  
  // Get top expense categories
  const topExpenseCategories = getTopExpenseCategories(transactions);
  
  // Get the most recent transactions for display - UPDATED to 6 instead of 5
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);
  
  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDialogOpen(true);
  };
  
  const closeDialog = () => {
    setDialogOpen(false);
  };
  
  return (
    <Box sx={{ mx: 'auto', pb: 8 }}> 
      <Box my={4}>
        <Typography variant="h4" fontWeight="bold">
          Welcome back
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to dashboard
        </Typography>
      </Box>
      
      {localLoading && isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}> 
          {/* First row: Metric cards in 2x2 grid */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={3} height="100%">
              <Grid item xs={12} sm={6}>
                <MetricCard 
                  title="Total Income" 
                  value={totalIncome} 
                  color="rgba(209, 231, 221, 0.9)" // Income - Green tint
                  icon={<ArrowUpward />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MetricCard 
                  title="Total Expense" 
                  value={totalExpense} 
                  color="rgba(248, 215, 218, 0.9)" // Expense - Red tint
                  icon={<ArrowDownward />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MetricCard 
                  title="Total Investments" 
                  value={totalInvestments} 
                  color="rgba(255, 236, 181, 0.9)" // Investment - Yellow tint
                  icon={<ArrowForward />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <MetricCard 
                  title="Balance" 
                  value={balance} 
                  color="rgba(207, 226, 255, 0.9)" // Balance - Blue tint
                  icon={<ArrowUpward />}
                />
              </Grid>
            </Grid>
          </Grid>
          
          {/* Second row - right side: Spending graph */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, borderRadius: 2, height: '94%', overflow: 'visible' }}>
            <BarChart 
              transactions={filteredTransactions || transactions} 
              period={spendingPeriod}
              onChangePeriod={setSpendingPeriod}
            />
          </Card>
        </Grid>
          
          {/* Third row: Recent transactions*/}
          <Grid item xs={12} md={5}>
            <Card sx={{ p: 2, height: { md: '600px' } }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" fontWeight="bold">Recent Transaction</Typography>
                <IconButton size="small">
                  <MoreHoriz fontSize="small" />
                </IconButton>
              </Box>
              
              <Box>
                {recentTransactions.map((transaction) => (
                  <TransactionItem 
                    key={transaction.id} 
                    transaction={transaction}
                    onClick={() => handleTransactionClick(transaction)}
                  />
                ))}
              </Box>
            </Card>
          </Grid>
          
          {/* Fourth row: Top expense categories */}
          <Grid item xs={12} md={7}>
            <Box>
              {/* Top Expense Categories */}
              <Card sx={{ p: 2, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight="bold">Top Expenses</Typography>
                  <IconButton size="small">
                    <MoreHoriz fontSize="small" />
                  </IconButton>
                </Box>

                <Grid container spacing={2} justifyContent="flex-start">
                  {topExpenseCategories.map((category) => (
                    <Grid item xs={12} sm={4} md={2.4} key={category.category}>
                      <SpendingCategory
                        icon={getIconComponent(getCategoryIcon(category.category))}
                        title={category.category}
                        amount={category.amount}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Card>

              {/* New Income Section - Positioned Below */}
              <Card sx={{ borderRadius: 2, overflow: 'visible' }}>
                <IncomeSection 
                  transactions={transactions} 
                  onChangePeriod={setPeriod} 
                  period={period} 
                />
              </Card>

            </Box>
          </Grid>

        </Grid>
      )}
      
      {/* Transaction Detail Dialog */}
      <TransactionDetailDialog
        open={dialogOpen}
        onClose={closeDialog}
        transaction={selectedTransaction}
      />
    </Box>
  );
};

export default Dashboard;