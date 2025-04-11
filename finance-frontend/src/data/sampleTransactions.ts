import { Transaction } from '../types/transaction.types';

// Default/sample data for when real data isn't available yet
export const sampleTransactions: Transaction[] = [
  {
    id: '1',
    type: 'Income',
    category: 'Salary',
    amount: 3000,
    date: new Date().toISOString(),
    notes: 'Monthly salary',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    type: 'Expense',
    category: 'Rent',
    amount: 1200,
    date: new Date().toISOString(),
    notes: 'Monthly rent',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    type: 'Expense',
    category: 'Groceries',
    amount: 200,
    date: new Date().toISOString(),
    notes: 'Weekly groceries',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    type: 'Expense',
    category: 'Electric Bill',
    amount: 85,
    date: new Date().toISOString(),
    notes: 'Monthly bill',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    type: 'Investment',
    category: 'Stocks',
    amount: 500,
    date: new Date().toISOString(),
    notes: 'Investment in stocks',
    createdAt: new Date().toISOString()
  }
];

export default sampleTransactions;