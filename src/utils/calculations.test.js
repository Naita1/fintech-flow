import { describe, expect, it } from "vitest";
import { categoriaDist, totals } from "./calculations";

describe("totals", () => {
  it("soma receitas e despesas e calcula o saldo positivo (lucro)", () => {
    const result = totals([
      { type: "income", amount: 2400 },
      { type: "income", amount: 600 },
      { type: "expense", amount: 1250 },
      { type: "expense", amount: 350 },
    ]);
    expect(result).toEqual({ entradas: 3000, saidas: 1600, saldo: 1400 });
  });

  it("calcula saldo negativo (prejuízo)", () => {
    expect(totals([
      { type: "income", amount: 75 },
      { type: "expense", amount: 125 },
    ])).toEqual({ entradas: 75, saidas: 125, saldo: -50 });
  });

  it("retorna totais zerados para listas vazias ou entradas inválidas", () => {
    const zeroTotals = { entradas: 0, saidas: 0, saldo: 0 };
    expect(totals([])).toEqual(zeroTotals);
    expect(totals()).toEqual(zeroTotals);
    expect(totals(null)).toEqual(zeroTotals);
  });

  it("mantém totais zerados quando os valores são zero", () => {
    expect(totals([
      { type: "income", amount: 0 },
      { type: "expense", amount: 0 },
    ])).toEqual({ entradas: 0, saidas: 0, saldo: 0 });
  });

  it("soma valores monetários sem erro de precisão de ponto flutuante", () => {
    expect(totals([
      { type: "income", amount: 0.1 },
      { type: "income", amount: 0.2 },
      { type: "expense", amount: 0.1 },
    ])).toEqual({ entradas: 0.3, saidas: 0.1, saldo: 0.2 });
  });

  it("ignora valores não numéricos e tipos de transação desconhecidos", () => {
    expect(totals([
      { type: "income", amount: "inválido" },
      { type: "transfer", amount: 100 },
    ])).toEqual({ entradas: 0, saidas: 0, saldo: 0 });
  });
});

describe("categoriaDist", () => {
  it("aglutina despesas da mesma categoria e usa 'Outros' como padrão", () => {
    expect(categoriaDist([
      { type: "expense", category: "Moradia", amount: 12.1 },
      { type: "expense", category: "Moradia", amount: 0.2 },
      { type: "expense", amount: 3 },
      { type: "income", category: "Moradia", amount: 50 },
    ])).toEqual([
      { categoria: "Moradia", valor: 12.3 },
      { categoria: "Outros", valor: 3 },
    ]);
  });

  it("retorna lista vazia quando não há despesas", () => {
    expect(categoriaDist([])).toEqual([]);
    expect(categoriaDist(null)).toEqual([]);
  });

  it("preserva zeros e acumula valores com precisão de centavos", () => {
    expect(categoriaDist([
      { type: "expense", category: "Lazer", amount: 0 },
      { type: "expense", category: "Alimentação", amount: 0.1 },
      { type: "expense", category: "Alimentação", amount: 0.2 },
    ])).toEqual([
      { categoria: "Lazer", valor: 0 },
      { categoria: "Alimentação", valor: 0.3 },
    ]);
  });
});
