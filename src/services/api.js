import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

if (!VITE_API_URL) {
  if (import.meta.env.PROD) {
    throw new Error('VITE_API_URL não está definida. A aplicação não pode se conectar à API.');
  } else {
    console.warn(
      "A variável de ambiente VITE_API_URL não está definida. Usando 'http://localhost:3000/api' como fallback. " +
        'Certifique-se de que este é o endereço correto da sua API.'
    );
  }
}

export const api = axios.create({
  baseURL: VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event('session-expired'));
    }
    return Promise.reject(error);
  }
);