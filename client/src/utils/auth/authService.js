import { jwtDecode } from "jwt-decode";

// Imposta il token nel localStorage
export const setToken = (token) => {
  localStorage.setItem("token", token);
  if (token.role === "admin") {
    localStorage.setItem("adminToken", token);
  }
};

// Recupera il token dal localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Rimuove il token dal localStorage
export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("adminToken");
};

// Decodifica il token JWT
export const decodeToken = (token) => {
  return jwtDecode(token);
};

// Recupera le informazioni dell'utente dal token
export const getUserFromToken = () => {
  const token = getToken();
  if (token) {
    return decodeToken(token);
  }
  return null;
};
