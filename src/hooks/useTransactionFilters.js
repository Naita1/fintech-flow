import { useMemo, useState } from "react";
import { filterTransactions, normalizeDescription } from "../utils/transactionFilters";

export function useTransactionFilters(transactions = []) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  const categories = useMemo(() => (
    [...new Set(transactions
      .map((transaction) => String(transaction.category || "").trim())
      .filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "pt-BR"))
  ), [transactions]);

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, { search, category, type }),
    [transactions, search, category, type]
  );

  const hasActiveFilters = Boolean(
    normalizeDescription(search) || category || type
  );

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setType("");
  };

  return {
    filteredTransactions,
    categories,
    search,
    setSearch,
    category,
    setCategory,
    type,
    setType,
    hasActiveFilters,
    clearFilters,
  };
}
