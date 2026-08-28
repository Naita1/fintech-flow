import { TrendingUp, TrendingDown } from "lucide-react";
import { fmtBRL } from "../../utils/format";

export default function ProfitLossIndicator({ saldo, size = "md" }) {
  const positivo = saldo >= 0;

  return (
    <div
      className={`
        group flex h-full min-w-0 items-center gap-3 rounded-xl border px-4 py-3 shadow-sm select-none
        transition-all duration-200 ease-out
        motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md
        motion-reduce:transition-none
        ${
          positivo
            ? "border-emerald-200/80 bg-emerald-50/70 hover:border-emerald-300 hover:bg-emerald-50"
            : "border-rose-200/80 bg-rose-50/70 hover:border-rose-300 hover:bg-rose-50"
        }
      `}
    >
      <div
        className={`
          flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-sm
          transition-transform duration-200 ease-out
          motion-safe:group-hover:scale-110
          ${positivo ? "bg-emerald-500" : "bg-rose-500"}
        `}
      >
        {positivo ? (
          <TrendingUp size={18} className="shrink-0 text-white" />
        ) : (
          <TrendingDown size={18} className="shrink-0 text-white" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={`truncate text-xs font-semibold uppercase tracking-wider ${
            positivo ? "text-emerald-800" : "text-rose-800"
          }`}
        >
          {positivo ? "Lucro no período" : "Prejuízo no período"}
        </p>
        <p
          className={`truncate font-mono font-bold tabular-nums ${
            size === "lg" ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
          } ${positivo ? "text-emerald-700" : "text-rose-700"}`}
        >
          {fmtBRL(Math.abs(saldo))}
        </p>
      </div>
    </div>
  );
}