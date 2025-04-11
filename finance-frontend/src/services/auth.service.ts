import api from './api.ts'
import { LoginCredentials, RegisterCredentials, User } from '../types/auth.types.ts'

export const login = async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  };

export const register = async (userData: RegisterCredentials) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  };

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async (): Promise<User> => {
const response = await api.get('/users/profile');
return response.data.user;
};