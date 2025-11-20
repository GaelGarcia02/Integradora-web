import React, { useEffect, useState } from "react";
import { useServiceOrders } from "../context/ServiceOrdersContext";

// Contenido principal
const ContentBlock = ({ title, icon, children }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
    <h3 className="text-md font-semibold text-gray-800 p-4 border-b flex items-center gap-3">
      <i className={`fas ${icon} w-5 text-center text-[#0159B3]`}></i>
      {title}
    </h3>
    <div className="p-4">{children}</div>
  </div>
);

// Bloque de información
const InfoBlock = ({ title, icon, children }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
    <h3 className="text-sm font-semibold text-gray-700 p-3 border-b flex items-center gap-2">
      <i className={`fas ${icon} w-4 text-center text-gray-400`}></i>
      {title}
    </h3>
    <div className="p-3 space-y-2">{children}</div>
  </div>
);

// Fila de datos
const InfoRow = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
    <p className="text-sm font-semibold text-gray-800">{value}</p>
  </div>
);

// Componente Principal

const OrderDetailView = ({ orderId }) => {
  const { getServiceOrder } = useServiceOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchOrder = async () => {
      try {
        const data = await getServiceOrder(orderId);
        setOrder(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId, getServiceOrder]);

  if (loading) return <p className="text-center p-8">Cargando detalles...</p>;
  if (!order)
    return (
      <p className="text-center p-8 text-red-500">Error al cargar la orden.</p>
    );

  // --- Formateo de datos para mostrar ---
  const scheduledDate = new Date(order.scheduled_date).toLocaleDateString(
    "es-MX",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
  const price = `$${parseFloat(order.price).toFixed(2)}`;
  const statusColor =
    order.state_ === "Pendiente"
      ? "bg-yellow-100 text-yellow-800"
      : order.state_ === "Completada"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-gray-50 p-4">
      {/* Columna Izquierda */}
      <div className="flex-1 space-y-6">
        <ContentBlock title="Actividades Realizadas" icon="fa-tasks">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {order.activities}
          </p>
        </ContentBlock>

        <ContentBlock title="Recomendaciones" icon="fa-comment-alt">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {order.recomendations}
          </p>
        </ContentBlock>

        <ContentBlock title="Materiales Utilizados" icon="fa-box-open">
          {order.products && order.products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      Producto
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Cantidad
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      Unidad
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.products.map((prod) => (
                    <tr key={prod.product_id}>
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {prod.product_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 font-semibold text-right">
                        {prod.quantity_used}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 text-right">
                        {prod.product_unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No se asignaron productos a esta orden.
            </p>
          )}
        </ContentBlock>
      </div>

      {/* Columna derecha */}
      <div className="w-full md:w-72 lg:w-80 space-y-4">
        <InfoBlock title="Estado" icon="fa-flag">
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}
          >
            {order.state_}
          </span>
        </InfoBlock>

        <InfoBlock title="Detalles del Servicio" icon="fa-info-circle">
          <InfoRow label="Cliente" value={order.client_name} />
          <InfoRow label="Servicio" value={order.service_name} />
          <div className="mt-3 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 uppercase font-medium mb-2">
              Personal Asignado
            </p>
            {order.personal && order.personal.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {order.personal.map((p) => (
                  <span
                    key={p.id_personal}
                    className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {p.full_name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Sin Asignar</p>
            )}
          </div>
        </InfoBlock>

        <InfoBlock title="Horario y Precio" icon="fa-calendar-alt">
          <InfoRow label="Fecha" value={scheduledDate} />
          <InfoRow label="Inicio" value={order.start_time} />
          <InfoRow label="Fin" value={order.end_time} />
          <InfoRow label="Precio" value={price} />
        </InfoBlock>

        <InfoBlock title="Contacto" icon="fa-user">
          <InfoRow label="Nombre" value={order.contact_name} />
          <InfoRow label="Teléfono" value={order.contact_phone} />
          <InfoRow label="Email" value={order.contact_email} />
        </InfoBlock>
      </div>
    </div>
  );
};

export default OrderDetailView;
