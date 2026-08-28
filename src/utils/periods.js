const getWeekOfMonth = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  return Math.ceil((date.getDate() + firstDay) / 7);
};

export const groupTransactionsByWeek = (transactions) => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const weeks = [
    { label: 'Semana 1', transacoes: [] },
    { label: 'Semana 2', transacoes: [] },
    { label: 'Semana 3', transacoes: [] },
    { label: 'Semana 4', transacoes: [] },
    { label: 'Semana 5', transacoes: [] },
  ].filter((_, i) => new Date(currentYear, currentMonth, i * 7 + 1).getMonth() === currentMonth);

  transactions.forEach(tx => {
    const txDate = new Date(tx.date);
    if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
      const weekNum = getWeekOfMonth(txDate);
      if (weeks[weekNum - 1]) {
        weeks[weekNum - 1].transacoes.push(tx);
      }
    }
  });

  return weeks;
};

export const groupTransactionsByBiweekly = (transactions) => {
  const quinzenas = [
    { label: '1ª Quinzena', transacoes: [] },
    { label: '2ª Quinzena', transacoes: [] },
  ];

  transactions.forEach(tx => {
    const txDate = new Date(tx.date);
    txDate.getDate() <= 15 ? quinzenas[0].transacoes.push(tx) : quinzenas[1].transacoes.push(tx);
  });

  return quinzenas;
};