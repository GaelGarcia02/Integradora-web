import { Routes, Route } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  // const location = useLocation();
  const isLoginPage = location.pathname === "/";

  /*   const shouldShowSidebarNavbar =
    !isLoginPage && !isVerificationPage && !isNotFoundPage; */

  return (
    <div className="contenedor">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/tasks" element={<TasksPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
