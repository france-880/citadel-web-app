import { useAuth } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RoleGuard({ allowed, children }) {
  const { user } = useAuth();

  if (!user) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(user.role)) {
    // Logged in but role not allowed - redirect to login
    return <Navigate to="/login" replace />;
  }

  // Allowed
  return children;
}
