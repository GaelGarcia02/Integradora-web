import { Routes, Route } from "react-router-dom";
// import Sidebar from "./components/Sidebar";

import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import PersonalPage from "./pages/PersonalPage";
import ClientsPage from "./pages/ClientsPage";
import SuppliersPage from "./pages/SuppliersPage";
import ContactsPage from "./pages/ContactsPage";
import CategoriesPage from "./pages/CategoriesPage";
import InventoryPage from "./pages/InventoryPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceOrdersPage from "./pages/ServiceOrdersPage";

import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
import { PersonalProvider } from "./context/PersonalContext";
import { RolesProvider } from "./context/RolesContext";
import { ClientsProvider } from "./context/ClientsContext";
import { SuppliersProvider } from "./context/SuppliersContext";
import { ContactsProvider } from "./context/ContactsContext";
import { ServicesProvider } from "./context/ServicesContext";
import { CategoriesProvider } from "./context/CategoriesContext";
import { InventoryProvider } from "./context/InventoryContext";
import { ServiceOrdersProvider } from "./context/ServiceOrdersContext";

function App() {
  return (
    <AuthProvider>
      <PersonalProvider>
        <RolesProvider>
          <ClientsProvider>
            <SuppliersProvider>
              <ContactsProvider>
                <ServicesProvider>
                  <CategoriesProvider>
                    <InventoryProvider>
                      <ServiceOrdersProvider>
                        <AppContent />
                      </ServiceOrdersProvider>
                    </InventoryProvider>
                  </CategoriesProvider>
                </ServicesProvider>
              </ContactsProvider>
            </SuppliersProvider>
          </ClientsProvider>
        </RolesProvider>
      </PersonalProvider>
    </AuthProvider>
  );
}

function AppContent() {
  // const location = useLocation();
  // const isLoginPage = location.pathname === "/";

  /*   const shouldShowSidebarNavbar =
    !isLoginPage && !isVerificationPage && !isNotFoundPage; */

  return (
    <div className="contenedor">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/personal" element={<PersonalPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/proveedores" element={<SuppliersPage />} />
          <Route path="/contactos" element={<ContactsPage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/inventario" element={<InventoryPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/ordenes-servicio" element={<ServiceOrdersPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
