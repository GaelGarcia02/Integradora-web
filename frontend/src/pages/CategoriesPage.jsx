import React, { useEffect } from "react";
import TablaInfo from "../components/TablaInfo";
import BotonModal from "../components/Buttons/BotonModal";
import FormularioCategorias from "../components/Forms/FormularioCategorias";
import { useCategories } from "../context/CategoriesContext.jsx";

const CategoriesPage = () => {
  const { categories, getCategories } = useCategories();
  const columnNames = ["id_category", "name_"];

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl shadow-sm">
      {/* --- Título --- */}
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-list text-[#0159B3] text-xl"></i>
        <h2 className="text-2xl font-bold text-gray-800">Categorías</h2>
      </div>

      <hr className="mb-6 border-gray-300" />

      {/* --- Encabezado con botones --- */}
      <div className="flex flex-col sm:flex-row sm:items-center mb-6">
        <div>
          <BotonModal
            nombreBoton="Nueva Categoría"
            icono="fas fa-plus"
            contenidoModal={<FormularioCategorias />}
            titulo="Agregar Categoría"
          />
        </div>
      </div>

      {/* --- Tabla --- */}
      <TablaInfo
        columns={columnNames}
        data={categories}
        totalRecords={categories.length}
        hiddenColumns={["id_category"]}
        customColumnNames={{
          name_: "Nombre",
        }}
        formType="categories"
      />
    </div>
  );
};

export default CategoriesPage;
