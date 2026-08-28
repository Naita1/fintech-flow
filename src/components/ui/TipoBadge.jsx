import React from "react";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";

export default function TipoBadge({ tipo }) {
  const positivo = tipo === "entrada";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium 
        whitespace-nowrap select-none
        /* Performance e Microinterações GPU */
        transition-all duration-150 ease-out
        motion-safe:hover:scale-[1.03] motion-safe:active:scale-95
        motion-reduce:transition-none
        ${positivo ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}
      `}
    >
      {positivo ? (
        <ArrowUpCircle size={13} className="shrink-0" />
      ) : (
        <ArrowDownCircle size={13} className="shrink-0" />
      )}
      <span>{positivo ? "Entrada" : "Saída"}</span>
    </span>
  );
}