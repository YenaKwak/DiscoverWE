import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { CiUser } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { GiCommercialAirplane } from "react-icons/gi";
import { RxDashboard } from "react-icons/rx";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Navbar.css";
import { useAuth } from "../../utils/auth/useAuth";

const AppNavbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      setIsAdmin(user.role === "admin");
    }
  }, [user]);

  // Gestisce il logout dell'utente
  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <GiCommercialAirplane
            size={30}
            className="navbar-icon"
            color="green"
          />
          <span className="p-2">DiscoverWE</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
          <div className="text-end">
            {isLoggedIn ? (
              <Dropdown alignRight>
                <Dropdown.Toggle variant="link" id="dropdown-basic-navbar">
                  <FaUser size={30} />
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-right">
                  {isAdmin ? (
                    <Dropdown.Item as={Link} to="/admin/dashboard">
                      <RxDashboard /> Dashboard
                    </Dropdown.Item>
                  ) : (
                    <Dropdown.Item as={Link} to="/profile">
                      <CgProfile /> Profile
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item onClick={handleLogout}>
                    <BiLogOut /> Log out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Link to="/login" className="login-link">
                <button
                  type="button"
                  className="btn btn-outline-black me-2 login-button"
                >
                  <CiUser size={30} />
                  <div className="login-text">Log in</div>
                </button>
              </Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
