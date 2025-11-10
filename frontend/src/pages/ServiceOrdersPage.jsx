import React, { useEffect, useState } from "react";
import { useServiceOrders } from "../context/ServiceOrdersContext";
import OrderDetailView from "../components/OrderDetailView";
import logo from "../assets/logo.jpg"; // Asegúrate que la ruta sea correcta

// --- El Componente de Tarjeta (que también es el Modal) ---
const OrderCard = ({ order }) => {
  const [show, setShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleShow = () => {
    setIsExiting(false);
    setShow(true);
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShow(false);
    }, 300);
  };

  // Formatear la fecha
  const scheduledDate = new Date(order.scheduled_date).toLocaleDateString(
    "es-MX",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  // Color del estado
  const statusConfig = {
    Pendiente: "bg-yellow-100 text-yellow-800",
    Completada: "bg-green-100 text-green-800",
    Cancelada: "bg-red-100 text-red-800",
  };
  const statusStyle = statusConfig[order.state_] || "bg-gray-100 text-gray-800";

  return (
    <>
      {/* --- La Tarjeta --- */}
      <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col text-left hover:shadow-lg transition relative">
        {/* Encabezado de la tarjeta con ID y Estado */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-bold text-[#0159B3]">
            Orden #{order.id_service_order}
          </p>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyle}`}
          >
            {order.state_}
          </span>
        </div>

        {/* Servicio */}
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {order.service_name || "Servicio no especificado"}
        </h3>

        {/* Detalles (Cliente y Personal) */}
        <div className="text-sm text-gray-600 space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <i className="fas fa-user w-4 text-center text-gray-400"></i>
            <span className="font-medium">
              {order.client_name || "Sin Cliente"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <i className="fas fa-hard-hat w-4 text-center text-gray-400"></i>
            <span>{order.personal_name || "Sin Asignar"}</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <i className="fas fa-calendar-alt w-4 text-center text-gray-400"></i>
            <span className="font-semibold">{scheduledDate}</span>
          </div>
        </div>

        {/* Botón de Detalles */}
        <div className="flex gap-2 mt-auto">
          <button
            type="button"
            onClick={handleShow}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#0159B3] px-4 py-2 font-semibold text-white shadow-sm hover:bg-blue-800 transition-all duration-200 ease-in-out"
          >
            <i className="fas fa-eye"></i>
            Ver Detalles
          </button>
        </div>
      </div>

      {/* --- El Modal --- */}
      {show && (
        <div
          className={`fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 ${
            isExiting ? "animate-fadeOut" : "animate-fadeIn"
          }`}
          onClick={handleClose}
        >
          <div
            className={`relative z-50 w-full max-w-4xl rounded-xl bg-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${
              isExiting ? "animate-slideDown" : "animate-slideUp"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b p-4 pl-8 bg-[#0159B3] text-white rounded-t-xl">
              <div className="flex items-center">
                <img src={logo} alt="" className="w-15 rounded-lg" />
                <span className="mx-5 h-10 bg-black border opacity-25"></span>
                <h3 className="text-lg font-semibold items-center flex">
                  Detalles de Orden #{order.id_service_order}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-white/80 hover:text-white transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Contenido */}
            <div className="overflow-y-auto flex-1">
              <OrderDetailView orderId={order.id_service_order} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 border-t p-4 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md bg-gray-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-gray-600 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// --- La Página Principal ---
const ServiceOrdersPage = () => {
  const { serviceOrders, getServiceOrders } = useServiceOrders();

  useEffect(() => {
    getServiceOrders();
  }, []);

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl shadow-sm">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <i className="fas fa-clipboard-list text-[#0159B3] text-xl"></i>
          <h2 className="text-2xl font-bold text-gray-800">
            Órdenes de Servicio
          </h2>
        </div>
      </div>

      <hr className="my-4 border-gray-300" />

      {/* --- Grid de Tarjetas --- */}
      {serviceOrders.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No hay órdenes registradas aún.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {serviceOrders.map((order) => (
            <OrderCard key={order.id_service_order} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceOrdersPage;
