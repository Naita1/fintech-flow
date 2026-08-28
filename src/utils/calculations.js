export const totals = (transacoes) => {
  const entradas = transacoes.filter((t) => t.tipo === "entrada").reduce((s, t) => s + t.valor, 0);
  const saidas = transacoes.filter((t) => t.tipo === "saida").reduce((s, t) => s + t.valor, 0);
  return { entradas, saidas, saldo: entradas - saidas };
};

export const categoriaDist = (transacoes) => {
  const map = {};
  transacoes
    .filter((t) => t.tipo === "saida")
    .forEach((t) => {
      map[t.categoria] = (map[t.categoria] || 0) + t.valor;
    });
  return Object.entries(map).map(([categoria, valor]) => ({ categoria, valor }));
};