function parseDate(rawDate) {
  if (!rawDate) return null;
  if (rawDate instanceof Date) return isNaN(rawDate.getTime()) ? null : rawDate;

  const str = String(rawDate).trim();

  if (str.includes('-')) {
    const clean = str.split('T')[0];
    const parts = clean.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
  }

  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return new Date(year, month, day);
      }
    }
  }

  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function getStartOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.getFullYear(), d.getMonth(), diff);
}

function formatShortDate(date) {
  if (!date || isNaN(date.getTime())) return '--/--';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

/**
 * @param {Array} transactions 
 * @param {string} frequency 
 * @returns {Array} 
 */
export function groupTransactionsByPeriod(transactions, frequency) {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  const periods = {};

  transactions.forEach((transaction) => {
    const rawDate = transaction.date || transaction.data;
    const transactionDate = parseDate(rawDate);

    if (!transactionDate) return;

    const year = transactionDate.getFullYear();
    const month = transactionDate.getMonth();
    const dayOfMonth = transactionDate.getDate();

    let periodId = '';
    let periodLabel = '';
    let periodRange = '';

    if (frequency === 'semanal') {
      const startOfWeek = getStartOfWeek(transactionDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const firstDayOfYear = new Date(year, 0, 1);
      const pastDaysOfYear = (startOfWeek - firstDayOfYear) / 86400000;
      const weekNumber = Math.max(1, Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7));

      periodId = `${year}-W${String(weekNumber).padStart(2, '0')}`;
      periodLabel = `Semana ${weekNumber}`;
      periodRange = `${formatShortDate(startOfWeek)} - ${formatShortDate(endOfWeek)}`;
    } else if (frequency === 'quinzenal') {
      const monthStr = String(month + 1).padStart(2, '0');
      const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
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

export function groupTransactionsByWeek(transactions) {
  return groupTransactionsByPeriod(transactions, 'semanal');
}

export function groupTransactionsByBiweekly(transactions) {
  return groupTransactionsByPeriod(transactions, 'quinzenal');
}