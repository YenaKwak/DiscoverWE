import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaGoogle } from "react-icons/fa";
import AppNavbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import AlertModal from "../components/common/AlertModal";
import "../styles/LoginPage.css";

// Componente per la pagina di login
const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Funzione per alternare tra login e signup
  const handleToggle = () => {
    setIsSignUp(!isSignUp);
  };

  // Funzione per chiudere il modal
  const handleCloseModal = () => {
    setModalShow(false);
  };

  // Funzione per gestire il login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setModalTitle("Login Successful");
        setModalMessage("You have successfully logged in.");
        setModalShow(true);
        setTimeout(() => {
          setModalShow(false);
          window.location.href = "/";
        }, 2000);
      } else {
        const errorData = await response.json();
        setModalTitle("Login Failed");
        setModalMessage(errorData.message || "Invalid email or password.");
        setModalShow(true);
      }
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("An error occurred. Please try again.");
      setModalShow(true);
    }
  };

  // Funzione per gestire il signup
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8001/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        setModalTitle("Sign Up Successful");
        setModalMessage("You have successfully signed up.");
        setModalShow(true);
        setTimeout(() => {
          setModalShow(false);
          window.location.href = "/";
        }, 2000);
      } else {
        const errorData = await response.json();
        setModalTitle("Sign Up Failed");
        setModalMessage(errorData.message || "Could not create account.");
        setModalShow(true);
      }
    } catch (error) {
      setModalTitle("Error");
      setModalMessage("An error occurred. Please try again.");
      setModalShow(true);
    }
  };

  // Funzione per il login con Google
  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:8001/auth/google?prompt=select_account";
  };

  return (
    <>
      <AppNavbar />
      <Container className="login-page-container">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <div className="login-header text-center">
              <h1 className="text text-large">
                {isSignUp ? "SIGN UP" : "SIGN IN"}
              </h1>
              <p className="text text-normal">
                {isSignUp ? "Already have an account?" : "New user?"}{" "}
                <span>
                  <button
                    type="button"
                    className="text text-links underlined-text"
                    onClick={handleToggle}
                  >
                    {isSignUp ? "Sign in" : "Create an account"}
                  </button>
                </span>
              </p>
            </div>
            <Form
              onSubmit={isSignUp ? handleSignUp : handleLogin}
              className="login-form"
            >
              {isSignUp && (
                <Form.Group controlId="formName">
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              )}
              <Form.Group controlId="formEmail">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button variant="success" type="submit" className="w-100 mt-3">
                {isSignUp ? "Sign Up" : "Continue"}
              </Button>
            </Form>
            {!isSignUp && (
              <>
                <div className="text-center my-3">or continue with</div>
                <div className="wrapper">
                  <button onClick={handleGoogleLogin} className="btn-google">
                    <FaGoogle />
                    <span> Login With Google</span>
                  </button>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
      <Footer />
      <AlertModal
        show={modalShow}
        handleClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
      />
    </>
  );
};

export default LoginPage;
