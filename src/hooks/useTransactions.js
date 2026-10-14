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
      if (signal?.aborted) return;
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
    const optimisticTransaction = {
      ...rawData,
      id: `optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      amount: Number(rawData.amount),
      frequency: rawData.frequency || 'monthly',
      observation: rawData.observation || '',
      isPending: true,
    };
    setTransactions((prev) => [optimisticTransaction, ...prev].sort(sortByDateDesc));

    try {
      const newTransaction = await transactionAPIService.create(rawData);
      setTransactions((prev) => prev
        .map((transaction) => transaction.id === optimisticTransaction.id
          ? newTransaction
          : transaction)
        .sort(sortByDateDesc));
      return newTransaction;
    } catch (err) {
      setTransactions((prev) => prev.filter(
        (transaction) => transaction.id !== optimisticTransaction.id
      ));
      setError(err.message);
      console.error('Falha ao adicionar transação:', err);
      throw err;
    }
  }, []);

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
    const deletedTransaction = transactions.find((transaction) => transaction.id === id);
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));

    try {
      await transactionAPIService.remove(id);
    } catch (err) {
      if (deletedTransaction) {
        setTransactions((prev) => [...prev, deletedTransaction].sort(sortByDateDesc));
      }
      setError(err.message);
      console.error('Falha ao excluir transação:', err);
      throw err;
    }
  }, [transactions]);

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