import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Componente di callback per il login con Google
const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    // Se il token è presente, salvarlo nel localStorage
    if (token) {
      localStorage.setItem("token", token);
    }

    // Reindirizzare l'utente alla homepage
    navigate("/");
  }, [navigate]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
