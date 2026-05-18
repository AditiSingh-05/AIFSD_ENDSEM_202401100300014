import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import api from "./api";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";

function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem("authToken"));
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("authUser");
    return cached ? JSON.parse(cached) : null;
  });

  const saveSession = useCallback((payload) => {
    localStorage.setItem("authToken", payload.token);
    localStorage.setItem("authUser", JSON.stringify(payload.user));
    setToken(payload.token);
    setUser(payload.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) return;

    api
      .get("/auth/me")
      .then(({ data }) => {
        localStorage.setItem("authUser", JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(() => logout());
  }, [logout, token]);

  return { token, user, saveSession, logout };
}

function ProtectedRoute({ token, children }) {
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const auth = useAuth();

  return (
    <Routes>
      <Route path="/login" element={auth.token ? <Navigate to="/dashboard" replace /> : <Login mode="login" saveSession={auth.saveSession} />} />
      <Route path="/signup" element={auth.token ? <Navigate to="/dashboard" replace /> : <Login mode="signup" saveSession={auth.saveSession} />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute token={auth.token}>
            <Dashboard logout={auth.logout} user={auth.user} view="dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute token={auth.token}>
            <Dashboard logout={auth.logout} user={auth.user} view="employees" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/performance"
        element={
          <ProtectedRoute token={auth.token}>
            <Dashboard logout={auth.logout} user={auth.user} view="performance" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai"
        element={
          <ProtectedRoute token={auth.token}>
            <Dashboard logout={auth.logout} user={auth.user} view="ai" />
          </ProtectedRoute>
        }
      />
      {["trainings", "reports", "departments", "skills", "users", "roles"].map((view) => (
        <Route
          element={
            <ProtectedRoute token={auth.token}>
              <Dashboard logout={auth.logout} user={auth.user} view={view} />
            </ProtectedRoute>
          }
          key={view}
          path={`/${view}`}
        />
      ))}
      <Route path="*" element={<Navigate to={auth.token ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}
