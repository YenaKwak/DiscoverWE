import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../utils/auth/useAuth";
import AppNavbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { CgLogIn } from "react-icons/cg";
import "../styles/AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();

  // Gestione dell'invio del modulo di login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8001/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        login(data.token);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login.");
    }
  };

  return (
    <>
      <AppNavbar />
      <div className="admin-login-container">
        <div className="admin-login-box">
          <h2>Admin Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button className="custom-login-button" type="submit">
              <CgLogIn />
            </Button>
          </Form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
