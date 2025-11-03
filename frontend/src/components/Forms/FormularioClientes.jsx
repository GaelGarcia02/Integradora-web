import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useClients } from "../../context/ClientsContext";

// Agregar esquema de validación
const validationSchema = Yup.object().shape({
  trade_name: Yup.string().required("Este campo es obligatorio"),
  business_type: Yup.string().required("Este campo es obligatorio"),
  phone_or_cell: Yup.string().required("Este campo es obligatorio"),
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("Este campo es obligatorio"),
  street: Yup.string().required("Este campo es obligatorio"),
  number_: Yup.string().required("Este campo es obligatorio"),
  neighborhood: Yup.string(),
  postal_code: Yup.string(),
  city: Yup.string().required("Este campo es obligatorio"),
  country: Yup.string().required("Este campo es obligatorio"),
  state_: Yup.string().required("Este campo es obligatorio"),
  contact_name: Yup.string().required("Este campo es obligatorio"),
  contact_cell_phone: Yup.string().required("Este campo es obligatorio"),
  contact_email: Yup.string()
    .email("Correo electrónico inválido")
    .required("Este campo es obligatorio"),
});

const FormularioClientes = ({ id_client }) => {
  const { getClient, createClient, updateClient } = useClients();

  const emptyValues = {
    trade_name: "",
    business_type: "Por Definir",
    phone_or_cell: "",
    email: "",
    street: "",
    number_: "",
    neighborhood: "",
    postal_code: "",
    city: "",
    country: "",
    state_: "",
    contact_name: "",
    contact_cell_phone: "",
    contact_email: "",
  };

  // --- Clases reutilizables ---
  const label = "block text-sm font-semibold text-gray-700 mb-1";
  const baseInput =
    "w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2";
  const normalInput =
    "border-gray-300 focus:ring-[#0159B3] focus:border-[#0159B3]";
  const errorInput = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const errorText = "text-red-500 text-sm mt-1";

  const [initialValues, setInitialValues] = useState(emptyValues);

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

  // Efecto para cargar los datos del cliente cuando se edita
  useEffect(() => {
    const fetchClientData = async () => {
      if (id_client) {
        try {
          const clientData = await getClient(id_client);
          if (clientData) {
            // Reiniciar el formulario con los datos del cliente
            reset(clientData);
          }
        } catch (error) {
          console.error("Error al obtener datos del cliente:", error);
          Swal.fire({
            icon: "error",
            title: "Error al cargar los datos del cliente",
            text: "No se pudieron obtener los datos del cliente",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } else {
        // Si no hay ID, reiniciar con valores vacíos
        reset(emptyValues);
      }
    };

    fetchClientData();
  }, [id_client, getClient, reset]);

  const onSubmit = async (data) => {
    try {
      if (id_client) {
        await updateClient(id_client, data);
        Swal.fire({
          icon: "success",
          title: "Cliente actualizado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await createClient(data);
        Swal.fire({
          icon: "success",
          title: "Cliente registrado correctamente",
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
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 mt-2 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-[#0159B3] mb-4">
        {id_client ? "Editar Cliente" : "Registrar Cliente"}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Complete el formulario | (*) Campos obligatorios
      </p>
      <hr className="mb-6 border-gray-300" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Información del cliente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="trade_name" className={label}>
                Nombre Comercial *
              </label>
              <input
                type="text"
                id="trade_name"
                {...register("trade_name", {
                  required: "Este campo es obligatorio",
                })}
                className={`${baseInput} ${
                  errors.trade_name ? errorInput : normalInput
                }`}
              />
              {errors.trade_name && (
                <p className={errorText}>{errors.trade_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="business_type" className={label}>
                Giro *
              </label>
              <select
                id="business_type"
                {...register("business_type", {
                  required: "Este campo es obligatorio",
                })}
                className={`${baseInput} ${
                  errors.business_type ? errorInput : normalInput
                }`}
              >
                <option value="Por Definir">-- Por definir --</option>
                <option value="Comercial">Comercial</option>
                <option value="Equipo Medico">Equipo Médico</option>
                <option value="Industrial">Industrial</option>
                <option value="Restaurantero">Restaurantero</option>
                <option value="Servicios">Servicios</option>
              </select>
            </div>
          </div>
        </section>

        {/* 🔹 Contacto */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone_or_cell" className={label}>
                Teléfono/Celular *
              </label>
              <input
                type="tel"
                id="phone_or_cell"
                {...register("phone_or_cell", {
                  required: "Este campo es obligatorio",
                })}
                className={`${baseInput} ${
                  errors.phone_or_cell ? errorInput : normalInput
                }`}
              />
              {errors.phone_or_cell && (
                <p className={errorText}>{errors.phone_or_cell.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className={label}>
                Correo *
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Este campo es obligatorio",
                  pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" },
                })}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="street" className={label}>
                Calle *
              </label>
              <input
                type="text"
                id="street"
                {...register("street", {
                  required: "Este campo es obligatorio",
                })}
                className={`${baseInput} ${
                  errors.street ? errorInput : normalInput
                }`}
              />
              {errors.street && (
                <p className={errorText}>{errors.street.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="number_" className={label}>
                Número *
              </label>
              <input
                type="text"
                id="number_"
                {...register("number_", {
                  required: "Este campo es obligatorio",
                })}
                className={`${baseInput} ${
                  errors.number_ ? errorInput : normalInput
                }`}
              />
              {errors.number_ && (
                <p className={errorText}>{errors.number_.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="neighborhood" className={label}>
                Colonia
              </label>
              <input
                type="text"
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
                type="text"
                id="postal_code"
                {...register("postal_code")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className={label}>
                Ciudad *
              </label>
              <input
                type="text"
                id="city"
                {...register("city", {
                  required: "Este campo es obligatorio",
                })}
                className={`${baseInput} ${
                  errors.city ? errorInput : normalInput
                }`}
              />
              {errors.city && (
                <p className={errorText}>{errors.city.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="country" className={label}>
                País *
              </label>
              <input
                type="text"
                id="country"
                {...register("country", {
                  required: "Este campo es obligatorio",
                })}
                className={`${baseInput} ${
                  errors.country ? errorInput : normalInput
                }`}
              />
              {errors.country && (
                <p className={errorText}>{errors.country.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="state_" className={label}>
                Estado *
              </label>
              <input
                type="text"
                id="state_"
                {...register("state_", {
                  required: "Este campo es obligatorio",
                })}
                className={`${baseInput} ${
                  errors.state_ ? errorInput : normalInput
                }`}
              />
              {errors.state_ && (
                <p className={errorText}>{errors.state_.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* 🔹 Información de Contacto */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Información de Contacto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact_name" className={label}>
                Nombre de Contacto *
              </label>
              <input
                type="text"
                id="contact_name"
                {...register("contact_name", {
                  required: "Este campo es obligatorio",
                })}
                className={`${baseInput} ${
                  errors.contact_name ? errorInput : normalInput
                }`}
              />
              {errors.contact_name && (
                <p className={errorText}>{errors.contact_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contact_cell_phone" className={label}>
                Celular de Contacto *
              </label>
              <input
                type="tel"
                id="contact_cell_phone"
                {...register("contact_cell_phone", {
                  required: "Este campo es obligatorio",
                })}
                className={`${baseInput} ${
                  errors.contact_cell_phone ? errorInput : normalInput
                }`}
              />
              {errors.contact_cell_phone && (
                <p className={errorText}>{errors.contact_cell_phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contact_email" className={label}>
                Correo de Contacto *
              </label>
              <input
                type="email"
                id="contact_email"
                {...register("contact_email", {
                  required: "Este campo es obligatorio",
                  pattern: { value: /^\S+@\S+$/i, message: "Correo inválido" },
                })}
                className={`${baseInput} ${
                  errors.contact_email ? errorInput : normalInput
                }`}
              />
              {errors.contact_email && (
                <p className={errorText}>{errors.contact_email.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* 🔹 Botón */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="w-full bg-[#0159B3] text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid || !isDirty}
          >
            {id_client ? "Actualizar Cliente" : "Registrar Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioClientes;
