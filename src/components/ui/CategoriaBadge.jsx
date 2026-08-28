import React from "react";
import { CATEGORIA_COR } from "../../constants/categories";

export default function CategoriaBadge({ categoria }) {
  const c = CATEGORIA_COR[categoria] || {
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium 
        whitespace-nowrap select-none
        ${c.bg} ${c.text}
        transition-all duration-150 ease-out
        motion-safe:hover:scale-[1.03] motion-safe:active:scale-95
        motion-reduce:transition-none
      `}
    >
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${c.dot}`} />
      {categoria}
    </span>
  );
}