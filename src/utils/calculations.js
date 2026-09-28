export const totals = (transacoes = []) => {
  if (!Array.isArray(transacoes)) return { entradas: 0, saidas: 0, saldo: 0 };

  const { entradas, saidas } = transacoes.reduce(
    (acc, t) => {
      const type = t?.type;
      const amount = t?.amount || 0;

      if (type === 'income') {
        acc.entradas += amount;
      } else if (type === 'expense') {
        acc.saidas += amount;
      }
      return acc;
    },
    { entradas: 0, saidas: 0 }
  );

  return { entradas, saidas, saldo: entradas - saidas };
};

export const categoriaDist = (transacoes = []) => {
  if (!Array.isArray(transacoes)) return [];

  const distributionMap = transacoes.reduce((acc, t) => {
    const type = t?.type;
    const amount = t?.amount || 0;
    const category = t?.category || 'Outros';

    if (type === 'expense') {
      acc[category] = (acc[category] || 0) + amount;
    }
    return acc;
  }, {});

  return Object.entries(distributionMap).map(([categoria, valor]) => ({
    categoria,
    valor,
  }));
};