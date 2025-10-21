import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";
// import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  // const { user, isAuthenticated } = useAuth();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <aside
        className={`fixed top-0 left-0 z-30 w-64 bg-gray-800 text-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out`}
        aria-hidden={!isOpen}
      >
        <div className="flex flex-col h-screen">
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
            <img src={logo} alt="logo" className="h-12 w-auto" />
            <button
              className="p-2 bg-red-600 rounded-md text-white"
              onClick={toggleSidebar}
              aria-label="Cerrar menú"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <nav className="px-2 py-6 overflow-auto flex-1">
            <ul className="space-y-1">
              <li>
                <NavLink
                  to="/personal"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition-colors text-sm ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-users w-4 text-lg"></i>
                  <span>Personal</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/clientes"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition-colors text-sm ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-users w-4 text-lg"></i>
                  <span>Clientes</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/proveedores"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition-colors text-sm ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-truck w-4 text-lg"></i>
                  <span>Proveedores</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/contactos"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition-colors text-sm ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-address-book w-4 text-lg"></i>
                  <span>Contactos</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/categorias"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition-colors text-sm ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-list w-4 text-lg"></i>
                  <span>Categorías</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/productos"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition-colors text-sm ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-box w-4 text-lg"></i>
                  <span>Productos</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/servicios"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition-colors text-sm ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-concierge-bell w-4 text-lg"></i>
                  <span>Servicios</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/ordenes-servicio"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition-colors text-sm ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-tools w-4 text-lg"></i>
                  <span>Ordenes de Servicio</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/cotizaciones"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition-colors text-sm ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-file-invoice-dollar w-4 text-lg"></i>
                  <span>Cotizaciones</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/ordenes-de-compra"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition-colors text-sm ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-shopping-cart w-4 text-lg"></i>
                  <span>Ordenes de Compra</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/activos-de-clientes"
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded transition-colors text-sm ${
                      isActive ? "bg-gray-700" : "hover:bg-gray-700"
                    }`
                  }
                >
                  <i className="fas fa-wallet w-4 text-lg"></i>
                  <span>Activos de Clientes</span>
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
