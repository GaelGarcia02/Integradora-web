import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useCategories } from "../../context/CategoriesContext";

const validationSchema = Yup.object().shape({
  name_: Yup.string().required("Este campo es obligatorio"),
});

const emptyValues = {
  name_: "",
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

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (id_category) {
        try {
          const categoryData = await getCategory(id_category);
          console.log("Datos de la categoría obtenidos:", categoryData);
          if (categoryData) reset(categoryData);
        } catch (error) {
          console.error("Error al cargar la categoría:", error);
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
      Swal.fire({
        icon: "error",
        title: "Error al guardar los datos",
        showConfirmButton: false,
        timer: 1500,
      });
      console.error("Error al guardar los datos", error);
    }
  };

  // --- Clases reutilizables ---
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
        </section>

        {/* 🔹 Botón */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="w-full bg-[#0159B3] text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid || !isDirty}
          >
            {id_category ? "Actualizar Categoría" : "Registrar Categoría"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioCategorias;
