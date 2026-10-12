import { describe, expect, it } from "vitest";
import { getBudgetProgress, monthlyExpensesByCategory } from "./budgets";

describe("getBudgetProgress", () => {
  it("classifica o consumo abaixo de 75% como abaixo do limite", () => {
    expect(getBudgetProgress(7_499, 10_000)).toEqual({
      percentage: 74.99,
      progress: 74.99,
      status: "under",
    });
  });

  it("classifica 75% e valores abaixo de 100% como atenção", () => {
    expect(getBudgetProgress(7_500, 10_000).status).toBe("attention");
    expect(getBudgetProgress(9_999, 10_000).status).toBe("attention");
  });

  it("classifica 100% ou mais como ultrapassado e limita a barra a 100%", () => {
    expect(getBudgetProgress(10_000, 10_000)).toEqual({
      percentage: 100,
      progress: 100,
      status: "exceeded",
    });
    expect(getBudgetProgress(12_500, 10_000)).toEqual({
      percentage: 125,
      progress: 100,
      status: "exceeded",
    });
  });

  it("trata teto e consumo zerados sem divisão por zero", () => {
    expect(getBudgetProgress(0, 0)).toEqual({
      percentage: 0,
      progress: 0,
      status: "under",
    });
    expect(getBudgetProgress(1, 0)).toEqual({
      percentage: 100,
      progress: 100,
      status: "exceeded",
    });
  });
});

describe("monthlyExpensesByCategory", () => {
  it("soma despesas apenas do mês informado usando centavos inteiros", () => {
    expect(monthlyExpensesByCategory([
      { type: "expense", category: "Alimentação", amount: 10.1, date: "2026-10-01" },
      { type: "expense", category: "Alimentação", amount: 0.2, date: "2026-10-31" },
      { type: "expense", category: "Moradia", amount: 50, date: "2026-09-30" },
      { type: "income", category: "Alimentação", amount: 100, date: "2026-10-15" },
    ], new Date(2026, 9, 12))).toEqual({ "Alimentação": 1_030 });
  });
});
