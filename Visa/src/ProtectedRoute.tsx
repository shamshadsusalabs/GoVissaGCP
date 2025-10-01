// ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = localStorage.getItem("accessToken");
  return token ? <>{children}</> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
