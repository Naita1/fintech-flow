import axios from 'axios';

const DEFAULT_API_URL = import.meta.env.PROD
  ? 'https://fintech-flow-api-prod.onrender.com/api'
  : 'http://localhost:3000/api';
const VITE_API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

if (!import.meta.env.VITE_API_URL && !import.meta.env.PROD) {
  console.warn(
    "A variável de ambiente VITE_API_URL não está definida. Usando 'http://localhost:3000/api' como fallback. " +
      'Certifique-se de que este é o endereço correto da sua API.'
  );
}

export const api = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestPath = error.config?.url || '';
    const isAuthRequest = /\/auth\/(login|me|logout)(?:[/?#]|$)/.test(requestPath);

    if (error.response?.status === 401 && !isAuthRequest) {
      window.dispatchEvent(new Event('session-expired'));
    }
    return Promise.reject(error);
  }
);