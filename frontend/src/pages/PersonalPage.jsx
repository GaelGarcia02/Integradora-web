import React, { useEffect } from "react";
import TablaInfo from "../components/TablaInfo";
import BotonModal from "../components/Buttons/BotonModal";
import FormularioPersonal from "../components/Forms/FormularioPersonal";
import Header from "../components/Header";
import { usePersonal } from "../context/PersonalContext";
import BotonPDF from "../components/Buttons/BotonPDF";

const PersonalPage = () => {
  const { personalRole, getPersonalRole } = usePersonal();
  const columnNames = ["name_", "last_name", "cell_number", "name_role"];

  useEffect(() => {
    getPersonalRole();
  }, []);

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl shadow-sm">
      {/* --- Título --- */}
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-users text-[#0159B3] text-xl"></i>
        <h2 className="text-2xl font-bold text-gray-800">Personal</h2>
      </div>

      <hr className="mb-6 border-gray-300" />

      {/* --- Encabezado con botones --- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <BotonModal
            nombreBoton="Nuevo Personal"
            icono="fas fa-plus"
            contenidoModal={<FormularioPersonal />}
            titulo="Agregar Nuevo Personal"
          />
        </div>
        <div>
          <BotonPDF
            pageTitle={"Personal"}
            columns={{
              name_: "Nombre",
              last_name: "Apellido",
              cell_number: "Celular",
              name_role: "Rol",
            }}
            data={personalRole}
          />
        </div>
      </div>

      {/* --- Tabla --- */}
      <TablaInfo
        columns={columnNames}
        data={personalRole}
        totalRecords={personalRole.length}
        hiddenColumns={["role_id"]}
        customColumnNames={{
          name_: "Nombre",
          last_name: "Apellido",
          cell_number: "Celular",
          name_role: "Rol",
        }}
        formType="personal"
      />
    </div>
  );
};

export default PersonalPage;
