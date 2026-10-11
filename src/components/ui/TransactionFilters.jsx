import { useId } from "react";
import { Search, X } from "lucide-react";

export default function TransactionFilters({
  categories,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  type,
  onTypeChange,
  hasActiveFilters,
  onClearFilters,
}) {
  const id = useId();

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative w-full min-w-0 sm:flex-[2_1_14rem]">
        <label htmlFor={`${id}-search`} className="sr-only">Buscar por descrição</label>
        <Search
          size={17}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          id={`${id}-search`}
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por descrição"
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-[16px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 sm:text-sm"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Limpar busca"
            className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="w-full sm:min-w-0 sm:flex-1">
        <label htmlFor={`${id}-category`} className="sr-only">Filtrar por categoria</label>
        <select
          id={`${id}-category`}
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[16px] font-medium text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 sm:text-sm"
        >
          <option value="">Todas as categorias</option>
          {categories.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="w-full sm:min-w-0 sm:flex-1">
        <label htmlFor={`${id}-type`} className="sr-only">Filtrar por tipo de movimentação</label>
        <select
          id={`${id}-type`}
          value={type}
          onChange={(event) => onTypeChange(event.target.value)}
          className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-[16px] font-medium text-slate-700 outline-none transition-colors hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 sm:text-sm"
        >
          <option value="">Todas</option>
          <option value="income">Entradas/Receitas</option>
          <option value="expense">Saídas/Despesas</option>
        </select>
      </div>

      <div className="flex w-full items-center sm:w-auto sm:justify-end">
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="min-h-11 w-full whitespace-nowrap rounded-lg px-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 sm:w-auto"
          >
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );
}
