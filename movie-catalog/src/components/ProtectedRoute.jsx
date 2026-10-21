import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Обёртка для маршрутов, требующих авторизации
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;