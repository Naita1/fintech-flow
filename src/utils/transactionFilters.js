export function normalizeDescription(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");
}

export function filterTransactions(transactions = [], filters = {}) {
  const normalizedSearch = normalizeDescription(filters.search);

  return transactions.filter((transaction) => {
    const matchesDescription = !normalizedSearch
      || normalizeDescription(transaction.description).includes(normalizedSearch);
    const matchesCategory = !filters.category
      || String(transaction.category || "").trim() === filters.category;
    const matchesType = !filters.type || transaction.type === filters.type;

    return matchesDescription && matchesCategory && matchesType;
  });
}
