import React, { useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/auth/useAuth";
import "../../styles/Footer.css";

const Footer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Controlla il ruolo dell'utente e lo stato di autenticazione
    if (user) {
      // Aggiungi eventuali effetti collaterali se necessario per l'utente autenticato
    }
  }, [user]);

  // Gestisce il login dell'amministratore
  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  // Verifica dei token nel localStorage
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("token");

  return (
    <footer className="bg-light py-4">
      <Container>
        <div className="footer-content">
          <div className="footer-text">
            &copy; {new Date().getFullYear()} DiscoverWE. All rights reserved.
          </div>
          <Button
            onClick={handleAdminLogin}
            variant="outline-success"
            className="admin-button"
            disabled={adminToken || userToken}
          >
            Admin
          </Button>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
