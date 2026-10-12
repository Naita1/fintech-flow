import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

const getStorageKey = (userId) => `fintech-flow:budgets:${userId}`;

export function useBudgets() {
  const { user } = useAuth();
  const storageKey = user?.id ? getStorageKey(user.id) : null;
  const [stored, setStored] = useState({ key: null, budgets: {}, error: null });
  const isReady = Boolean(storageKey) && stored.key === storageKey && !stored.error;
  const error = !storageKey
    ? new Error("Não foi possível identificar o usuário para carregar os orçamentos.")
    : stored.key === storageKey
      ? stored.error
      : null;
  const budgets = isReady ? stored.budgets : {};

  useEffect(() => {
    if (!storageKey) return undefined;

    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      try {
        const savedBudgets = window.localStorage.getItem(storageKey);
        const parsedBudgets = savedBudgets ? JSON.parse(savedBudgets) : {};
        if (!parsedBudgets || typeof parsedBudgets !== "object" || Array.isArray(parsedBudgets)) {
          throw new Error("Os dados de orçamento salvos são inválidos.");
        }

        setStored({ key: storageKey, budgets: parsedBudgets, error: null });
      } catch (loadError) {
        console.error("Falha ao carregar os orçamentos:", loadError);
        setStored({
          key: storageKey,
          budgets: {},
          error: new Error("Não foi possível carregar os orçamentos deste usuário."),
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [storageKey]);

  const setBudget = useCallback((category, limitCents) => {
    if (!storageKey || stored.key !== storageKey) {
      throw new Error("Os orçamentos ainda não estão prontos para edição.");
    }
    if (!Number.isSafeInteger(limitCents) || limitCents <= 0) {
      throw new Error("O teto deve ser um valor positivo em centavos inteiros.");
    }

    const updatedBudgets = { ...stored.budgets, [category]: limitCents };
    window.localStorage.setItem(storageKey, JSON.stringify(updatedBudgets));
    setStored({ key: storageKey, budgets: updatedBudgets, error: null });
  }, [storageKey, stored]);

  const removeBudget = useCallback((category) => {
    if (!storageKey || stored.key !== storageKey) {
      throw new Error("Os orçamentos ainda não estão prontos para edição.");
    }

    const updatedBudgets = { ...stored.budgets };
    delete updatedBudgets[category];
    window.localStorage.setItem(storageKey, JSON.stringify(updatedBudgets));
    setStored({ key: storageKey, budgets: updatedBudgets, error: null });
  }, [storageKey, stored]);

  return { budgets, error, isReady, setBudget, removeBudget };
}
