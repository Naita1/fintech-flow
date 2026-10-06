import { api } from './api';
import { toFrontTransaction, toApiTransaction } from './adapters/transactionAdapter';
import { getApiErrorMessage } from './utils/apiUtils';

const normalizeApiError = (error, fallbackMessage) => {
  const message = getApiErrorMessage(error, fallbackMessage);
  if (error instanceof Error) {
    error.message = message;
    return error;
  }
  return new Error(message);
};

export const transactionAPIService = {
  async getAll(filters = {}, signal) {
    try {
      const response = await api.get('/transactions', {
        params: filters,
        signal,
      });
      const responseData = response.data;
      const transactions = Array.isArray(responseData)
        ? responseData
        : Array.isArray(responseData?.data?.transactions)
          ? responseData.data.transactions
          : Array.isArray(responseData?.transactions)
            ? responseData.transactions
            : [];
      return transactions.map(toFrontTransaction).filter(Boolean);
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return [];
      }
      throw normalizeApiError(err, 'Falha ao buscar as movimentações.');
    }
  },

  async create(rawData) {
    try {
      const payload = toApiTransaction(rawData);
      const response = await api.post('/transactions', payload);
      const transaction =
        response.data?.data?.transaction ||
        response.data?.transaction ||
        response.data;
      return toFrontTransaction(transaction);
    } catch (err) {
      throw normalizeApiError(err, 'Falha ao adicionar a movimentação.');
    }
  },

  async update(id, rawData) {
    try {
      const payload = toApiTransaction(rawData);
      const response = await api.put(`/transactions/${id}`, payload);
      const transaction =
        response.data?.data?.transaction ||
        response.data?.transaction ||
        response.data;
      return toFrontTransaction(transaction);
    } catch (err) {
      throw normalizeApiError(err, 'Falha ao atualizar a movimentação.');
    }
  },

  async remove(id) {
    try {
      await api.delete(`/transactions/${id}`);
    } catch (err) {
      throw normalizeApiError(err, 'Falha ao excluir a movimentação.');
    }
  },
};