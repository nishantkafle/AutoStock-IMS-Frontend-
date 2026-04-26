import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";

// Blocks a route if not logged in or wrong role
function Protected({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

function AppContent() {
  // Theme persisted in localStorage so it survives refresh
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light",
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route
          path="/"
          element={<Home theme={theme} toggleTheme={toggleTheme} />}
        />
        <Route
          path="/login"
          element={<Login theme={theme} toggleTheme={toggleTheme} />}
        />
        <Route
          path="/register"
          element={<Register theme={theme} toggleTheme={toggleTheme} />}
        />

        {/* Admin only */}
        <Route
          path="/admin/*"
          element={
            <Protected role="Admin">
              <AdminDashboard theme={theme} toggleTheme={toggleTheme} />
            </Protected>
          }
        />

        {/* Staff only */}
        <Route
          path="/staff/*"
          element={
            <Protected role="Staff">
              <StaffDashboard theme={theme} toggleTheme={toggleTheme} />
            </Protected>
          }
        />

        {/* Customer only */}
        <Route
          path="/customer/*"
          element={
            <Protected role="Customer">
              <CustomerDashboard theme={theme} toggleTheme={toggleTheme} />
            </Protected>
          }
        />

        {/* Anything else goes home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
