import api from './api';
import { Transaction, TransactionFormData } from '../types/transaction.types';

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get('/user/data');
  return response.data.financialData;
};

export const addTransaction = async (data: TransactionFormData): Promise<Transaction> => {
  const response = await api.post('/user/data', data);
  return response.data;
};

export const updateTransaction = async (id: string, data: Partial<TransactionFormData>): Promise<Transaction> => {
  const response = await api.put(`/user/data/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/users/data/${id}`);
};

