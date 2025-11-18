import React, { useCallback, useState, useEffect } from "react";
import Swal from "sweetalert2";

// Botones
import BotonEditarModal from "./Buttons/BotonEditarModal";
import BotonUrl from "./Buttons/BotonUrl";

//Formularios
import FormularioPersonal from "./Forms/FormularioPersonal";
import FormularioClientes from "./Forms/FormularioClientes";
import FormularioProveedores from "./Forms/FormularioProveedores";
import FormularioContactos from "./Forms/FormularioContactos";
import FormularioCategorias from "./Forms/FormularioCategorias";
import FormularioServicios from "./Forms/FormularioServicios";

const TablaInfo = ({
  columns,
  data,
  totalRecords,
  hiddenColumns = [],
  customColumnNames = {},
  formType,
  rowsPerPage = 5,
  specialPages = false,
  baseUrl = "",
  onDelete, // Add this new prop
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState(
    columns.find((col) => !hiddenColumns.includes(col))
  );
  const [sortDirection, setSortDirection] = useState("desc");

  // Actualiza datos filtrados al cambiar el data
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // Filtro de busqueda
  useEffect(() => {
    let filtered = data;

    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = data.filter((row) => {
        // Buscar en todas las columnas visibles
        return columns
          .filter((col) => !hiddenColumns.includes(col))
          .some((col) => {
            const value = row[col];
            // Verificar si el valor existe y convertirlo a string
            return (
              value && value.toString().toLowerCase().includes(lowerSearch)
            );
          });
      });
    }

    // Ordenar según columna seleccionada
    filtered = [...filtered].sort((a, b) => {
      const valA = a[sortColumn]?.toString().toLowerCase() || "";
      const valB = b[sortColumn]?.toString().toLowerCase() || "";
      if (valA < valB) return sortDirection === "asc" ? 1 : -1;
      if (valA > valB) return sortDirection === "asc" ? -1 : 1;
      return 0;
    });

    setFilteredData(filtered);
  }, [searchTerm, data, sortColumn, sortDirection, columns, hiddenColumns]);

  // Paginación
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleSortChange = (column) => {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed && onDelete) {
        await onDelete(id);
        Swal.fire("Eliminado", "El registro ha sido eliminado.", "success");
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      Swal.fire("Error", "No se pudo eliminar el registro.", "error");
    }
  };

  // Obtiene el componente de formulario correspondiente
  const obtenerComponenteFormulario = useCallback((formType, id) => {
    console.log("Form type:", formType, "ID:", id);
    switch (formType) {
      case "personal":
        return <FormularioPersonal id_personal={id} />;
      case "clients":
        return <FormularioClientes id_client={id} />;
      case "suppliers":
        return <FormularioProveedores id_supplier={id} />;
      case "contacts":
        return <FormularioContactos id_contact={id} />;
      case "categories":
        return <FormularioCategorias id_category={id} />;
      case "services":
        return <FormularioServicios id_service={id} />;
      default:
        return null;
    }
  }, []);

  const obtenerIdParaFormulario = useCallback(
    (formType, row) => {
      switch (formType) {
        case "personal":
          return row.id_personal;
        case "clients":
          return row.id_client;
        case "suppliers":
          return row.id_supplier;
        case "contacts":
          return row.id_contact;
        case "categories":
          return row.id_category;
        case "services":
          return row.id_service;
        default:
          return null;
      }
    },
    [formType]
  );

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-lg border border-gray-100">
      {/* Filtros y orden */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 bg-gray-50 border-b border-gray-200">
        {/* Buscador */}
        <div className="flex items-center w-full sm:w-auto gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar..."
            className="w-full sm:w-72 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#0159B3] focus:border-[#0159B3]"
          />
        </div>

        {/* Ordenador */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Ordenar por:</label>
          <select
            value={sortColumn}
            onChange={(e) => handleSortChange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-[#0159B3] focus:border-[#0159B3]"
          >
            {columns.map(
              (col) =>
                !hiddenColumns.includes(col) && (
                  <option key={col} value={col}>
                    {customColumnNames[col] || col}
                  </option>
                )
            )}
          </select>
          <button
            onClick={() =>
              setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="text-[#0159B3] text-sm font-semibold hover:underline"
          >
            <i
              className={`fas fa-arrow-${
                sortDirection === "asc" ? "up" : "down"
              }`}
            ></i>
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold tracking-wider">
            <tr>
              {columns.map(
                (col, i) =>
                  !hiddenColumns.includes(col) && (
                    <th key={i} className="px-6 py-3">
                      {customColumnNames[col] || col}
                    </th>
                  )
              )}
              <th className="px-6 py-3 text-center">Acción</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {columns.map(
                    (col, j) =>
                      !hiddenColumns.includes(col) && (
                        <td
                          key={j}
                          className="px-6 py-3 text-gray-700 text-center"
                        >
                          {row[col]}
                        </td>
                      )
                  )}
                  <td className="px-6 py-3">
                    <div className="flex justify-center gap-2">
                      {specialPages ? (
                        <BotonUrl
                          nombreBoton="Editar"
                          icono="fas fa-edit"
                          url={`${baseUrl}/${obtenerIdParaFormulario(
                            formType,
                            row
                          )}`}
                          className="bg-[#0159B3] hover:bg-[#014a94] text-white px-3 py-1 rounded-md text-sm shadow-sm transition"
                        />
                      ) : (
                        <>
                          <BotonEditarModal
                            nombreBoton="Editar"
                            icono="fas fa-edit"
                            contenidoModal={() =>
                              obtenerComponenteFormulario(
                                formType,
                                obtenerIdParaFormulario(formType, row)
                              )
                            }
                            className="bg-[#0159B3] hover:bg-[#014a94] text-white px-3 py-1 rounded-md text-sm shadow-sm transition"
                            titulo="Editar Información"
                          />
                          {onDelete && (
                            <button
                              onClick={() =>
                                handleDelete(
                                  obtenerIdParaFormulario(formType, row)
                                )
                              }
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm shadow-sm transition flex items-center gap-1 cursor-pointer"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-6 py-4 text-center text-gray-500 font-medium"
                >
                  Ningún dato disponible en esta tabla
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center border-t border-gray-200 px-4 py-3 bg-gray-50">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Anterior
        </button>

        <span className="text-sm text-gray-600">
          Página <strong>{currentPage}</strong> de {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default TablaInfo;
