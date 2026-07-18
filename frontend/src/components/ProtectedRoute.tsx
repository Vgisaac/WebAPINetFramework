import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getRoleFromToken } from "../helpers/jwt";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  // Si no hay usuario, redirige a la página de login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const role = user.rol ?? getRoleFromToken(user.token);

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to="/productos" replace />;
  }

  // Si hay usuario, muestra el componente hijo (la página protegida)
  return <>{children}</>;
};

export default ProtectedRoute;
