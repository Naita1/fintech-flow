import { useState, useEffect, useCallback, useMemo } from 'react';
import { groupTransactionsByWeek, groupTransactionsByBiweekly } from '../utils/periods';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Falha ao buscar as movimentações da API.');
      }
      const data = await response.json();
      setTransactions(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (transactionData) => {
    setError(null);
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao adicionar a movimentação.');
      }

      const newTransaction = await response.json();
      setTransactions(prev => [newTransaction, ...prev]);
      
      return newTransaction;
    } catch (err) {
      setError(err.message);
      console.error(err);
      throw err;
    }
  }, []);

  const weeks = useMemo(() => groupTransactionsByWeek(transactions), [transactions]);
  const quinzenas = useMemo(() => groupTransactionsByBiweekly(transactions), [transactions]);

  return { 
    transactions, 
    weeks, 
    quinzenas, 
    loading, 
    error, 
    addTransaction 
  };
}