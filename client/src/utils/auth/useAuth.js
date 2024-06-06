import React, { createContext, useContext, useState, useEffect } from "react";
import { getUserFromToken, setToken, removeToken } from "./authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Effettua il recupero dell'utente dal token quando il componente viene montato
  useEffect(() => {
    const user = getUserFromToken();
    setUser(user);
  }, []);

  // Funzione di login: imposta il token e reindirizza in base al ruolo dell'utente
  const login = (token) => {
    setToken(token);
    const user = getUserFromToken();
    setUser(user);
    if (user.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      window.location.href = "/";
    }
  };

  // Funzione di logout: rimuove il token e reindirizza alla homepage
  const logout = () => {
    removeToken();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook per utilizzare il contesto di autenticazione
export const useAuth = () => {
  return useContext(AuthContext);
};
