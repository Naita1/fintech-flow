import { useState, useEffect, useCallback, useMemo } from 'react';
import { transactionAPIService } from '../services/transactionAPIService';
import { useAuth } from '../context/useAuth';

const sortByDateDesc = (a, b) => {
  const timeA = a?.date ? new Date(a.date).getTime() : 0;
  const timeB = b?.date ? new Date(b.date).getTime() : 0;
  return timeB - timeA;
};

export function useTransactions(filters = {}) {
  const { user, loading: authLoading } = useAuth();
  const isAuthenticated = !authLoading && Boolean(user);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filtersKey = JSON.stringify(filters);
  const stableFilters = useMemo(() => JSON.parse(filtersKey), [filtersKey]);

  const fetchTransactions = useCallback(async (signal) => {
    if (!isAuthenticated) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await transactionAPIService.getAll(stableFilters, signal);
      const safeTransactions = Array.isArray(data) ? data : [];
      setTransactions(safeTransactions.sort(sortByDateDesc));
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
      setError(err.message);
      console.error("Hook useTransactions falhou ao carregar dados:", err);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [stableFilters, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        return fetchTransactions(controller.signal);
      }
      return undefined;
    });

    return () => {
      controller.abort();
    };
  }, [fetchTransactions, isAuthenticated]);

  const addTransaction = useCallback(async (rawData) => {
    setError(null);
    try {
      const newTransaction = await transactionAPIService.create(rawData);
      setTransactions(prev => [newTransaction, ...prev].sort(sortByDateDesc));
      await fetchTransactions();
      return newTransaction;
    } catch (err) {
      setError(err.message);
      console.error('Falha ao adicionar transação:', err);
      throw err;
    }
  }, [fetchTransactions]);

  const updateTransaction = useCallback(async (transactionData) => {
    setError(null);
    const { id, ...rawData } = transactionData;
    try {
      const updatedTransaction = await transactionAPIService.update(id, rawData);
      setTransactions(prev =>
        prev
          .map(tx => (tx.id === id ? updatedTransaction : tx))
          .sort(sortByDateDesc)
      );
      return updatedTransaction;
    } catch (err) {
      setError(err.message);
      console.error('Falha ao atualizar transação:', err);
      throw err;
    }
  }, []);

  const deleteTransaction = useCallback(async (id) => {
    setError(null);
    try {
      await transactionAPIService.remove(id);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Falha ao excluir transação:', err);
      throw err;
    }
  }, []);

  const refetch = useCallback(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions: isAuthenticated ? transactions : [],
    loading: authLoading || (isAuthenticated && loading),
    error: isAuthenticated ? error : null,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch,
  };
}