import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  // Si no hay usuario, redirige a la página de login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay usuario, muestra el componente hijo (la página protegida)
  return <>{children}</>;
};

export default ProtectedRoute;