import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useTransactions } from "./hooks/useTransactions";
import LoginPage from "./views/LoginPage";
import { Sidebar, MobileDrawer } from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./views/Dashboard";
import WeeklyFinance from "./views/WeeklyFinance";
import BiweeklyFinance from "./views/BiweeklyFinance";
import FinancialReport from "./views/FinancialReport";
import "./index.css";

const TITLE_MAP = {
  "/": "Dashboard Financeiro",
  "/semanal": "Financeiro Semanal",
  "/quinzenal": "Financeiro Quinzenal",
  "/relatorio": "Relatório Financeiro",
};

export default function App() {
  const { user, loading: authLoading, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const frequency = currentPath === '/' ? null : currentPath.substring(1);
  
  const { 
    weeks, 
    quinzenas, 
    loading: txLoading, 
    error, 
    addTransaction, 
    deleteTransaction 
  } = useTransactions(frequency);
  
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (authLoading || (user && txLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 font-medium">
        Carregando dados da nuvem...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <p className="text-rose-600 font-medium mb-2">Erro ao conectar com o banco de dados:</p>
        <p className="text-sm text-slate-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-800 text-white text-sm rounded-lg hover:bg-slate-900"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <Sidebar />
      <MobileDrawer
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header 
          title={TITLE_MAP[currentPath] || "FintechFlow"} 
          onMenuClick={() => setMobileNavOpen(true)}
          user={user}
          onLogout={logout}
        />

        <main className="flex-1 p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Dashboard weeks={weeks} />} />
            <Route
              path="/semanal"
              element={
                <WeeklyFinance
                  weeks={weeks}
                  onAddTransaction={addTransaction}
                  onDeleteTransaction={deleteTransaction}
                />
              }
            />
            <Route
              path="/quinzenal"
              element={
                <BiweeklyFinance
                  quinzenas={quinzenas}
                  onAddTransaction={addTransaction}
                  onDeleteTransaction={deleteTransaction}
                />
              }
            />
            <Route
              path="/relatorio"
              element={<FinancialReport weeks={weeks} quinzenas={quinzenas} />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}