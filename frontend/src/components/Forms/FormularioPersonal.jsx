import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { usePersonal } from "../../context/PersonalContext";
import { useRoles } from "../../context/RolesContext";

// Esquema de validación (Contraseña opcional al editar)
const validationSchema = Yup.object().shape({
  name_: Yup.string().required("Este campo es obligatorio"),
  last_name: Yup.string().required("Este campo es obligatorio"),
  role_id: Yup.number()
    .typeError("Seleccione un rol")
    .required("Seleccione un rol")
    .integer("Debe ser un número entero"),
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("Este campo es obligatorio"),
  cell_number: Yup.string().required("Este campo es obligatorio"),
  country: Yup.string().required("Este campo es obligatorio"),
  state_: Yup.string().required("Este campo es obligatorio"),
  city: Yup.string().required("Este campo es obligatorio"),
  phone: Yup.string().nullable(),
  address_: Yup.string().required("Este campo es obligatorio"),

  password_: Yup.string().min(6, "Debe tener al menos 6 caracteres").nullable(),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password_"), null], "Las contraseñas deben coincidir")
    .when("password_", ([password_], schema) => {
      return password_ && password_.length > 0
        ? schema.required("Debe confirmar la contraseña")
        : schema;
    }),
});

const emptyValues = {
  name_: "",
  last_name: "",
  role_id: "",
  email: "",
  cell_number: "",
  country: "",
  state_: "",
  city: "",
  phone: "",
  address_: "",
  password_: "",
  confirmPassword: "",
};

const FormularioPersonal = ({ id_personal, onClose, onSuccess }) => {
  const { getPersonal, createPersonal, updatePersonal } = usePersonal();
  const { roles, getRoles } = useRoles();
  const isEditing = !!id_personal;

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
    getRoles();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (isEditing) {
        try {
          const data = await getPersonal(id_personal);
          if (data) {
            data.password_ = "";
            reset(data);
          }
        } catch (error) {
          console.error("Error al cargar datos del personal", error);
        }
      } else {
        reset(emptyValues);
      }
    };
    fetchData();
  }, [id_personal, getPersonal, reset, isEditing]);

  const onSubmit = async (data) => {
    try {
      delete data.confirmPassword;

      if (isEditing) {
        if (!data.password_) delete data.password_;
        await updatePersonal(id_personal, data);

        Swal.fire({
          icon: "success",
          title: "Personal actualizado",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        if (!data.password_) {
          throw new Error(
            "La contraseña es obligatoria para registrar nuevo personal."
          );
        }

        await createPersonal(data);

        Swal.fire({
          icon: "success",
          title: "Personal registrado",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      onSuccess?.();
      onClose?.();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar los datos",
        text:
          error?.response?.data?.message ||
          error.message ||
          "Intente nuevamente",
        showConfirmButton: false,
        timer: 2000,
      });
      console.error("Error al guardar los datos", error);
    }
  };

  // Clases reutilizables
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
        {isEditing ? "Editar Personal" : "Registrar Personal"}
      </h2>

      <p className="text-gray-500 text-sm mb-6">
        Complete el formulario | (*) Campos obligatorios
      </p>

      <hr className="mb-6 border-gray-300" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información personal */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Información personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
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

            {/* Apellido */}
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

            {/* Rol */}
            <div>
              <label htmlFor="role_id" className={label}>
                Rol *
              </label>
              <select
                id="role_id"
                {...register("role_id")}
                className={`${baseInput} ${
                  errors.role_id ? errorInput : normalInput
                }`}
              >
                <option value="">-- Seleccione un rol --</option>
                {roles.map((rol) => (
                  <option key={rol.id_role} value={rol.id_role}>
                    {rol.name_role}
                  </option>
                ))}
              </select>
              {errors.role_id && (
                <p className={errorText}>{errors.role_id.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
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

            {/* Celular */}
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

            {/* Teléfono */}
            <div>
              <label htmlFor="phone" className={label}>
                Teléfono
              </label>
              <input
                id="phone"
                {...register("phone")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor="address_" className={label}>
                Dirección *
              </label>
              <textarea
                id="address_"
                {...register("address_")}
                rows="2"
                className={`${baseInput} ${
                  errors.address_ ? errorInput : normalInput
                }`}
              />
              {errors.address_ && (
                <p className={errorText}>{errors.address_.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Ubicación */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Ubicación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="country" className={label}>
                País *
              </label>
              <input
                id="country"
                {...register("country")}
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
                id="state_"
                {...register("state_")}
                className={`${baseInput} ${
                  errors.state_ ? errorInput : normalInput
                }`}
              />
              {errors.state_ && (
                <p className={errorText}>{errors.state_.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="city" className={label}>
                Ciudad *
              </label>
              <input
                id="city"
                {...register("city")}
                className={`${baseInput} ${
                  errors.city ? errorInput : normalInput
                }`}
              />
              {errors.city && (
                <p className={errorText}>{errors.city.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Seguridad */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Seguridad
          </h3>

          <p className="text-sm text-gray-500 mb-3">
            {isEditing
              ? "Deje los campos en blanco si no desea cambiar la contraseña."
              : "Ingrese la contraseña para el nuevo usuario."}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label htmlFor="password_" className={label}>
                Contraseña {isEditing ? "(Opcional)" : "*"}
              </label>
              <input
                type="password"
                id="password_"
                {...register("password_")}
                autoComplete="new-password"
                className={`${baseInput} ${
                  errors.password_ ? errorInput : normalInput
                }`}
              />
              {errors.password_ && (
                <p className={errorText}>{errors.password_.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label htmlFor="confirmPassword" className={label}>
                Confirmar contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
                className={`${baseInput} ${
                  errors.confirmPassword ? errorInput : normalInput
                }`}
              />
              {errors.confirmPassword && (
                <p className={errorText}>{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => reset(emptyValues)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition-all duration-200"
          >
            <i className="fas fa-eraser mr-2"></i>
            Limpiar
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-[#0159B3] text-white rounded-lg shadow-md hover:bg-[#01447a] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid || (!isDirty && isEditing)}
          >
            <i className="fas fa-save mr-2"></i>
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioPersonal;
