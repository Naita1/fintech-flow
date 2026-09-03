import { useState, useEffect, useCallback, useMemo } from 'react';
import { groupTransactionsByPeriod } from '../utils/periods';

const API_URL = import.meta.env.VITE_API_URL || '';

const normalizeTransaction = (apiTx) => {
  if (!apiTx) return null;
  return {
    ...apiTx,
    id: apiTx.id,
    descricao: apiTx.description || apiTx.descricao || '',
    description: apiTx.description || apiTx.descricao || '',
    valor: parseFloat(apiTx.amount ?? apiTx.valor ?? 0),
    amount: parseFloat(apiTx.amount ?? apiTx.valor ?? 0),
    tipo: apiTx.type || apiTx.tipo || 'saida',
    type: apiTx.type || apiTx.tipo || 'saida',
    categoria: apiTx.category || apiTx.categoria || 'Outros',
    category: apiTx.category || apiTx.categoria || 'Outros',
    frequencia: apiTx.frequency || apiTx.frequencia || 'semanal',
    frequency: apiTx.frequency || apiTx.frequencia || 'semanal',
    data: apiTx.date || apiTx.data || '',
    date: apiTx.date || apiTx.data || '',
    observacao: apiTx.observation || apiTx.observacao || '',
    observation: apiTx.observation || apiTx.observacao || ''
  };
};

const toApiPayload = (domainData) => ({
  description: domainData.descricao || domainData.description,
  amount: parseFloat(domainData.valor || domainData.amount),
  type: domainData.tipo || domainData.type || 'saida',
  category: domainData.categoria || domainData.category || 'Outros',
  frequency: domainData.frequencia || domainData.frequency || 'semanal',
  date: domainData.data || domainData.date || new Date().toISOString().split('T')[0],
  observation: domainData.observacao || domainData.observation || null,
});

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/transactions`, {
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Sessão expirada ou não autorizada.');
        }
        throw new Error('Falha ao buscar as movimentações da API.');
      }

      const data = await response.json();
      const normalized = Array.isArray(data) ? data.map(normalizeTransaction) : [];
      
      setTransactions(normalized.sort((a, b) => new Date(b.date) - new Date(a.date)));
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

  const addTransaction = useCallback(async (rawData) => {
    setError(null);
    const payload = toApiPayload(rawData);

    try {
      const response = await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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

  const updateTransaction = useCallback(async (transactionData) => {
    setError(null);
    const { id, ...rawData } = transactionData;
    const payload = toApiPayload(rawData);

    try {
      const response = await fetch(`${API_URL}/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
  }, [fetchTransactions]);

  const deleteTransaction = useCallback(async (id) => {
    setError(null);
    try {
      const response = await fetch(`${API_URL}/api/transactions/${id}`, {
        method: 'DELETE',
        credentials: 'include'
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

  const weeks = useMemo(() => groupTransactionsByPeriod(transactions, 'semanal'), [transactions]);
  const quinzenas = useMemo(() => groupTransactionsByPeriod(transactions, 'quinzenal'), [transactions]);

  return { 
    transactions, 
    weeks, 
    quinzenas, 
    loading, 
    error, 
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions
  };
}