import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || '';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      credentials: "include"
    })
      .then((r) => {
        if (r.ok) return r.json();
        localStorage.removeItem("token");
        return null;
      })
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error((await res.json()).error || "Erro ao entrar");
    
    const data = await res.json();
    
    if (data.token) {
      localStorage.getItem("token");
      localStorage.setItem("token", data.token);
    }
    
    const userData = data.user || { id: data.id, name: data.name, email: data.email };
    setUser(userData);
    return data;
  };

  const logout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { 
        method: "POST", 
        credentials: "include" 
      });
    } catch (err) {
      console.error("Erro ao realizar logout no servidor:", err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);