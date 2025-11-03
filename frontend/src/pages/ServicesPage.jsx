import React, { useEffect } from "react";
import { useServices } from "../context/ServicesContext";
import TablaInfo from "../components/TablaInfo";
import BotonModal from "../components/Buttons/BotonModal";
import FormularioServicio from "../components/Forms/FormularioServicios";

const ServicesPage = () => {
  const { services, getServices } = useServices();
  const columnNames = ["id", "name_", "sale_price"];

  useEffect(() => {
    getServices();
  }, []);

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl shadow-sm">
      {/* --- Título --- */}
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-tools text-[#0159B3] text-xl"></i>
        <h2 className="text-2xl font-bold text-gray-800">Servicios</h2>
      </div>

      <hr className="mb-6 border-gray-300" />

      {/* --- Encabezado con botones --- */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-6">
        <div>
          <BotonModal
            nombreBoton="Nuevo Servicio"
            icono="fas fa-plus"
            contenidoModal={<FormularioServicio />}
            titulo="Agregar Servicio"
          />
        </div>
      </div>

      {/* --- Tabla --- */}
      <TablaInfo
        columns={columnNames}
        data={services}
        totalRecords={services.length}
        fetchElemento={getServices}
        hiddenColumns={["id"]}
        customColumnNames={{
          name_: "Nombre",
          sale_price: "Precio",
        }}
        formType="services"
      />
    </div>
  );
};

export default ServicesPage;
