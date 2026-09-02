const parseTx = (t) => {
  const type = String(t.tipo || t.type || '').toLowerCase().trim();
  const rawAmount = t.valor ?? t.amount ?? 0;
  const amount = typeof rawAmount === 'number' ? rawAmount : parseFloat(rawAmount) || 0;
  const category = t.categoria || t.category || 'Outros';

  return { type, amount, category };
};

export const totals = (transacoes = []) => {
  if (!Array.isArray(transacoes)) return { entradas: 0, saidas: 0, saldo: 0 };

  return transacoes.reduce(
    (acc, t) => {
      const { type, amount } = parseTx(t);

      if (type === 'entrada' || type === 'income') {
        acc.entradas += amount;
      } else if (type === 'saida' || type === 'expense') {
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

    if (type === 'saida' || type === 'expense') {
      map[category] = (map[category] || 0) + amount;
    }
  });

  return Object.entries(map).map(([categoria, valor]) => ({
    categoria,
    valor,
  }));
};