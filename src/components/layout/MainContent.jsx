import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { useTransactionsContext } from "../../context/useTransactionsContext";

const Dashboard = lazy(() => import("../../views/Dashboard"));
const WeeklyFinance = lazy(() => import("../../views/WeeklyFinance"));
const BiweeklyFinance = lazy(() => import("../../views/BiweeklyFinance"));
const FinancialReport = lazy(() => import("../../views/FinancialReport"));

export default function MainContent() {
  const { loading, error, refetch } = useTransactionsContext();

  if (loading) {
    return (
      <main className="flex-1 p-4 sm:p-6" role="status" aria-live="polite" aria-label="Carregando transações">
        <div className="space-y-6 motion-safe:animate-pulse">
          <div className="h-28 rounded-2xl bg-white shadow-sm" />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-24 rounded-xl border border-slate-200 bg-white" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-72 rounded-xl border border-slate-200 bg-white" />
            ))}
          </div>
          <span className="sr-only">Carregando transações...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <p className="mb-2 font-medium text-rose-600">Erro ao carregar movimentações:</p>
        <p className="mb-4 text-sm text-slate-500">{error}</p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white transition-colors hover:bg-slate-900"
        >
          Tentar Novamente
        </button>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6">
      <Suspense
        fallback={
          <div className="space-y-4 motion-safe:animate-pulse" role="status" aria-live="polite">
            <div className="h-8 w-56 rounded-lg bg-slate-200" />
            <div className="h-64 rounded-xl border border-slate-200 bg-white" />
            <span className="sr-only">Carregando tela...</span>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/semanal" element={<WeeklyFinance />} />
          <Route path="/quinzenal" element={<BiweeklyFinance />} />
          <Route path="/relatorio" element={<FinancialReport />} />
        </Routes>
      </Suspense>
    </main>
  );
}