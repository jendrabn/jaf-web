import { useAuthState } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router";
import Loading from "@/components/ui/Loading";

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthState();

  if (isLoading) return <Loading className="min-dvh-100" />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" replace />;
}

export default ProtectedRoute;
