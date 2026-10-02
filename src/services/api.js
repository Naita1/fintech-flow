import axios from 'axios';

const DEFAULT_API_URL = import.meta.env.PROD
  ? 'https://fintech-flow-api-prod.onrender.com/api/v1'
  : 'http://localhost:3000/api/v1';
const VITE_API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

if (!import.meta.env.VITE_API_URL && !import.meta.env.PROD) {
  const fallbackUrl = 'http://localhost:3000/api/v1';
  console.warn(
    `A variável de ambiente VITE_API_URL não está definida. Usando '${fallbackUrl}' como fallback. ` +
      'Certifique-se de que este é o endereço correto da sua API.'
  );
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

let accessToken = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const api = axios.create({
  baseURL: VITE_API_URL,
  withCredentials: true,
});

export const setAccessToken = (token) => {
  accessToken = token;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest.url !== '/auth/refresh' && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.accessToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
        processQueue(null, data.accessToken);
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setAccessToken(null);
        window.dispatchEvent(new Event('session-expired'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  const methodsToProtect = ['post', 'put', 'delete', 'patch'];
  if (methodsToProtect.includes(config.method.toLowerCase())) {
    const csrfToken = getCookie('csrf-token');
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
  }
  return config;
});