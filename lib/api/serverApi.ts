import axios from 'axios';
import type { User, LoginParams, RegisterParams } from './clientApi';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

// Серверна версія API з підтримкою cookies
export const serverApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функції для серверних компонентів
export const loginServer = async (credentials: LoginParams, cookies: string): Promise<User> => {
  const response = await serverApi.post('/auth/login', credentials, {
    headers: {
      Cookie: cookies,
    },
  });
  return response.data;
};

export const registerServer = async (credentials: RegisterParams, cookies: string): Promise<User> => {
  const response = await serverApi.post('/auth/register', credentials, {
    headers: {
      Cookie: cookies,
    },
  });
  return response.data;
};

export const getCurrentUserServer = async (cookies: string): Promise<User> => {
  const response = await serverApi.get('/users/me', {
    headers: {
      Cookie: cookies,
    },
  });
  return response.data;
};

export const getSessionServer = async (cookies: string): Promise<{ success: boolean }> => {
  const response = await serverApi.get('/auth/session', {
    headers: {
      Cookie: cookies,
    },
  });
  return response.data;
};

export default serverApi;
