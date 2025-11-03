import React, { useEffect } from "react";
import TablaInfo from "../components/TablaInfo";
import BotonModal from "../components/Buttons/BotonModal";
import FormularioProveedores from "../components/Forms/FormularioProveedores";
import { useSuppliers } from "../context/SuppliersContext";

const SuppliersPage = () => {
  const { suppliers, getSuppliers, deleteSupplier } = useSuppliers();
  const columnNames = [
    "id_supplier",
    "trade_name",
    "contact_name",
    "email",
    "contact_cell_phone",
  ];

  useEffect(() => {
    getSuppliers();
  }, []);

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl shadow-sm">
      {/* --- Título --- */}
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-truck text-[#0159B3] text-xl"></i>
        <h2 className="text-2xl font-bold text-gray-800">Proveedores</h2>
      </div>

      <hr className="mb-6 border-gray-300" />

      {/* --- Encabezado con botones --- */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-6">
        <div>
          <BotonModal
            nombreBoton="Nuevo Proveedor"
            icono="fas fa-plus"
            contenidoModal={<FormularioProveedores />}
            titulo="Agregar Proveedor"
          />
        </div>
      </div>

      {/* --- Tabla --- */}
      <TablaInfo
        columns={columnNames}
        data={suppliers}
        totalRecords={suppliers.length}
        fetchElemento={getSuppliers}
        hiddenColumns={["id_supplier"]}
        customColumnNames={{
          trade_name: "Empresa",
          contact_name: "Contacto",
          email: "Correo",
          contact_cell_phone: "Teléfono",
        }}
        formType="suppliers"
        onDelete={deleteSupplier}
      />
    </div>
  );
};

export default SuppliersPage;
