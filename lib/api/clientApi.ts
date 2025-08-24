export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  name?: string;
}

export const login = async (credentials: LoginParams): Promise<User> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
};

export const register = async (credentials: RegisterParams): Promise<User> => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Registration failed');
  }

  return response.json();
};

export const logout = async (): Promise<void> => {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Logout failed');
  }
};

export const getSession = async (): Promise<{ success: boolean }> => {
  const response = await fetch('/api/auth/session');

  if (!response.ok) {
    throw new Error('Session check failed');
  }

  return response.json();
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await fetch('/api/users/me');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get user data');
  }

  return response.json();
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await fetch(`/api/notes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete note');
  }

  return response.json();
};

export const fetchNotes = async (
  page: number = 1,
  perPage: number = 12,
  search: string = "",
  tag?: string
): Promise<FetchNotesResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    perPage: String(perPage),
  });
  if (search) params.append("search", search);
  if (tag && tag !== 'All') params.append("tag", tag);

  const response = await fetch(`/api/notes?${params.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch notes');
  }

  return response.json();
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  console.log('Fetching note by ID:', id);
  const response = await fetch(`/api/notes/${id}`);

  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);

  if (!response.ok) {
    const error = await response.json();
    console.error('Error fetching note:', error);
    throw new Error(error.error || 'Failed to fetch note');
  }

  const data = await response.json();
  console.log('Note data received:', data);
  return data;
};

export const createNote = async (note: { title: string; content: string; tag: string }): Promise<Note> => {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create note');
  }

  return response.json();
};
