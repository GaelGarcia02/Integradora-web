import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen ">
      <Sidebar />
      <div className="flex-1 h-screen overflow-auto">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
