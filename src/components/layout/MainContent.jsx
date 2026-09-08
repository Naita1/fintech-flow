import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { useTransactionsContext } from "../../context/TransactionsContext";

const Dashboard = lazy(() => import("../../views/Dashboard"));
const WeeklyFinance = lazy(() => import("../../views/WeeklyFinance"));
const BiweeklyFinance = lazy(() => import("../../views/BiweeklyFinance"));
const FinancialReport = lazy(() => import("../../views/FinancialReport"));

export default function MainContent() {
  const { loading, error, refetch } = useTransactionsContext();

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="flex items-center space-x-2 font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          <span>Carregando transações...</span>
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
          <div className="flex h-full items-center justify-center text-sm text-slate-400 animate-pulse">
            Carregando tela...
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