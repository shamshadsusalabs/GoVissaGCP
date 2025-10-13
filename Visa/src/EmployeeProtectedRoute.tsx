import { Navigate } from "react-router-dom";

interface EmployeeProtectedRouteProps {
  children: React.ReactNode;
}

const EmployeeProtectedRoute = ({ children }: EmployeeProtectedRouteProps) => {
  const employeeToken = localStorage.getItem("accessToken"); // or use a different key if needed
  return employeeToken ? <>{children}</> : <Navigate to="/employee" replace />;
};

export default EmployeeProtectedRoute;
