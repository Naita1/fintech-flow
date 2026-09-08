const formatter = new Intl.NumberFormat("pt-BR", { 
  style: "currency", 
  currency: "BRL" 
});

export const fmtBRL = (v) =>
  formatter.format(Number(v) || 0);