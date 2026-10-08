import { useContext } from "react";
import { AuthContext } from "./AuthContextValue";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado obrigatoriamente dentro de um AuthProvider");
  }
  return context;
};
