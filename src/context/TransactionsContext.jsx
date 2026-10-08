import { useMemo } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { groupTransactionsByWeekly, groupTransactionsByBiweekly } from "../utils/periods";
import { TransactionsContext } from "./TransactionsContextValue";


export function TransactionsProvider({ children }) {
  const {
    transactions = [],
    summary,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refetch,
  } = useTransactions();

  const { weeks, quinzenas } = useMemo(() => {
    const weeklyList = [];
    const biweeklyList = [];

    for (let i = 0; i < transactions.length; i += 1) {
      const tx = transactions[i];
      const freq = tx.frequency || tx.frequencia;
      if (freq === 'semanal' || freq === 'weekly') {
        weeklyList.push(tx);
      } else if (freq === 'quinzenal' || freq === 'biweekly') {
        biweeklyList.push(tx);
      }
    }

    return {
      weeks: groupTransactionsByWeekly(weeklyList),
      quinzenas: groupTransactionsByBiweekly(biweeklyList),
    };
  }, [transactions]);

  const value = useMemo(() => ({
    transactions,
    summary,
    weeks,
    quinzenas,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    refetch,
  }), [transactions, summary, weeks, quinzenas, loading, error, addTransaction, deleteTransaction, updateTransaction, refetch]);

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}