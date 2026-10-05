import { api, setAccessToken } from './api';
import { getApiErrorMessage } from './utils/apiUtils';

const normalizeUser = (data) => {
  if (!data) return null;
  return data.user !== undefined ? data.user : data;
};

let refreshPromise = null;

export const authService = {
  refreshAccessToken() {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const response = await api.post('/auth/refresh');
          const accessToken = response.data?.accessToken;
          if (!accessToken) {
            setAccessToken(null);
            throw new Error('A API não retornou um novo token de acesso.');
          }
          setAccessToken(accessToken);
          return true;
        } catch (error) {
          if ([401, 403].includes(error.response?.status)) {
            setAccessToken(null);
            return false;
          }
          if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
            throw error;
          }
          throw new Error(getApiErrorMessage(error, 'Falha ao renovar a sessão do usuário'));
        }
      })().finally(() => {
        refreshPromise = null;
      });
    }
    return refreshPromise;
  },

  async getCurrentUser(signal) {
    try {
      const response = await api.get('/auth/me', { signal });
      return normalizeUser(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        return null;
      }
      if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
        throw error;
      }
      throw new Error(getApiErrorMessage(error, 'Falha ao recuperar sessão do usuário'));
    }
  },

  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
      }
      return normalizeUser(response.data);
    } catch (error) {
      throw new Error(getApiErrorMessage(error, 'E-mail ou senha inválidos'));
    }
  },

  async logout() {
    setAccessToken(null); 
    try {
      await api.post('/auth/logout');
    } catch (error) {
      if (error.response?.status === 401) {
        return;
      }
      console.error("Falha na chamada de logout da API:", error);
      throw new Error(getApiErrorMessage(error, 'Falha ao encerrar sessão no servidor'));
    }
  },
};