import { Navigate } from "react-router-dom";

function ProtectedRoute({ auth, allow, children }) {
  if (!auth?.token) {
    return <Navigate to="/login/student" replace />;
  }

  if (!allow.includes(auth.user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
