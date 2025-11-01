import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useSuppliers } from "../../context/SuppliersContext";

const validationSchema = Yup.object().shape({
  trade_name: Yup.string().required("Nombre Comercial es obligatorio"),
  business_type: Yup.string().required("Giro es obligatorio"),
  cell_number: Yup.string().required("Teléfono/Celular es obligatorio"),
  email: Yup.string().email("Correo inválido").required("Correo es requerido"),
  country: Yup.string().required("País es obligatorio"),
  state_: Yup.string().required("Estado es obligatorio"),
  address_: Yup.string(),
  city: Yup.string().required("Ciudad es obligatoria"),
  postal_code: Yup.string(),
  website: Yup.string(),
  billing_name: Yup.string(),
  billing_number: Yup.string(),
  billing_address: Yup.string(),
  notes: Yup.string(),
  contact_name: Yup.string().required("Nombre de Contacto es obligatorio"),
  contact_area_or_position: Yup.string(),
  contact_cell_phone: Yup.string().required(
    "Celular de Contacto es obligatorio"
  ),
  contact_email: Yup.string()
    .email("Correo de Contacto inválido")
    .required("Correo de Contacto es obligatorio"),
});

const emptyValues = {
  trade_name: "",
  business_type: "Por Definir",
  cell_number: "",
  email: "",
  country: "",
  state_: "",
  address_: "",
  city: "",
  postal_code: "",
  website: "",
  billing_name: "",
  billing_number: "",
  billing_address: "",
  contact_name: "",
  contact_area_or_position: "",
  contact_cell_phone: "",
  contact_email: "",
};

const FormularioProveedores = ({ id_supplier }) => {
  const { getSupplier, createSupplier, updateSupplier } = useSuppliers();

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
    const fetchSupplierData = async () => {
      if (id_supplier) {
        const supplierData = await getSupplier(id_supplier);
        if (supplierData) reset(supplierData);
      } else {
        console.log("ne");
        reset(emptyValues);
      }
    };
    fetchSupplierData();
  }, [id_supplier, getSupplier, reset]);

  const onSubmit = async (data) => {
    try {
      if (id_supplier) {
        await updateSupplier(id_supplier, data);
        console.log(data);
        Swal.fire({
          icon: "success",
          title: "Proveedor actualizado",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await createSupplier(data);
        Swal.fire({
          icon: "success",
          title: "Proveedor creado",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      reset(emptyValues);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar el proveedor",
        showConfirmButton: false,
        timer: 1500,
      });
      console.error(error);
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
        {id_supplier ? "Editar Proveedor" : "Registrar Proveedor"}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Complete el formulario | (*) Campos obligatorios
      </p>
      <hr className="mb-6 border-gray-300" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Información general
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="trade_name" className={label}>
                Nombre Comercial *
              </label>
              <input
                id="trade_name"
                {...register("trade_name")}
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
                {...register("business_type")}
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
              {errors.business_type && (
                <p className={errorText}>{errors.business_type.message}</p>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cell_number" className={label}>
                Teléfono/Celular *
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
              <label htmlFor="email" className={label}>
                Correo *
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

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Dirección
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="md:col-span-2">
              <label htmlFor="address_" className={label}>
                Dirección
              </label>
              <textarea
                id="address_"
                {...register("address_")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Otros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="website" className={label}>
                Página/Portal Web
              </label>
              <input
                id="website"
                {...register("website")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>

            <div>
              <label htmlFor="billing_name" className={label}>
                Nombre de Facturación
              </label>
              <input
                id="billing_name"
                {...register("billing_name")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>

            <div>
              <label htmlFor="billing_number" className={label}>
                RFC de Facturación
              </label>
              <input
                id="billing_number"
                {...register("billing_number")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>
            <div>
              <label htmlFor="billing_address" className={label}>
                Direccion de Facturación
              </label>
              <input
                id="billing_address"
                {...register("billing_address")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Contacto principal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact_name" className={label}>
                Nombre de Contacto *
              </label>
              <input
                id="contact_name"
                {...register("contact_name")}
                className={`${baseInput} ${
                  errors.contact_name ? errorInput : normalInput
                }`}
              />
              {errors.contact_name && (
                <p className={errorText}>{errors.contact_name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="contact_area_or_position" className={label}>
                Área o Posición
              </label>
              <input
                id="contact_area_or_position"
                {...register("contact_area_or_position")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>

            <div>
              <label htmlFor="contact_cell_phone" className={label}>
                Celular de Contacto *
              </label>
              <input
                id="contact_cell_phone"
                {...register("contact_cell_phone")}
                className={`${baseInput} ${
                  errors.contact_cell_phone ? errorInput : normalInput
                }`}
              />
              {errors.contact_cell_phone && (
                <p className={errorText}>{errors.contact_cell_phone.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="contact_email" className={label}>
                Correo de Contacto *
              </label>
              <input
                type="email"
                id="contact_email"
                {...register("contact_email")}
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

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="w-full bg-[#0159B3] text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid || !isDirty}
          >
            {id_supplier ? "Actualizar Proveedor" : "Registrar Proveedor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioProveedores;
