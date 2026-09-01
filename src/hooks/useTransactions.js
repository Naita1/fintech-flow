import { useState, useEffect, useCallback, useMemo } from 'react';
import { groupTransactionsByWeek, groupTransactionsByBiweekly } from '../utils/periods';

const API_URL = import.meta.env.VITE_API_URL || '';

export function useTransactions(frequency) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const url = new URL(`${API_URL}/api/transactions`);
      if (frequency) {
        url.searchParams.append('frequency', frequency);
      }

      const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
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
  }, [frequency]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = useCallback(async (rawData) => {
    setError(null);

    const payload = {
      description: rawData.descricao || rawData.description,
      amount: parseFloat(rawData.valor || rawData.amount),
      type: rawData.tipo || rawData.type || 'saida',
      category: rawData.categoria || rawData.category || 'Outros',
      frequency: frequency, 
      date: rawData.data || rawData.date || new Date().toISOString().split('T')[0],
      observation: rawData.observacao || rawData.observation || null,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado.');

      const response = await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
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
  }, [fetchTransactions, frequency]);

  const updateTransaction = useCallback(async (id, rawData) => {
    setError(null);
    
    const payload = {
      description: rawData.descricao || rawData.description,
      amount: parseFloat(rawData.valor || rawData.amount),
      type: rawData.tipo || rawData.type,
      category: rawData.categoria || rawData.category,
      frequency: rawData.frequencia || rawData.frequency || frequency,
      date: rawData.data || rawData.date,
      observation: rawData.observacao || rawData.observation || null,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado.');

      const response = await fetch(`${API_URL}/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao atualizar a movimentação.');
      }

      await fetchTransactions();
    } catch (err) {
      setError(err.message);
      console.error('Erro ao atualizar transação:', err);
      throw err;
    }
  }, [fetchTransactions, frequency]);

  const deleteTransaction = useCallback(async (id) => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado.');

      const response = await fetch(`${API_URL}/api/transactions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
    updateTransaction,
    deleteTransaction 
  };
}