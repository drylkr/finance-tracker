import api from './api';
import { UpdateProfileData, UserProfile } from '../types/user.types';

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get('/users/profile');
  return response.data.user;
};

export const updateProfile = async (data: UpdateProfileData): Promise<UserProfile> => {
  const response = await api.put('/users/profile', data);
  return response.data.user;
};

export const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await api.put('/users/password', { currentPassword, newPassword });
};