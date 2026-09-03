import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { useTransactions } from "../hooks/useTransactions";

import { groupTransactionsByWeekly, groupTransactionsByBiweekly } from "../utils/periods";

const TransactionsContext = createContext(null);

export function TransactionsProvider({ children }) {
  const { user } = useAuth();
  const {
    transactions, 
    loading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refetch,
  } = useTransactions(user?.id);

  const weeklyTransactions = useMemo(
    () => transactions?.filter(t => 
      (t.frequencia || t.frequency) === 'semanal' || 
      (t.frequencia || t.frequency) === 'weekly'
    ) || [],
    [transactions]
  );

  const biweeklyTransactions = useMemo(
    () => transactions?.filter(t => 
      (t.frequencia || t.frequency) === 'quinzenal' || 
      (t.frequencia || t.frequency) === 'biweekly'
    ) || [],
    [transactions]
  );

  const weeks = useMemo(() => groupTransactionsByWeekly(weeklyTransactions), [weeklyTransactions]);

  const quinzenas = useMemo(() => groupTransactionsByBiweekly(biweeklyTransactions), [biweeklyTransactions]);

  const value = {
    transactions, 
    weeks,
    quinzenas,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refetch,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export const useTransactionsContext = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined || context === null) {
    throw new Error(
      "useTransactionsContext deve ser usado dentro de um TransactionsProvider"
    );
  }
  return context;
};