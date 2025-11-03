import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useServices } from "../../context/ServicesContext";
import { useCategories } from "../../context/CategoriesContext";

const validationSchema = Yup.object().shape({
  name_: Yup.string().required("Este campo es obligatorio"),
  category_id: Yup.number()
    .typeError("Seleccione una categoría")
    .required("Este campo es obligatorio"),
  sale_price: Yup.number()
    .typeError("Debe ser un número")
    .required("Este campo es obligatorio")
    .positive("El precio debe ser positivo"),
  description_: Yup.string().required("Este campo es obligatorio"),
  sat_unit: Yup.string(),
  sat_code: Yup.string(),
});

const emptyValues = {
  name_: "",
  category_id: "",
  sale_price: "",
  description_: "",
  sat_unit: "",
  sat_code: "",
};

const FormularioServicio = ({ id_service }) => {
  const { getService, createService, updateService } = useServices();
  const { categories } = useCategories();

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
    const fetchServiceData = async () => {
      if (id_service) {
        try {
          const serviceData = await getService(id_service);
          if (serviceData) reset(serviceData);
        } catch (error) {
          console.error("Error al cargar el servicio:", error);
          Swal.fire({
            icon: "error",
            title: "Error al cargar los datos del servicio",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        reset(emptyValues);
      }
    };
    fetchServiceData();
  }, [id_service, getService, reset]);

  const onSubmit = async (data) => {
    try {
      if (id_service) {
        await updateService(id_service, data);
        Swal.fire({
          icon: "success",
          title: "Servicio actualizado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await createService(data);
        Swal.fire({
          icon: "success",
          title: "Servicio registrado correctamente",
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
        {id_service ? "Editar Servicio" : "Registrar Servicio"}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Complete el formulario | (*) Campos obligatorios
      </p>
      <hr className="mb-6 border-gray-300" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 🔹 Información básica */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Información del servicio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name_" className={label}>
                Nombre del servicio *
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
            <div>
              <label htmlFor="category_id" className={label}>
                Categoría *
              </label>
              <select
                id="category_id"
                {...register("category_id")}
                className={`${baseInput} ${
                  errors.category_id ? errorInput : normalInput
                }`}
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((category) => (
                  <option
                    key={category.id_category}
                    value={category.id_category}
                  >
                    {category.name_}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className={errorText}>{errors.category_id.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* 🔹 Precio y descripción */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sale_price" className={label}>
                Precio de venta $ *
              </label>
              <input
                id="sale_price"
                type="number"
                {...register("sale_price")}
                className={`${baseInput} ${
                  errors.sale_price ? errorInput : normalInput
                }`}
              />
              {errors.sale_price && (
                <p className={errorText}>{errors.sale_price.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="description_" className={label}>
                Descripción *
              </label>
              <textarea
                id="description_"
                {...register("description_")}
                className={`${baseInput} ${
                  errors.description_ ? errorInput : normalInput
                }`}
                rows="2"
              ></textarea>
              {errors.description_ && (
                <p className={errorText}>{errors.description_.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* 🔹 Información adicional */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Información adicional
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sat_unit" className={label}>
                Unidad SAT
              </label>
              <input
                id="sat_unit"
                {...register("sat_unit")}
                className={`${baseInput} ${
                  errors.sat_unit ? errorInput : normalInput
                }`}
              />
            </div>
            <div>
              <label htmlFor="sat_code" className={label}>
                Código SAT
              </label>
              <input
                id="sat_code"
                {...register("sat_code")}
                className={`${baseInput} ${
                  errors.sat_code ? errorInput : normalInput
                }`}
              />
            </div>
          </div>
        </section>

        <hr className="my-6 border-gray-300" />

        <div className="flex justify-end gap-4">
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

export default FormularioServicio;
