import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="contenedor">
      <Sidebar />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default ProtectedRoute;
