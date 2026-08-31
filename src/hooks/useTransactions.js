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

  const addTransaction = useCallback(async (arg1, arg2) => {
    setError(null);
    const rawData = arg2 ? arg2 : arg1;

    const payload = {
      description: rawData.descricao || rawData.description,
      amount: parseFloat(rawData.valor || rawData.amount),
      type: rawData.tipo || rawData.type || 'saida',
      category: rawData.categoria || rawData.category || 'Outros',
      frequency: rawData.frequencia || rawData.frequency || 'semanal',
      date: rawData.data || rawData.date || new Date().toISOString().split('T')[0],
      observation: rawData.observacao || rawData.observation || null,
    };

    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao adicionar a movimentação.');
      }

      await fetchTransactions();
    } catch (err) {
      setError(err.message);
      console.error('Erro ao adicionar transação:', err);
      throw err;
    }
  }, [fetchTransactions]);

  const deleteTransaction = useCallback(async (id) => {
    setError(null);
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao excluir a movimentação.');
      }

      setTransactions(prev => prev.filter(tx => tx.id !== id));
    } catch (err) {
      setError(err.message);
      console.error('Erro ao excluir transação:', err);
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
    addTransaction,
    deleteTransaction 
  };
}