import React from "react";

export default function SummaryCard({ label, value, icon: Icon, tone = "neutral" }) {
  const tones = {
    neutral: { bar: "bg-slate-300", icon: "text-slate-500 bg-slate-100" },
    entrada: { bar: "bg-emerald-500", icon: "text-emerald-600 bg-emerald-50" },
    saida: { bar: "bg-rose-500", icon: "text-rose-600 bg-rose-50" },
    lucro: { bar: "bg-emerald-500", icon: "text-emerald-600 bg-emerald-50" },
    prejuizo: { bar: "bg-rose-500", icon: "text-rose-600 bg-rose-50" },
    saldo: { bar: "bg-slate-800", icon: "text-slate-700 bg-slate-100" },
  };
  const t = tones[tone] || tones.neutral;

  return (
    <div
      className="
        group relative h-full min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm select-none
        transition-all duration-200 ease-out
        hover:border-slate-300 hover:shadow-md
        motion-safe:hover:-translate-y-0.5
        motion-reduce:transition-none
      "
    >
      <span className={`absolute left-0 top-0 h-full w-1 ${t.bar}`} />
      
      <div className="flex h-full items-start justify-between gap-2 p-3.5 pl-4 sm:p-4 sm:pl-5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
          </p>
          <p className="mt-1.5 truncate font-mono text-lg font-bold tabular-nums text-slate-800 sm:text-xl lg:text-2xl">
            {value}
          </p>
        </div>

        {Icon && (
          <div
            className={`
              shrink-0 rounded-lg p-2 transition-transform duration-200 ease-out
              motion-safe:group-hover:scale-110
              ${t.icon}
            `}
          >
            <Icon size={18} className="shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
}