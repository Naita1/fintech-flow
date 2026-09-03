import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { useTransactions } from "../hooks/useTransactions";

import { groupTransactionsByPeriod } from "../utils/periods";

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


  const weeks = useMemo(
    () => (transactions ? groupTransactionsByPeriod(transactions, "semanal") : []),
    [transactions]
  );

  const quinzenas = useMemo(
    () => (transactions ? groupTransactionsByPeriod(transactions, "quinzenal") : []),
    [transactions]
  );

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