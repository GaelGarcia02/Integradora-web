import React from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
// paginas a usar
import PersonalPage from "./pages/PersonalPage";
import ActiveCustomerPage from "./pages/ActiveCustomerPage";
import CategoryPage from "./pages/CategoryPage";
import ContactsPage from "./pages/ContactsPage";
import ClientsPage from "./pages/ClientsPage";
import DocumentPage from "./pages/DocumentPage";
import OrderServicePage from "./pages/OrderServicePage";
import ProductsPage from "./pages/ProductsPage";
import ProvidersPage from "./pages/SuppliersPage";
import PurchaseOrderPage from "./pages/PurchaseOrderPage";
import QuotesPage from "./pages/QuotesPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceOrdersPage from "./pages/ServiceOrdersPage";
import SettingsPage from "./pages/ConfigPages/SettingsPage";
import RolPage from "./pages/ConfigPages/RolPage";
import FormularioOrdenServicio from "./pages/Forms/FormularioordenServicio";
import FormularioCotizacion from "./pages/Forms/FormularioCotizacion";
import FormularioOrdenCompra from "./pages/Forms/FormularioOrdenCompra";
import NotFoundPage from "./pages/NotFoundPage";
import CalendarPage from "./pages/CalendarPage";

const Admin = () => {
  return (
    <div className="contenedor">
      <Sidebar />
      <div className="content">
        <Navbar />
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/personal" element={<PersonalPage />} />
          <Route path="/activos-de-clientes" element={<ActiveCustomerPage />} />
          <Route path="/categorias" element={<CategoryPage />} />
          <Route path="/contactos" element={<ContactsPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/documentos" element={<DocumentPage />} />
          {/* <Route path="/ordenes-de-servicio" element={<OrderServicePage />} /> */}
          {/* <Route path="/polizas" element={<PolicyPage />} /> */}
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/proveedores" element={<ProvidersPage />} />
          <Route path="/ordenes-de-compra" element={<PurchaseOrderPage />} />
          <Route path="/cotizaciones" element={<QuotesPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          {/* <Route path="/ordenes-de-compra" element={<ServiceOrdersPage />} /> */}
          <Route path="/ordenes-servicio" element={<ServiceOrdersPage />} />
          <Route path="/ordenes-servicio" element={<ServiceOrdersPage />} />
          <Route path="/configuraciones" element={<SettingsPage />} />
          <Route path="/roles" element={<RolPage />} />

          <Route
            path="/formulario-orden-servicio"
            element={<FormularioOrdenServicio />}
          />
          <Route
            path="/formulario-orden-servicio/:id"
            element={<FormularioOrdenServicio />}
          />

          <Route
            path="/formulario-cotizacion"
            element={<FormularioCotizacion />}
          />
          <Route
            path="/formulario-cotizacion/:id"
            element={<FormularioCotizacion />}
          />

          <Route
            path="/formulario-orden-compra"
            element={<FormularioOrdenCompra />}
          />
          <Route
            path="/formulario-orden-compra/:id"
            element={<FormularioOrdenCompra />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
