import { LayoutDashboard, CalendarDays, CalendarRange, FileText, Wallet, X } from "lucide-react";
import { NavLink } from "react-router-dom";

export const NAV_ITEMS = [
  { id: "dashboard", path: "/", label: "Dashboard", icon: LayoutDashboard },
  { id: "semanal", path: "/semanal", label: "Financeiro Semanal", icon: CalendarDays },
  { id: "quinzenal", path: "/quinzenal", label: "Financeiro Quinzenal", icon: CalendarRange },
  { id: "relatorio", path: "/relatorio", label: "Relatório", icon: FileText },
];

function NavList({ onItemClick }) {
  return (
    <nav className="space-y-1.5" aria-label="Navegação principal">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.id}
            to={item.path}
            onClick={onItemClick}
            className={({ isActive }) => `group relative flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold select-none
              transition-all duration-150 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
              motion-safe:active:scale-[0.98] motion-reduce:transition-none ${
              isActive
                ? "bg-emerald-500/10 text-emerald-400 shadow-sm"
                : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 motion-safe:hover:translate-x-0.5"
            }`
          }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`h-5 w-1 rounded-full transition-all duration-200 ease-out ${
                    isActive ? "bg-emerald-400 opacity-100 scale-y-100" : "bg-transparent opacity-0 scale-y-50"
                  }`}
                />
                <Icon size={18} className={`shrink-0 transition-transform duration-200 ease-out ${isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-slate-200"}`} />
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-800/80 bg-slate-900 px-4 py-6 md:flex select-none">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
          <Wallet size={20} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">Controle Financeiro</p>
          <p className="truncate text-xs text-slate-400">Painel da empresa</p>
        </div>
      </div>

      <NavList />
    </aside>
  );
}

export function MobileDrawer({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden">
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-200 motion-reduce:animate-none"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative flex h-full w-72 max-w-[80vw] flex-col border-r border-slate-800 bg-slate-900 px-4 py-6 shadow-2xl select-none motion-safe:animate-in motion-safe:slide-in-from-left motion-safe:duration-250 motion-safe:ease-out motion-reduce:animate-none">
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
              <Wallet size={20} className="text-white" />
            </div>
            <p className="truncate text-sm font-bold text-white">Controle Financeiro</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white
              transition-all duration-150 ease-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500
              motion-safe:active:scale-95 motion-reduce:transition-none"
            aria-label="Fechar menu"
          >
            <X size={20} className="shrink-0" />
          </button>
        </div>

        <NavList onItemClick={onClose} />

        <div className="mt-auto rounded-xl border border-slate-800 bg-slate-950/40 p-3.5">
          <p className="text-xs font-semibold text-slate-300">Dados de demonstração</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
            As informações exibidas são mockadas para fins de visualização do layout.
          </p>
        </div>
      </div>
    </div>
  );
}