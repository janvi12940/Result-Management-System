import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PublicSearch from "./pages/PublicSearch";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import { apiRequest } from "./lib/api";

const AUTH_STORAGE_KEY = "result-management-auth";

function App() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(() => {
    const storedValue = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : null;
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [auth]);

  const login = async (payload) => {
    const response = await apiRequest("/api/auth/login", {
      method: "POST",
      body: payload,
    });

    setAuth(response);

    if (response.user.role === "admin") navigate("/admin/dashboard");
    if (response.user.role === "faculty") navigate("/faculty/dashboard");
    if (response.user.role === "student") navigate("/student/dashboard");
  };

  const logout = () => {
    setAuth(null);
    navigate("/");
  };

  return (
    <div className="app-shell">
      <Navbar auth={auth} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<PublicSearch />} />
        <Route path="/login/:role" element={<Login onLogin={login} />} />
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute auth={auth} allow={["student"]}>
              <StudentDashboard auth={auth} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute auth={auth} allow={["faculty", "admin"]}>
              <FacultyDashboard auth={auth} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute auth={auth} allow={["admin"]}>
              <AdminDashboard auth={auth} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
