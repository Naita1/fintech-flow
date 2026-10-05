import axios from 'axios';

const DEFAULT_API_URL = import.meta.env.PROD
  ? 'https://fintech-flow-api-prod.onrender.com'
  : 'http://localhost:3000';

const VITE_API_URL = import.meta.env.VITE_API_URL || DEFAULT_API_URL;
const API_BASE_URL = `${VITE_API_URL.replace(/\/+$/, '').replace(/\/api(?:\/v1)?$/, '')}/api`;

let memoryAccessToken = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const setAccessToken = (token) => {
  memoryAccessToken = token;
};

api.interceptors.request.use((config) => {
  if (memoryAccessToken) {
    config.headers.Authorization = `Bearer ${memoryAccessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post('/auth/refresh');
        const newAccessToken = data.accessToken;
        
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        return api(originalRequest);
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