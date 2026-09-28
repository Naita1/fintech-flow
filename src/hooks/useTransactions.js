import { useState, useEffect, useCallback } from 'react';
import { transactionAPIService } from '../services/transactionAPIService';

const sortByDateDesc = (a, b) => {
  const timeA = a?.date ? new Date(a.date).getTime() : 0;
  const timeB = b?.date ? new Date(b.date).getTime() : 0;
  return timeB - timeA;
};

export function useTransactions(filters = {}) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filtersKey = JSON.stringify(filters);

  const loadTransactions = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTransactions = await transactionAPIService.getAll(filters, signal);
      setTransactions(fetchedTransactions.sort(sortByDateDesc));
    } catch (err) {
      if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') return;
      setError(err.message);
      console.error("Hook useTransactions falhou ao carregar dados:", err);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, [filtersKey]);

  useEffect(() => {
    const controller = new AbortController();
    loadTransactions(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadTransactions]);

  const addTransaction = useCallback(async (rawData) => {
    setError(null);
    try {
      const newTransaction = await transactionAPIService.create(rawData);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
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
    const controller = new AbortController();
    loadTransactions(controller.signal);
  }, [loadTransactions]);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch,
  };
}