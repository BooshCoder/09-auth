import axios from 'axios';
import { cookies } from 'next/headers';
import type { User } from '../../types/user';
import type { Note } from '../../types/note';
import type { LoginParams, RegisterParams } from './clientApi';

// Створюємо окремий axios для серверних запитів
const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL 
    ? process.env.NEXT_PUBLIC_API_URL + '/api'
    : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функції для серверних компонентів з використанням cookies() з next/headers
export const loginServer = async (credentials: LoginParams): Promise<User> => {
  const cookieStore = await cookies();
  const response = await serverApi.post('/auth/login', credentials, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const registerServer = async (credentials: RegisterParams): Promise<User> => {
  const cookieStore = await cookies();
  const response = await serverApi.post('/auth/register', credentials, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const getCurrentUserServer = async (): Promise<User> => {
  const cookieStore = await cookies();
  const response = await serverApi.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const getSessionServer = async (): Promise<{ success: boolean }> => {
  const cookieStore = await cookies();
  const response = await serverApi.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

// Функції для роботи з нотатками
export const fetchNotesServer = async (
  page: number = 1,
  perPage: number = 12,
  search: string = "",
  tag?: string
): Promise<{ notes: Note[]; totalPages: number }> => {
  const cookieStore = await cookies();
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  });
  if (search) params.append("search", search);
  if (tag && tag !== 'All') params.append("tag", tag);

  const response = await serverApi.get(`/notes?${params.toString()}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await serverApi.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const createNoteServer = async (note: { title: string; content: string; tag: string }): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await serverApi.post('/notes', note, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const deleteNoteServer = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await serverApi.delete(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};

export const updateNoteServer = async (id: string, note: { title?: string; content?: string; tag?: string }): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await serverApi.patch(`/notes/${id}`, note, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return response.data;
};
