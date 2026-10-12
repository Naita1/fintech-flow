import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { CATEGORIAS } from "../../constants/categories";
import { toCents } from "../../utils/calculations";
import { getBudgetProgress } from "../../utils/budgets";
import { fmtBRL } from "../../utils/format";

const EXPENSE_CATEGORIES = CATEGORIAS.filter(
  ({ value }) => value !== "Salário" && value !== "Vendas"
);

const STATUS_STYLES = {
  under: {
    bar: "bg-emerald-500",
    text: "text-emerald-700",
    label: "Dentro do orçamento",
  },
  attention: {
    bar: "bg-amber-400",
    text: "text-amber-700",
    label: "Atenção ao limite",
  },
  exceeded: {
    bar: "bg-rose-500",
    text: "text-rose-700",
    label: "Teto ultrapassado",
  },
};

function BudgetForm({ budgets, isReady, onSave, onRemove, onClose }) {
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]?.value || "");
  const [amount, setAmount] = useState(() => {
    const initialLimit = budgets[EXPENSE_CATEGORIES[0]?.value];
    return initialLimit ? (initialLimit / 100).toFixed(2) : "";
  });
  const [formError, setFormError] = useState("");

  const selectCategory = (event) => {
    const nextCategory = event.target.value;
    setCategory(nextCategory);
    setAmount(budgets[nextCategory] ? (budgets[nextCategory] / 100).toFixed(2) : "");
    setFormError("");
  };

  const handleSave = (event) => {
    event.preventDefault();
    const numericAmount = Number(amount);
    const limitCents = toCents(numericAmount);

    if (!Number.isFinite(numericAmount) || !Number.isSafeInteger(limitCents) || limitCents <= 0) {
      setFormError("Informe um teto maior que R$ 0,00.");
      return;
    }

    try {
      onSave(category, limitCents);
      onClose();
    } catch (saveError) {
      setFormError(saveError.message || "Não foi possível salvar o teto.");
    }
  };

  const handleRemove = () => {
    try {
      onRemove(category);
      setAmount("");
      setFormError("");
    } catch (removeError) {
      setFormError(removeError.message || "Não foi possível remover o teto.");
    }
  };

  const hasBudget = Boolean(budgets[category]);

  return (
    <form onSubmit={handleSave} className="mt-4 space-y-4">
      <div>
        <label htmlFor="budget-category" className="mb-1 block text-sm font-medium text-slate-700">
          Categoria de despesa
        </label>
        <select
          id="budget-category"
          value={category}
          onChange={selectCategory}
          disabled={!isReady}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100"
        >
          {EXPENSE_CATEGORIES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="budget-amount" className="mb-1 block text-sm font-medium text-slate-700">
          Teto mensal (R$)
        </label>
        <input
          id="budget-amount"
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          placeholder="Ex.: 500,00"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          disabled={!isReady}
          className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-base text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100"
          required
        />
      </div>
      {formError && <p role="alert" className="text-sm text-rose-700">{formError}</p>}
      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:justify-between">
        {hasBudget ? (
          <button
            type="button"
            onClick={handleRemove}
            disabled={!isReady}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
          >
            <Trash2 size={16} aria-hidden="true" />
            Remover teto
          </button>
        ) : <span />}
        <div className="flex gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50 sm:flex-none"
          >
            Fechar
          </button>
          <button
            type="submit"
            disabled={!isReady}
            className="min-h-11 flex-1 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:flex-none"
          >
            Salvar teto
          </button>
        </div>
      </div>
    </form>
  );
}

export default function BudgetCard({
  budgets,
  spendingByCategory,
  error,
  isReady,
  onSave,
  onRemove,
  monthLabel,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const configuredBudgets = Object.entries(budgets)
    .filter(([category, limit]) => (
      EXPENSE_CATEGORIES.some((item) => item.value === category)
      && Number.isSafeInteger(limit)
      && limit > 0
    ));

  return (
    <section className="w-full min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 border-b border-dashed border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">Orçamento &amp; Teto de Gastos</h2>
          <p className="mt-0.5 text-xs text-slate-400">Consumo por categoria em {monthLabel}</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          disabled={!isReady}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
        >
          {configuredBudgets.length ? (
            <><Pencil size={16} aria-hidden="true" /> Gerenciar tetos</>
          ) : (
            <><Plus size={16} aria-hidden="true" /> Definir orçamento</>
          )}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error.message}
        </p>
      )}

      {!error && !isReady && (
        <p role="status" className="py-8 text-center text-sm text-slate-500">
          Carregando seus orçamentos...
        </p>
      )}

      {!error && isReady && configuredBudgets.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-slate-700">Nenhum teto configurado ainda.</p>
          <p className="mt-1 text-sm text-slate-500">
            Defina seu primeiro orçamento e acompanhe seus gastos por categoria.
          </p>
        </div>
      )}

      {!error && configuredBudgets.length > 0 && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {configuredBudgets.map(([category, limitCents]) => {
            const spentCents = spendingByCategory[category] || 0;
            const { percentage, progress, status } = getBudgetProgress(spentCents, limitCents);
            const style = STATUS_STYLES[status];
            const percentageLabel = percentage.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

            return (
              <article key={category} className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="truncate text-sm font-semibold text-slate-800">{category}</h3>
                  <span className={`shrink-0 text-xs font-semibold ${style.text}`}>
                    {percentageLabel}% · {style.label}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-semibold text-slate-800">{fmtBRL(spentCents / 100)}</span>
                  {" de "}
                  {fmtBRL(limitCents / 100)}
                </p>
                <div
                  className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200"
                  role="progressbar"
                  aria-label={`Consumo do orçamento de ${category}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  aria-valuetext={`${percentageLabel}% consumido`}
                >
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ${style.bar}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-3 sm:items-center sm:p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 translate-y-2 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-2 sm:scale-95"
              >
                <Dialog.Panel className="w-full max-w-md rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-xl sm:p-6">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-slate-800">
                    Configurar orçamento mensal
                  </Dialog.Title>
                  <p className="mt-1 text-sm text-slate-500">
                    Escolha uma categoria para definir, editar ou remover seu teto.
                  </p>
                  <BudgetForm
                    budgets={budgets}
                    isReady={isReady}
                    onSave={onSave}
                    onRemove={onRemove}
                    onClose={() => setIsOpen(false)}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </section>
  );
}
