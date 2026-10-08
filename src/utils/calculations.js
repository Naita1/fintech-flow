const toCents = (amount) => {
  const numericAmount = Number(amount);
  if (!Number.isFinite(numericAmount)) return 0;
  return Math.round((numericAmount + Math.sign(numericAmount) * Number.EPSILON) * 100);
};

export const totals = (transacoes = []) => {
  if (!Array.isArray(transacoes)) return { entradas: 0, saidas: 0, saldo: 0 };

  const { entradas, saidas } = transacoes.reduce(
    (acc, t) => {
      const type = t?.type;
      const amount = toCents(t?.amount ?? 0);

      if (type === 'income') {
        acc.entradas += amount;
      } else if (type === 'expense') {
        acc.saidas += amount;
      }
      return acc;
    },
    { entradas: 0, saidas: 0 }
  );

  return {
    entradas: entradas / 100,
    saidas: saidas / 100,
    saldo: (entradas - saidas) / 100,
  };
};

export const categoriaDist = (transacoes = []) => {
  if (!Array.isArray(transacoes)) return [];

  const distributionMap = transacoes.reduce((acc, t) => {
    const type = t?.type;
    const amount = toCents(t?.amount ?? 0);
    const category = t?.category || 'Outros';

    if (type === 'expense') {
      acc[category] = (acc[category] || 0) + amount;
    }
    return acc;
  }, {});

  return Object.entries(distributionMap).map(([categoria, valor]) => ({
    categoria,
    valor: valor / 100,
  }));
};