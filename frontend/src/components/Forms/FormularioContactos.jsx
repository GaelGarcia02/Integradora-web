import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useContacts } from "../../context/ContactsContext";

const validationSchema = Yup.object().shape({
  name_: Yup.string().required("Este campo es obligatorio"),
  last_name: Yup.string().required("Este campo es obligatorio"),
  position: Yup.string().required("Este campo es obligatorio"),
  cell_number: Yup.string()
    .required("Este campo es obligatorio")
    .matches(/^[0-9]{10}$/, "Debe ser un número de 10 dígitos"),
  phone_number: Yup.string()
    .matches(/^[0-9]{10}$/, "Debe ser un número de 10 dígitos")
    .nullable(),
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("Este campo es obligatorio"),
});

const emptyValues = {
  name_: "",
  last_name: "",
  position: "",
  cell_number: "",
  phone_number: "",
  email: "",
  street: "",
  number_: "",
  neighborhood: "",
  country: "",
  state_: "",
  city: "",
  postal_code: "",
};

const FormularioContactos = ({ id_contact }) => {
  const { getContact, createContact, updateContact } = useContacts();

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
    const fetchContactData = async () => {
      if (id_contact) {
        try {
          const contactData = await getContact(id_contact);
          if (contactData) reset(contactData);
        } catch (error) {
          reset(emptyValues);
        }
      }
    };
    fetchContactData();
  }, [id_contact, getContact, reset]);

  const onSubmit = async (data) => {
    try {
      if (id_contact) {
        await updateContact(id_contact, data);
        Swal.fire({
          icon: "success",
          title: "Contacto actualizado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await createContact(data);
        Swal.fire({
          icon: "success",
          title: "Contacto registrado correctamente",
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
        {id_contact ? "Editar Contacto" : "Registrar Contacto"}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Complete el formulario | (*) Campos obligatorios
      </p>
      <hr className="mb-6 border-gray-300" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 🔹 Información básica */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Información personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name_" className={label}>
                Nombre *
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
              <label htmlFor="last_name" className={label}>
                Apellido *
              </label>
              <input
                id="last_name"
                {...register("last_name")}
                className={`${baseInput} ${
                  errors.last_name ? errorInput : normalInput
                }`}
              />
              {errors.last_name && (
                <p className={errorText}>{errors.last_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="position" className={label}>
                Cargo *
              </label>
              <input
                id="position"
                {...register("position")}
                className={`${baseInput} ${
                  errors.position ? errorInput : normalInput
                }`}
              />
              {errors.position && (
                <p className={errorText}>{errors.position.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* 🔹 Contacto */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Información de contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cell_number" className={label}>
                Celular *
              </label>
              <input
                id="cell_number"
                {...register("cell_number")}
                className={`${baseInput} ${
                  errors.cell_number ? errorInput : normalInput
                }`}
              />
              {errors.cell_number && (
                <p className={errorText}>{errors.cell_number.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone_number" className={label}>
                Teléfono
              </label>
              <input
                id="phone_number"
                {...register("phone_number")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>

            <div>
              <label htmlFor="email" className={label}>
                Correo electrónico *
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className={`${baseInput} ${
                  errors.email ? errorInput : normalInput
                }`}
              />
              {errors.email && (
                <p className={errorText}>{errors.email.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* 🔹 Dirección */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Dirección
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="street" className={label}>
                Calle
              </label>
              <input
                id="street"
                {...register("street")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>

            <div>
              <label htmlFor="number_" className={label}>
                Número
              </label>
              <input
                id="number_"
                {...register("number_")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>

            <div>
              <label htmlFor="neighborhood" className={label}>
                Colonia
              </label>
              <input
                id="neighborhood"
                {...register("neighborhood")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>

            <div>
              <label htmlFor="postal_code" className={label}>
                Código Postal
              </label>
              <input
                id="postal_code"
                {...register("postal_code")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>
          </div>
        </section>

        {/* 🔹 Ubicación */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Ubicación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="country" className={label}>
                País
              </label>
              <input
                id="country"
                {...register("country")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>

            <div>
              <label htmlFor="state_" className={label}>
                Estado
              </label>
              <input
                id="state_"
                {...register("state_")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>

            <div>
              <label htmlFor="city" className={label}>
                Ciudad
              </label>
              <input
                id="city"
                {...register("city")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>
          </div>
        </section>

        {/* 🔹 Botón */}
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

export default FormularioContactos;
