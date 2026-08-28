import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./views/LoginPage";
import { Sidebar, MobileDrawer } from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./views/Dashboard";
import WeeklyFinance from "./views/WeeklyFinance";
import BiweeklyFinance from "./views/BiweeklyFinance";
import FinancialReport from "./views/FinancialReport";
import { initialWeeks, initialQuinzenas, tx } from "./data/mockData";
import "./index.css";

const TITLE_MAP = {
  dashboard: "Dashboard Financeiro",
  semanal: "Financeiro Semanal",
  quinzenal: "Financeiro Quinzenal",
  relatorio: "Relatório Financeiro",
};

export default function App() {
  const { user, loading, logout } = useAuth();
  const [view, setView] = useState("dashboard");
  const [weeks, setWeeks] = useState(initialWeeks);
  const [quinzenas, setQuinzenas] = useState(initialQuinzenas);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const addWeeklyTx = (periodId, novaTx) => {
    setWeeks((prev) =>
      prev.map((w) =>
        w.id === periodId
          ? {
              ...w,
              transacoes: [
                ...w.transacoes,
                tx(novaTx.tipo, novaTx.descricao, novaTx.categoria, novaTx.valor, novaTx.data, novaTx.observacao),
              ],
            }
          : w
      )
    );
  };

  const addQuinzenalTx = (periodId, novaTx) => {
    setQuinzenas((prev) =>
      prev.map((q) =>
        q.id === periodId
          ? {
              ...q,
              transacoes: [
                ...q.transacoes,
                tx(novaTx.tipo, novaTx.descricao, novaTx.categoria, novaTx.valor, novaTx.data, novaTx.observacao),
              ],
            }
          : q
      )
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-400">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <Sidebar active={view} onSelect={setView} />
      <MobileDrawer
        open={mobileNavOpen}
        active={view}
        onSelect={setView}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <Header 
          title={TITLE_MAP[view]} 
          onMenuClick={() => setMobileNavOpen(true)}
          user={user}
          onLogout={logout}
        />

        <main className="flex-1 p-4 sm:p-6">
          {view === "dashboard" && <Dashboard weeks={weeks} />}
          {view === "semanal" && <WeeklyFinance weeks={weeks} onAddTransaction={addWeeklyTx} />}
          {view === "quinzenal" && (
            <BiweeklyFinance quinzenas={quinzenas} onAddTransaction={addQuinzenalTx} />
          )}
          {view === "relatorio" && <FinancialReport weeks={weeks} quinzenas={quinzenas} />}
        </main>
      </div>
    </div>
  );
}