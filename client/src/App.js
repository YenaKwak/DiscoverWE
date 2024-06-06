// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./pages/Home";
import AdminPage from "./pages/AdminPage";
import AdminLogin from "./pages/AdminLogin";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import GoogleCallback from "./pages/GoogleCallback";
import { AuthProvider, useAuth } from "./utils/auth/useAuth";
import CarouselComponent from "./components/common/CarouselComponent";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carousel" element={<CarouselComponent />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/google/callback" element={<GoogleCallback />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute admin>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

const PrivateRoute = ({ children, admin }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (admin && user.role !== "admin") {
    return <Navigate to="/login" />;
  }
  return children;
};

export default App;
