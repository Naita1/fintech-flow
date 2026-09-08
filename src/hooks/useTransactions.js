import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { toFrontTransaction, toApiTransaction } from '../services/adapters/transactionAdapter';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/transactions');
      const data = response.data;
      const normalized = Array.isArray(data) ? data.map(toFrontTransaction) : [];
      
      setTransactions(normalized.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Falha ao buscar as movimentações.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (rawData) => {
    setError(null);
    const payload = toApiTransaction(rawData);

    try {
      const response = await api.post('/transactions', payload);
      const normalizedNew = toFrontTransaction(response.data);

      setTransactions(prev => [normalizedNew, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
      return normalizedNew;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Falha ao adicionar a movimentação.';
      setError(errorMessage);
      console.error('Erro ao adicionar transação:', err);
      throw err;
    }
  }, []);

  const updateTransaction = useCallback(async (transactionData) => {
    setError(null);
    const { id, ...rawData } = transactionData;
    const payload = toApiTransaction(rawData);

    try {
      const response = await api.put(`/transactions/${id}`, payload);
      const normalizedUpdated = toFrontTransaction(response.data);

      setTransactions(prev =>
        prev
          .map(tx => (tx.id === id ? normalizedUpdated : tx))
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      );
      return normalizedUpdated;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao atualizar transação:', err);
      throw err;
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    setError(null);
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Falha ao excluir a movimentação.';
      setError(errorMessage);
      console.error('Erro ao excluir transação:', err);
      throw err;
    }
  }, []);

  return { 
    transactions, 
    loading, 
    error, 
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
}