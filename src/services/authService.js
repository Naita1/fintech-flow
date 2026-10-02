import { api, setAccessToken } from './api';
import { getApiErrorMessage } from './utils/apiUtils';

const normalizeUser = (data) => {
  if (!data) return null;
  return data.user !== undefined ? data.user : data;
};

export const authService = {
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
    setAccessToken(null); // Limpa o token localmente de imediato
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