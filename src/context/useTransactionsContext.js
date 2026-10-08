import { useContext } from "react";
import { TransactionsContext } from "./TransactionsContextValue";

export const useTransactionsContext = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactionsContext deve ser utilizado dentro de um TransactionsProvider");
  }
  return context;
};
