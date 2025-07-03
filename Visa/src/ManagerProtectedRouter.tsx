import { Navigate } from "react-router-dom";

interface ManagerProtectedRouteProps {
  children: React.ReactNode;
}

const EmployeeProtectedRoute = ({ children }: ManagerProtectedRouteProps) => {
  const employeeToken = localStorage.getItem("accessToken"); // or use a different key if needed
  return employeeToken ? <>{children}</> : <Navigate to="/manager" replace />;
};

export default EmployeeProtectedRoute;
