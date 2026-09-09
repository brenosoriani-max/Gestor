import api from './api';
import { User } from '@/types';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: Partial<User> & { password: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

export const banksService = {
  getAll: async () => {
    const response = await api.get('/banks');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/banks', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/banks/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/banks/${id}`);
    return response.data;
  },
};

export const categoriesService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const operationsService = {
  getAll: async () => {
    const response = await api.get('/operations');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/operations/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post('/operations', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/operations/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/operations/${id}`);
    return response.data;
  },
};

export const reportsService = {
  getAll: async () => {
    const response = await api.get('/reports');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  generate: async (data: any) => {
    const response = await api.post('/reports', data);
    return response.data;
  },
};
