import { api } from './api';
import { toFrontTransaction, toApiTransaction } from './adapters/transactionAdapter';

const getApiErrorMessage = (err, fallback) => {
  return err.response?.data?.error || err.response?.data?.message || err.message || fallback;
};

export const transactionAPIService = {
  async getAll(filters = {}, signal) {
    try {
      const response = await api.get('/transactions', {
        params: filters,
        signal,
      });
      const data = response.data;
      return Array.isArray(data) ? data.map(toFrontTransaction) : [];
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        console.log('Busca de transações abortada.');
        return [];
      }
      throw new Error(getApiErrorMessage(err, 'Falha ao buscar as movimentações.'));
    }
  },

  async create(rawData) {
    try {
      const payload = toApiTransaction(rawData);
      const response = await api.post('/transactions', payload);
      return toFrontTransaction(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Falha ao adicionar a movimentação.'));
    }
  },

  async update(id, rawData) {
    try {
      const payload = toApiTransaction(rawData);
      const response = await api.put(`/transactions/${id}`, payload);
      return toFrontTransaction(response.data);
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Falha ao atualizar a movimentação.'));
    }
  },

  async remove(id) {
    try {
      await api.delete(`/transactions/${id}`);
    } catch (err) {
      throw new Error(getApiErrorMessage(err, 'Falha ao excluir a movimentação.'));
    }
  },
};