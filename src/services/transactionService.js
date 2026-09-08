import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/transactionService';

export function useTransactions(filters = {}) {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterKey = JSON.stringify(filters);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, sum] = await Promise.all([
        transactionService.getTransactions(filters),
        transactionService.getSummary(filters),
      ]);
      setTransactions(list);
      setSummary(sum);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erro ao carregar movimentações.');
    } finally {
      setLoading(false);
    }
  }, [filterKey]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (data) => {
    setError(null);
    try {
      const created = await transactionService.createTransaction(data);
      setTransactions(prev => [created, ...prev]);
      return created;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erro ao criar transação.');
      throw err;
    }
  }, []);

  const updateTransaction = useCallback(async (data) => {
    setError(null);
    try {
      const updated = await transactionService.updateTransaction(data.id, data);
      setTransactions(prev => prev.map(tx => (tx.id === data.id ? updated : tx)));
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erro ao atualizar transação.');
      throw err;
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    setError(null);
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erro ao excluir transação.');
      throw err;
    }
  }, []);

  return {
    transactions,
    summary,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
  };
}