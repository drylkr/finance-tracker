export type TransactionType = 'Income' | 'Expense' | 'Investment';

export interface Transaction {
    id: string;
    userId?: string;
    type: TransactionType;
    category: string;
    amount: number;
    date: string;
    notes?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface TransactionState {
    transactions: Transaction[];
    filteredTransactions: Transaction[];
    isLoading: boolean;
    error: string | null;
}

export interface TransactionFormData {
    type: TransactionType;
    category: string;
    amount: number;
    date: string;
    notes?: string;
}