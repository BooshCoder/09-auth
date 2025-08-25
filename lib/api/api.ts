import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

// Створюємо один спільний екземпляр axios з налаштуванням
export const api = axios.create({
  baseURL,
  withCredentials: true, // Підтримка cookies для авторизації
  headers: {
    'Content-Type': 'application/json',
  },
});

// Інтерцептор для обробки помилок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default api;
