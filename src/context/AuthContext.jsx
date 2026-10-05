import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Erro ao invalidar sessão no servidor:", err);
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => window.removeEventListener('session-expired', handleSessionExpired);
  }, [logout]);

  useEffect(() => {
    const controller = new AbortController();

    authService
      .getCurrentUser(controller.signal)
      .then(setUser)
      .catch((err) => {
        if (
          err.name === 'AbortError' ||
          err.name === 'CanceledError' ||
          err.code === 'ERR_CANCELED'
        ) return;
        console.error("Falha na inicialização da autenticação:", err);
        setUser(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const loggedUser = await authService.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado obrigatoriamente dentro de um AuthProvider");
  }
  return context;
};