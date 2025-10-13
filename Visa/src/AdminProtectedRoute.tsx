// AdminProtectedRoute.tsx
import { Navigate } from "react-router-dom";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute = ({ children }: AdminProtectedRouteProps) => {
  const token = localStorage.getItem("accessToken");
  return token ? <>{children}</> : <Navigate to="/admin" replace />;
};

export default AdminProtectedRoute;
