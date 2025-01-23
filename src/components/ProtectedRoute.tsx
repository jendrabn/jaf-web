import { useAuth } from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router";
import Loading from "./Loading";

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading className="min-vh-100" />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
}

export default ProtectedRoute;
