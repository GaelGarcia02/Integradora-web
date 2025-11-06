import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useCategories } from "../../context/CategoriesContext";

// ✅ Esquema de validación
const validationSchema = Yup.object().shape({
  name_: Yup.string().required("Este campo es obligatorio"),
  unit: Yup.string().required("Seleccione una unidad"),
});

// ✅ Valores iniciales
const emptyValues = {
  name_: "",
  unit: "",
};

const FormularioCategorias = ({ id_category }) => {
  const { getCategory, createCategory, updateCategory } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: emptyValues,
    mode: "onTouched",
  });

  // 🔹 Cargar datos si se edita
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (id_category) {
        try {
          const categoryData = await getCategory(id_category);
          console.log("📦 Datos de la categoría obtenidos:", categoryData);
          if (categoryData) reset(categoryData);
        } catch (error) {
          console.error("❌ Error al cargar la categoría:", error);
          Swal.fire({
            icon: "error",
            title: "Error al cargar los datos de la categoría",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        reset(emptyValues);
      }
    };
    fetchCategoryData();
  }, [id_category, getCategory, reset]);

  // 🔹 Guardar categoría
  const onSubmit = async (data) => {
    try {
      if (id_category) {
        await updateCategory(id_category, data);
        Swal.fire({
          icon: "success",
          title: "Categoría actualizada correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await createCategory(data);
        Swal.fire({
          icon: "success",
          title: "Categoría registrada correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      reset(emptyValues);
    } catch (error) {
      console.error("❌ Error al guardar los datos", error);
      Swal.fire({
        icon: "error",
        title: "Error al guardar los datos",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // 🔹 Estilos reutilizables
  const label = "block text-sm font-semibold text-gray-700 mb-1";
  const baseInput =
    "w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2";
  const normalInput =
    "border-gray-300 focus:ring-[#0159B3] focus:border-[#0159B3]";
  const errorInput = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const errorText = "text-red-500 text-sm mt-1";

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 mt-2 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-[#0159B3] mb-4">
        {id_category ? "Editar Categoría" : "Registrar Categoría"}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Complete el formulario | (*) Campos obligatorios
      </p>
      <hr className="mb-6 border-gray-300" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 🔹 Información básica */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Información de la categoría
          </h3>

          {/* Nombre */}
          <div>
            <label htmlFor="name_" className={label}>
              Nombre de la categoría *
            </label>
            <input
              id="name_"
              {...register("name_")}
              className={`${baseInput} ${
                errors.name_ ? errorInput : normalInput
              }`}
            />
            {errors.name_ && (
              <p className={errorText}>{errors.name_.message}</p>
            )}
          </div>

          {/* Unidad */}
          <div className="mt-4">
            <label htmlFor="unit" className={label}>
              Unidad asociada *
            </label>
            <select
              id="unit"
              {...register("unit")}
              className={`${baseInput} ${
                errors.unit ? errorInput : normalInput
              }`}
            >
              <option value="">Seleccione una unidad</option>
              <option value="pieza">Pieza</option>
              <option value="metro">Metro</option>
              <option value="rollo">Rollo</option>
              <option value="paquete">Paquete</option>
              <option value="caja">Caja</option>
              <option value="set">Set</option>
              <option value="kit">Kit</option>
            </select>
            {errors.unit && <p className={errorText}>{errors.unit.message}</p>}
          </div>
        </section>

        {/* 🔹 Botones */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-[#0159B3] text-white rounded-lg shadow-md hover:bg-[#01447a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid || !isDirty}
          >
            <i className="fas fa-save mr-2"></i>
            Guardar
          </button>

          <button
            type="button"
            onClick={() => reset(emptyValues)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-200"
          >
            <i className="fas fa-eraser mr-2"></i>
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioCategorias;