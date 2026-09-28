const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

const normalizeUser = (data) => {
  if (!data) return null;
  return data.user !== undefined ? data.user : data;
};

const handleApiResponse = async (response, defaultErrorMessage) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const validationMessage = errorData.errors?.[0]?.message;
    const errorMessage =
      validationMessage ||
      errorData.message ||
      errorData.error ||
      defaultErrorMessage ||
      `Erro na requisição (${response.status})`;

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const authService = {
  async getCurrentUser(signal) {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      signal,
    });

    if (response.status === 401) {
      return null;
    }

    const data = await handleApiResponse(response, 'Falha ao recuperar sessão do usuário');
    return normalizeUser(data);
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    const data = await handleApiResponse(response, 'Falha ao autenticar usuário');
    return normalizeUser(data);
  },

  async logout() {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    await handleApiResponse(response, 'Falha ao encerrar sessão');
  },
};