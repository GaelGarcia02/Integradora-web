import React, { useEffect, useState } from "react";
import { useServiceOrders } from "../context/ServiceOrdersContext";
import Swal from "sweetalert2";

// --- Botones y Modales ---
import BotonModal from "../components/Buttons/BotonModal";
import BotonEditarModal from "../components/Buttons/BotonEditarModal";
import OrderDetailView from "../components/OrderDetailView";
import logo from "../assets/logo.jpg"; // Asegúrate que la ruta sea correcta
import FormularioOrdenDeServicio from "../components/Forms/FormularioOrdenDeServicio";

// --- Componente de Tarjeta (con modal "Ver Detalles" integrado) ---
const OrderCard = ({ order, onDelete, onSuccessRefresh }) => {
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

  const handleButtonClicks = (e) => {
    e.stopPropagation();
  };

  const date = new Date(order.scheduled_date);
  const day = date.toLocaleDateString("es-MX", { day: "2-digit" });
  const month = date
    .toLocaleDateString("es-MX", { month: "short" })
    .toUpperCase()
    .replace(".", "");

  const statusConfig = {
    Pendiente: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Completada: "bg-green-100 text-green-800 border-green-300",
    Cancelada: "bg-red-100 text-red-800 border-red-300",
  };
  const statusStyle = statusConfig[order.state_] || "bg-gray-100 text-gray-800";

  return (
    <>
      <div className="bg-white shadow-md rounded-2xl flex flex-col text-left transition-shadow hover:shadow-lg">
        {/* --- Área clicable (abre "Ver Detalles") --- */}
        <button
          type="button"
          onClick={handleShow}
          className="p-4 w-full h-full text-left  cursor-pointer"
        >
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-bold text-[#0159B3]">
              Orden #{order.id_service_order}
            </p>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusStyle}`}
            >
              {order.state_}
            </span>
          </div>

          <h3
            className="text-lg font-semibold text-gray-800 mb-2 truncate"
            title={order.service_name}
          >
            {order.service_name || "Servicio no especificado"}
          </h3>

          <div className="text-sm text-gray-600 space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <i className="fas fa-user w-4 text-center text-gray-400"></i>
              <span className="font-medium truncate" title={order.client_name}>
                {order.client_name || "Sin Cliente"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-hard-hat w-4 text-center text-gray-400"></i>
              <span className="truncate" title={order.personal_name}>
                {order.personal_name || "Sin Asignar"}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <i className="fas fa-calendar-alt w-4 text-center text-gray-400"></i>
              <span className="font-semibold">
                {day} de {month.toLowerCase()}
              </span>
            </div>
          </div>
        </button>

        {/* --- Área de botones (no clicable para el modal) --- */}
        <div
          className="flex gap-2 mt-auto pt-3 border-t p-4 justify-center"
          onClick={handleButtonClicks}
        >
          <BotonEditarModal
            nombreBoton="Editar"
            icono="fas fa-edit"
            titulo={`Editar Orden #${order.id_service_order}`}
            contenidoModal={() => (
              <FormularioOrdenDeServicio
                id_service_order={order.id_service_order}
                onSuccess={onSuccessRefresh}
              />
            )}
          />

          <button
            onClick={() => onDelete(order.id_service_order)}
            className="bg-red-600 text-white p-2 px-3 rounded-lg hover:bg-red-700 transition cursor-pointer"
            title="Eliminar"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      {/* --- Modal (ver detalles) --- */}
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
            <div className="flex items-center justify-between border-b p-4 pl-8 bg-[#0159B3] text-white rounded-t-xl">
              <div className="flex items-center">
                <img src={logo} alt="logo" className="w-16 rounded-lg" />
                <span className="mx-5 h-10 bg-black border opacity-25"></span>
                <h3 className="text-lg font-semibold flex items-center">
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

            <div className="overflow-y-auto flex-1">
              <OrderDetailView orderId={order.id_service_order} />
            </div>

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

// --- Página principal ---
const ServiceOrdersPage = () => {
  const { serviceOrders, getServiceOrders, deleteServiceOrder } =
    useServiceOrders();

  useEffect(() => {
    getServiceOrders();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar Orden de Servicio?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteServiceOrder(id);
        Swal.fire({
          icon: "success",
          title: "Orden eliminada",
          showConfirmButton: false,
          timer: 1500,
        });
        getServiceOrders();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al eliminar la orden",
          text: error.response?.data?.message || "Intente nuevamente",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  return (
    <div className=" w-full p-6 bg-gray-50 rounded-xl shadow-sm">
      {/* Encabezado */}
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-clipboard-list text-[#0159B3] text-xl"></i>
        <h2 className="text-2xl font-bold text-gray-800">
          Órdenes de Servicio
        </h2>
      </div>
      <div>
        <p className="text-gray-500 text-sm mb-6">
          * Haga click en una tarjeta para ver más detalles.
        </p>
      </div>

      <hr className="mb-6 border-gray-300" />

      {/* Botón de Crear */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-6">
        <BotonModal
          nombreBoton="Crear Orden"
          icono="fas fa-plus"
          titulo="Crear Nueva Orden de Servicio"
          contenidoModal={
            <FormularioOrdenDeServicio onSuccess={getServiceOrders} />
          }
        />
      </div>

      {/* Grid de tarjetas */}
      {serviceOrders.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No hay órdenes registradas aún.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {serviceOrders.map((order) => (
            <OrderCard
              key={order.id_service_order}
              order={order}
              onDelete={handleDelete}
              onSuccessRefresh={getServiceOrders}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceOrdersPage;
