import { Routes, Route } from "react-router-dom";
import { useTransactionsContext } from "../../context/TransactionsContext";

import Dashboard from "../../views/Dashboard";
import WeeklyFinance from "../../views/WeeklyFinance";
import BiweeklyFinance from "../../views/BiweeklyFinance";
import FinancialReport from "../../views/FinancialReport";

export default function MainContent() {
  const { loading, error, refetch } = useTransactionsContext();

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="flex items-center space-x-2 text-slate-500 font-medium">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          <span>Carregando transações...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center p-4 text-center">
        <p className="text-rose-600 font-medium mb-2">Erro ao carregar movimentações:</p>
        <p className="text-sm text-slate-500 mb-4">{error}</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-900 transition-colors"
        >
          Tentar Novamente
        </button>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/semanal" element={<WeeklyFinance />} />
        <Route path="/quinzenal" element={<BiweeklyFinance />} />
        <Route path="/relatorio" element={<FinancialReport />} />
      </Routes>
    </main>
  );
}