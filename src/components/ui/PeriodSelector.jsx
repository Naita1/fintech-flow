import React from "react";

export default function PeriodSelector({ periods, selectedId, onChange }) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 pt-1 scrolling-touch snap-x">
      {periods.map((p) => {
        const isSelected = p.id === selectedId;
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            type="button"
            className={`
              min-h-11 shrink-0 snap-start rounded-xl border px-3.5 py-2 text-left select-none
              /* Performance, Microinterações e Acessibilidade */
              transition-all duration-150 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-800 focus-visible:ring-offset-2
              motion-safe:active:scale-[0.97]
              motion-reduce:transition-none
              ${
                isSelected
                  ? "border-slate-800 bg-slate-800 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }
            `}
          >
            <p className="text-xs font-semibold leading-tight">{p.label}</p>
            <p
              className={`mt-0.5 text-[11px] leading-tight ${
                isSelected ? "text-slate-300" : "text-slate-400"
              }`}
            >
              {p.periodo}
            </p>
          </button>
        );
      })}
    </div>
  );
}