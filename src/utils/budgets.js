import { toCents } from "./calculations";
import { parseDate } from "./formatDate";

export const getBudgetProgress = (spentCents, limitCents) => {
  const spent = Number.isSafeInteger(spentCents) && spentCents >= 0 ? spentCents : 0;
  const limit = Number.isSafeInteger(limitCents) && limitCents >= 0 ? limitCents : 0;
  const percentage = limit === 0
    ? (spent > 0 ? 100 : 0)
    : (spent / limit) * 100;

  let status = "under";
  if (percentage >= 100) {
    status = "exceeded";
  } else if (percentage >= 75) {
    status = "attention";
  }

  return {
    percentage,
    progress: Math.min(percentage, 100),
    status,
  };
};

export const monthlyExpensesByCategory = (transactions = [], referenceDate = new Date()) => {
  if (!Array.isArray(transactions)) return {};

  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();

  return transactions.reduce((totals, transaction) => {
    if (transaction?.type !== "expense") return totals;

    const date = parseDate(transaction.date);
    if (!date || date.getUTCFullYear() !== year || date.getUTCMonth() !== month) {
      return totals;
    }

    const category = transaction.category || "Outros";
    totals[category] = (totals[category] || 0) + toCents(transaction.amount ?? 0);
    return totals;
  }, {});
};
