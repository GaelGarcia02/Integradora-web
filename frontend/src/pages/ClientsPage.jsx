import React, { useEffect } from "react";
import TablaInfo from "../components/TablaInfo";
import BotonModal from "../components/Buttons/BotonModal";
import FormularioClientes from "../components/Forms/FormularioClientes";
import { useClients } from "../context/ClientsContext";

const ClientsPage = () => {
  const { clients, getClients } = useClients();
  const columnNames = [
    "id_client",
    "trade_name",
    "city",
    "contact_name",
    "email",
    "phone_or_cell",
  ];

  useEffect(() => {
    getClients();
  }, []);

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl shadow-sm">
      {/* --- Título --- */}
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-user-friends text-[#0159B3] text-xl"></i>
        <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
      </div>

      <hr className="mb-6 border-gray-300" />

      {/* --- Encabezado con botones --- */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-6">
        <div>
          <BotonModal
            nombreBoton="Nuevo Cliente"
            icono="fas fa-plus"
            contenidoModal={<FormularioClientes />}
            titulo="Agregar Cliente"
          />
        </div>
      </div>

      {/* --- Tabla --- */}
      <TablaInfo
        columns={columnNames}
        data={clients}
        totalRecords={clients.length}
        hiddenColumns={["id_client"]}
        customColumnNames={{
          trade_name: "Nombre Comercial",
          city: "Ciudad",
          contact_name: "Nombre de Contacto",
          email: "Correo Electrónico",
          phone_or_cell: "Teléfono o Celular",
        }}
        formType="clients"
      />
    </div>
  );
};

export default ClientsPage;
