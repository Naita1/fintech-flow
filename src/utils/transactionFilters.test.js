import { describe, expect, it } from "vitest";
import { filterTransactions, normalizeDescription } from "./transactionFilters";

const transactions = [
  { id: 1, description: "  Café   da manhã ", category: "Alimentação", type: "expense" },
  { id: 2, description: "Salário mensal", category: "Renda", type: "income" },
  { id: 3, description: "Cafe no trabalho", category: "Alimentação", type: "expense" },
  { id: 4, description: "Reembolso almoço", category: "Alimentação", type: "income" },
];

describe("normalizeDescription", () => {
  it("ignora diferenças de caixa, acentos e espaços extras", () => {
    expect(normalizeDescription("  CAFE   da manhã ")).toBe("cafe da manha");
  });
});

describe("filterTransactions", () => {
  it("filtra descrição ignorando acentos, caixa e espaços extras", () => {
    expect(filterTransactions(transactions, { search: " cafe " }).map(({ id }) => id))
      .toEqual([1, 3]);
  });

  it("combina filtros de categoria e tipo", () => {
    expect(filterTransactions(transactions, {
      category: "Alimentação",
      type: "income",
    }).map(({ id }) => id)).toEqual([4]);
  });

  it("retorna uma lista vazia quando nada corresponde", () => {
    expect(filterTransactions(transactions, { search: "transporte" })).toEqual([]);
  });
});
