import React from "react";
import { Menu } from "lucide-react";

export default function Header({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 py-3.5 backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="
            inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 md:hidden select-none
            /* Performance & Microinterações */
            transition-all duration-150 ease-out
            hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-800
            motion-safe:active:scale-95
            motion-reduce:transition-none
          "
          aria-label="Abrir menu de navegação"
        >
          <Menu size={20} className="shrink-0" />
        </button>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold text-slate-800 sm:text-lg">
            {title}
          </h1>
        </div>
      </div>
    </header>
  );
}