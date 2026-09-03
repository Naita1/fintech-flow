import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { TransactionsProvider } from "./context/TransactionsContext";
import LoginPage from "./views/LoginPage";
import { Sidebar, MobileDrawer } from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import MainContent from "./components/layout/MainContent";

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 font-medium">
        Carregando dados da nuvem...
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <TransactionsProvider>
      <div className="flex min-h-screen w-full bg-slate-50">
        <Sidebar />
        <MobileDrawer
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />

        <div className="flex min-h-screen flex-1 flex-col">
          <Header
            title={TITLE_MAP[location.pathname] || "FintechFlow"}
            onMenuClick={() => setMobileNavOpen(true)}
            user={user}
            onLogout={logout}
          />
          <MainContent />
        </div>
      </div>
    </TransactionsProvider>
  );
}