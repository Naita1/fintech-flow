import { parseDate } from "./formatDate";

function getStartOfWeek(date) {
  const d = new Date(date.getTime());
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day;
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), diff));
}

function formatShortDate(date) {
  if (!date || isNaN(date.getTime())) return "--/--";
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}`;
}

export function groupTransactionsByPeriod(transactions, frequency) {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  const periods = {};

  transactions.forEach((transaction) => {
    const rawDate = transaction.date;
    const transactionDate = parseDate(rawDate);

    if (!transactionDate) return;

    const year = transactionDate.getUTCFullYear();
    const month = transactionDate.getUTCMonth();
    const dayOfMonth = transactionDate.getUTCDate();

    let periodId = '';
    let periodLabel = '';
    let periodRange = '';

    if (frequency === 'semanal') {
      const startOfWeek = getStartOfWeek(transactionDate);
      const endOfWeek = new Date(startOfWeek.getTime());
      endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);

      const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
      const pastDaysOfYear = (startOfWeek - firstDayOfYear) / 86400000;
      const weekNumber = Math.max(1, Math.ceil((pastDaysOfYear + firstDayOfYear.getUTCDay() + 1) / 7));

      periodId = `${year}-W${String(weekNumber).padStart(2, '0')}`;
      periodLabel = `Semana ${weekNumber}`;
      periodRange = `${formatShortDate(startOfWeek)} - ${formatShortDate(endOfWeek)}`;
    } else if (frequency === 'quinzenal') {
      const monthStr = String(month + 1).padStart(2, '0');
      const lastDayOfMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
      if (dayOfMonth <= 15) {
        periodId = `${year}-${monthStr}-Q1`;
        periodLabel = `1ª Quinzena`;
        periodRange = `01/${monthStr} - 15/${monthStr}`;
      } else {
        periodId = `${year}-${monthStr}-Q2`;
        periodLabel = `2ª Quinzena`;
        periodRange = `16/${monthStr} - ${lastDayOfMonth}/${monthStr}`;
      }
    }

    if (!periodId) return;

    if (!periods[periodId]) {
      periods[periodId] = {
        id: periodId,
        label: periodLabel,
        periodo: periodRange,
        transacoes: [],
      };
    }
    periods[periodId].transacoes.push(transaction);
  });

  return Object.values(periods).sort((a, b) => b.id.localeCompare(a.id));
}

export function groupTransactionsByWeekly(transactions) {
  return groupTransactionsByPeriod(transactions, 'semanal');
}

export function groupTransactionsByBiweekly(transactions) {
  return groupTransactionsByPeriod(transactions, 'quinzenal');
}