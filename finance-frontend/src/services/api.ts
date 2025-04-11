import axios from 'axios';
import { Transaction, TransactionFormData } from '../types/transaction.types';

// Dynamically set API URL based on environment
const API_URL = import.meta.env.PROD 
    ? '/' // Use relative URL in production, will be handled by Vercel
    : 'http://localhost:5000/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Add request interceptor to add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle unauthorized error
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
      const response = await api.get('/user/data');
      
      if (response.data && Array.isArray(response.data.financialData)) {
          return response.data.financialData;
      }

      console.error("Unexpected API response format:", response.data);
      return []; 
  } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
  }
};

export const updateTransaction = async (transactionId: string, transactionData: TransactionFormData): Promise<void> => {
  try {
      await api.put(`/user/data/${transactionId}`, transactionData);
  } catch (error) {
      console.error('Error updating transaction:', error);
      throw error;
  }
};

export const addTransaction = async (transactionData: TransactionFormData): Promise<Transaction> => {
    try {
        const response = await api.post('/user/data', transactionData);
        
        if (response.data && response.data.id && !response.data.type) {
            const newTransaction: Transaction = {
                id: response.data.id,
                ...transactionData,
                userId: '', 
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString() 
            };
            return newTransaction;
        }
        
        return response.data;
    } catch (error) {
        console.error('Error adding transaction:', error);
        throw error;
    }
};

export const deleteTransaction = async (transactionId: string): Promise<void> => {
    try {
        await api.delete(`/user/data/${transactionId}`);
    } catch (error) {
        console.error('Error deleting transaction:', error);
        throw error;
    }
};

export default api;