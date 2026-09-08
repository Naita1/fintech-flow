const parseTx = (t) => {
  return {
    type: t.type || '',
    amount: t.amount || 0,
    category: t.category || 'Outros'
  };
};

export const totals = (transacoes = []) => {
  if (!Array.isArray(transacoes)) return { entradas: 0, saidas: 0, saldo: 0 };

  return transacoes.reduce(
    (acc, t) => {
      const { type, amount } = parseTx(t);

      if (type === 'income') {
        acc.entradas += amount;
      } else if (type === 'expense') {
        acc.saidas += amount;
      }

      acc.saldo = acc.entradas - acc.saidas;
      return acc;
    },
    { entradas: 0, saidas: 0, saldo: 0 }
  );
};

export const categoriaDist = (transacoes = []) => {
  if (!Array.isArray(transacoes)) return [];

  const map = {};

  transacoes.forEach((t) => {
    const { type, amount, category } = parseTx(t);

    if (type === 'expense') {
      map[category] = (map[category] || 0) + amount;
    }
  });

  return Object.entries(map).map(([categoria, valor]) => ({
    categoria,
    valor,
  }));
};