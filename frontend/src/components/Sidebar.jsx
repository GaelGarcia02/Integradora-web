import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { useAuth } from "../context/AuthContext";
import { cerrarSesion } from "../utils/sweetAlert";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();

  const toggleCollapse = () => setIsCollapsed((s) => !s);

  const menu = [
    { to: "/tareas", label: "Tareas Asignadas", icon: "fas fa-tasks" },
    { to: "/personal", label: "Personal", icon: "fas fa-users" },
    { to: "/clientes", label: "Clientes", icon: "fas fa-user-friends" },
    { to: "/proveedores", label: "Proveedores", icon: "fas fa-truck" },
    { to: "/contactos", label: "Contactos", icon: "fas fa-address-book" },
    { to: "/categorias", label: "Categorías", icon: "fas fa-list" },
    { to: "/inventario", label: "Inventario", icon: "fas fa-box" },
    { to: "/servicios", label: "Servicios", icon: "fas fa-tools" },
    {
      to: "/ordenes-servicio",
      label: "Ordenes de Servicio",
      icon: "fas fa-bell",
    },
  ];

  return (
    <aside
      className={`h-screen shrink-0 transition-all duration-200 ease-in-out`}
      aria-hidden={false}
      style={{ width: isCollapsed ? "4.5rem" : "16rem" }}
    >
      <div
        className="flex flex-col h-full"
        style={{ backgroundColor: "#0159B3", color: "#ffffff" }}
      >
        <div
          className={`flex items-center justify-between px-3 py-3 border-b transition-all ${
            isCollapsed ? "justify-center" : ""
          }`}
          style={{ borderColor: "rgba(255,199,44, 0.30)" }}
        >
          <div
            className={`flex items-center gap-3 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <img
              src={logo}
              alt="logo"
              className={`w-auto rounded-sm transition-all ${
                isCollapsed ? "hidden" : "h-10"
              }`}
            />
            {!isCollapsed && (
              <div>
                <h3 className="text-white font-semibold text-sm">Bienvenido</h3>
                {/* {user && (
                  <p className="text-[#FFC72C] text-xs truncate">
                    {user.role ? user.role : `ID: ${user.id_personal}`}
                  </p>
                )} */}
              </div>
            )}
          </div>

          <button
            className="p-2 rounded-md border-2 border-white/20 hover:border-white/40 transition"
            onClick={toggleCollapse}
            aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
            title={isCollapsed ? "Expandir" : "Colapsar"}
            style={{ backgroundColor: "transparent" }}
          >
            {isCollapsed ? (
              // Icono para EXPANDIR
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            ) : (
              // Icono para COLAPSAR
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            )}
          </button>
        </div>

        <nav className="px-1 py-4 overflow-auto flex-1">
          <ul className="space-y-2">
            {menu.map((item) => (
              <li key={item.to} title={isCollapsed ? item.label : undefined}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center ${
                      isCollapsed ? "justify-center" : "gap-3 px-4"
                    } py-3 rounded-md text-sm transition-colors duration-150 ${
                      isActive
                        ? "bg-white text-[#0159B3] font-semibold shadow-sm"
                        : "text-white hover:bg-[#FFC72C] hover:text-[#0159B3] hover:font-medium"
                    }`
                  }
                >
                  {/* Ícono siempre visible */}
                  <span className="w-6 flex justify-center text-lg">
                    <i className={`${item.icon} text-current`}></i>
                  </span>

                  {/* Texto solo si no está colapsado */}
                  {!isCollapsed && (
                    <span className="truncate transition-all duration-200">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className="px-3 py-3 border-t transition-all"
          style={{ borderColor: "rgba(255,199,44,0.30)" }}
        >
          {!isCollapsed ? (
            <button
              className="w-full py-2 rounded-md bg-white text-[#0159B3] font-semibold hover:opacity-95 transition flex items-center justify-center gap-2"
              onClick={() => cerrarSesion(logout)}
              title="Cerrar sesión"
            >
              <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
              <span>Cerrar sesión</span>
            </button>
          ) : (
            <div className="flex items-center justify-center">
              <button
                className="p-3 rounded-md bg-white text-[#0159B3] hover:opacity-95 transition"
                onClick={() => cerrarSesion(logout)}
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
