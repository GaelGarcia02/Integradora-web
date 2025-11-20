import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Swal from "sweetalert2";

import { useServiceOrders } from "../../context/ServiceOrdersContext";
import { useClients } from "../../context/ClientsContext";
import { useServices } from "../../context/ServicesContext";
import { usePersonal } from "../../context/PersonalContext";
import { useInventory } from "../../context/InventoryContext";

// --- Esquema de Validación ---
const validationSchema = Yup.object().shape({
  client_id: Yup.string().required("Cliente es obligatorio"),
  service_id: Yup.string().required("Servicio es obligatorio"),
  personal_ids: Yup.array()
    .of(Yup.number())
    .min(1, "Debe asignar al menos a una persona"),

  contact_name: Yup.string().required("Nombre de contacto es obligatorio"),
  contact_phone: Yup.string().required("Teléfono de contacto es obligatorio"),
  contact_email: Yup.string()
    .email("Email inválido")
    .required("Email de contacto es obligatorio"),
  scheduled_date: Yup.date()
    .typeError("Fecha inválida")
    .required("Fecha es obligatoria"),
  start_time: Yup.string().required("Hora de inicio es obligatoria"),
  end_time: Yup.string(),
  price: Yup.number()
    .typeError("Debe ser un número")
    .min(0, "Precio no válido")
    .required("Precio es obligatorio"),
  activities: Yup.string().required("Actividades son obligatorias"),
  recomendations: Yup.string().required("Recomendaciones son obligatorias"),
  files: Yup.string().nullable(),
  state_: Yup.string().required("Estado es obligatorio"),
  products: Yup.array()
    .of(
      Yup.object().shape({
        product_id: Yup.string().required("Selecciona un producto"),
        quantity_used: Yup.number()
          .typeError("Debe ser un número")
          .min(1, "Debe ser al menos 1")
          .required("Cantidad es obligatoria"),
      })
    )
    .min(0),
});

const emptyValues = {
  client_id: "",
  service_id: "",
  personal_ids: [],
  contact_name: "",
  contact_phone: "",
  contact_email: "",
  scheduled_date: "",
  start_time: "",
  end_time: "",
  price: 0,
  activities: "",
  recomendations: "",
  files: "",
  state_: "Pendiente",
  products: [],
};

// --- Estilos ---
const label = "block text-sm font-semibold text-gray-700 mb-1";
const baseInput =
  "w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2";
const normalInput =
  "border-gray-300 focus:ring-[#0159B3] focus:border-[#0159B3]";
const errorInput = "border-red-500 focus:ring-red-500 focus:border-red-500";
const errorText = "text-red-500 text-sm mt-1";

const FormularioOrdenDeServicio = ({
  id_service_order,
  onClose,
  onSuccess,
}) => {
  const { createServiceOrder, updateServiceOrder, getServiceOrder } =
    useServiceOrders();
  const { clients, getClients } = useClients();
  const { services, getServices } = useServices();
  const { personal, getAllPersonal } = usePersonal();
  const { products: availableProducts, getProducts: getAvailableProducts } =
    useInventory();

  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!id_service_order;

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    getValues, // Necesario para leer el array actual
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: emptyValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  // --- Cargar Catálogos ---
  useEffect(() => {
    getClients();
    getServices();
    getAllPersonal();
    getAvailableProducts();
  }, []);

  // --- Cargar Orden (Editar) ---
  useEffect(() => {
    const fetchOrderData = async () => {
      if (id_service_order) {
        setIsLoading(true);
        try {
          const orderData = await getServiceOrder(id_service_order);
          if (orderData) {
            // Formatear fecha
            orderData.scheduled_date = new Date(orderData.scheduled_date)
              .toISOString()
              .split("T")[0];

            // Extraer IDs de personal asignado
            if (orderData.personal) {
              orderData.personal_ids = orderData.personal.map(
                (p) => p.id_personal
              );
            } else {
              orderData.personal_ids = [];
            }

            reset(orderData);
          }
        } catch (error) {
          Swal.fire({ icon: "error", title: "Error al cargar la orden" });
        } finally {
          setIsLoading(false);
        }
      } else {
        reset(emptyValues);
      }
    };
    fetchOrderData();
  }, [id_service_order, getServiceOrder, reset]);

  // --- Auto-rellenar ---
  const selectedClientId = watch("client_id");
  const selectedServiceId = watch("service_id");
  const selectedPersonalIds = watch("personal_ids") || [];

  useEffect(() => {
    if (selectedClientId && !isEditing) {
      const client = clients.find((c) => c.id_client == selectedClientId);
      if (client) {
        setValue("contact_name", client.contact_name, { shouldValidate: true });
        setValue("contact_phone", client.contact_cell_phone, {
          shouldValidate: true,
        });
        setValue("contact_email", client.contact_email, {
          shouldValidate: true,
        });
      }
    }
  }, [selectedClientId, clients, setValue, isEditing]);

  useEffect(() => {
    if (selectedServiceId && !isEditing) {
      const service = services.find((s) => s.id_service == selectedServiceId);
      if (service) {
        setValue("price", service.sale_price, { shouldValidate: true });
      }
    }
  }, [selectedServiceId, services, setValue, isEditing]);

  // --- Funciones para personal multiple ---
  const handleAddPersonal = (e) => {
    const idToAdd = parseInt(e.target.value);
    if (!idToAdd) return;

    const currentIds = getValues("personal_ids") || [];

    // Evitar duplicados
    if (!currentIds.includes(idToAdd)) {
      setValue("personal_ids", [...currentIds, idToAdd], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    // Resetear el select visualmente
    e.target.value = "";
  };

  const tecnicosDisponibles = personal.filter((p) => p.role_id !== 1);

  console.log("Técnicos disponibles:", tecnicosDisponibles);

  const handleRemovePersonal = (idToRemove) => {
    const currentIds = getValues("personal_ids") || [];
    const newIds = currentIds.filter((id) => id !== idToRemove);
    setValue("personal_ids", newIds, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateServiceOrder(id_service_order, data);
        Swal.fire({
          icon: "success",
          title: "Orden actualizada",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await createServiceOrder(data);
        Swal.fire({
          icon: "success",
          title: "Orden creada",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      onSuccess?.();
      onClose?.();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al guardar la orden",
        text: error.message || "Intente nuevamente",
      });
    }
  };

  if (isLoading) return <p className="text-center p-8">Cargando datos...</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 mt-2 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-[#0159B3] mb-4">
        {isEditing ? "Editar Orden de Servicio" : "Registrar Orden de Servicio"}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Complete el formulario | (*) Campos obligatorios
      </p>
      <hr className="mb-6 border-gray-300" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Información del cliente */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Información del Cliente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <label htmlFor="client_id" className={label}>
                Cliente *
              </label>
              <select
                {...register("client_id")}
                className={`${baseInput} ${
                  errors.client_id ? errorInput : normalInput
                }`}
              >
                <option value="">Seleccionar cliente</option>
                {clients.map((c) => (
                  <option key={c.id_client} value={c.id_client}>
                    {c.trade_name}
                  </option>
                ))}
              </select>
              {errors.client_id && (
                <p className={errorText}>{errors.client_id.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="contact_name" className={label}>
                Nombre Contacto *
              </label>
              <input
                type="text"
                {...register("contact_name")}
                className={`${baseInput} ${
                  errors.contact_name ? errorInput : normalInput
                } bg-gray-100`}
                readOnly
              />
              {errors.contact_name && (
                <p className={errorText}>{errors.contact_name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="contact_phone" className={label}>
                Teléfono Contacto *
              </label>
              <input
                type="text"
                {...register("contact_phone")}
                className={`${baseInput} ${
                  errors.contact_phone ? errorInput : normalInput
                } bg-gray-100`}
                readOnly
              />
              {errors.contact_phone && (
                <p className={errorText}>{errors.contact_phone.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="contact_email" className={label}>
                Email Contacto *
              </label>
              <input
                type="email"
                {...register("contact_email")}
                className={`${baseInput} ${
                  errors.contact_email ? errorInput : normalInput
                } bg-gray-100`}
                readOnly
              />
              {errors.contact_email && (
                <p className={errorText}>{errors.contact_email.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Información del servicio */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Información del Servicio
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="service_id" className={label}>
                Servicio *
              </label>
              <select
                {...register("service_id")}
                className={`${baseInput} ${
                  errors.service_id ? errorInput : normalInput
                }`}
              >
                <option value="">Seleccionar servicio</option>
                {services.map((s) => (
                  <option key={s.id_service} value={s.id_service}>
                    {s.name_}
                  </option>
                ))}
              </select>
              {errors.service_id && (
                <p className={errorText}>{errors.service_id.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="price" className={label}>
                Precio *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                className={`${baseInput} ${
                  errors.price ? errorInput : normalInput
                } bg-gray-100`}
                readOnly
              />
              {errors.price && (
                <p className={errorText}>{errors.price.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="scheduled_date" className={label}>
                Fecha *
              </label>
              <input
                type="date"
                {...register("scheduled_date")}
                className={`${baseInput} ${
                  errors.scheduled_date ? errorInput : normalInput
                }`}
              />
              {errors.scheduled_date && (
                <p className={errorText}>{errors.scheduled_date.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="start_time" className={label}>
                Hora Inicio *
              </label>
              <input
                type="time"
                {...register("start_time")}
                className={`${baseInput} ${
                  errors.start_time ? errorInput : normalInput
                }`}
              />
              {errors.start_time && (
                <p className={errorText}>{errors.start_time.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="end_time" className={label}>
                Hora Fin
              </label>
              <input
                type="time"
                {...register("end_time")}
                className={`${baseInput} ${
                  errors.end_time ? errorInput : normalInput
                }`}
              />
              {errors.end_time && (
                <p className={errorText}>{errors.end_time.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Detalles y Asignación */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Detalles y Asignación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Selección de Personal (Múltiple) */}
            <div>
              <label className={label}>Personal Asignado *</label>
              {/* 1. Select para agregar */}
              <select
                onChange={handleAddPersonal}
                className={`${baseInput} ${
                  errors.personal_ids ? errorInput : normalInput
                }`}
                defaultValue=""
              >
                <option value="" disabled>
                  + Asignar técnico...
                </option>

                {tecnicosDisponibles.map((p) => (
                  <option key={p.id_personal} value={p.id_personal}>
                    {p.name_} {p.last_name}
                  </option>
                ))}
              </select>
              {errors.personal_ids && (
                <p className={errorText}>{errors.personal_ids.message}</p>
              )}

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedPersonalIds.map((id) => {
                  const persona = personal.find((p) => p.id_personal === id);
                  if (!persona) return null;
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-[#0159B3]"
                    >
                      {persona.name_} {persona.last_name}
                      <button
                        type="button"
                        onClick={() => handleRemovePersonal(id)}
                        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Estado */}
            <div>
              <label htmlFor="state_" className={label}>
                Estado *
              </label>
              <select
                {...register("state_")}
                className={`${baseInput} ${
                  errors.state_ ? errorInput : normalInput
                }`}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Completada">Completada</option>
                <option value="Cancelada">Cancelada</option>
              </select>
              {errors.state_ && (
                <p className={errorText}>{errors.state_.message}</p>
              )}
            </div>
            {/* Actividades */}
            <div>
              <label htmlFor="activities" className={label}>
                Actividades *
              </label>
              <textarea
                {...register("activities")}
                rows="3"
                className={`${baseInput} ${
                  errors.activities ? errorInput : normalInput
                }`}
              />
              {errors.activities && (
                <p className={errorText}>{errors.activities.message}</p>
              )}
            </div>
            {/* Recomendaciones */}
            <div>
              <label htmlFor="recomendations" className={label}>
                Recomendaciones *
              </label>
              <textarea
                {...register("recomendations")}
                rows="3"
                className={`${baseInput} ${
                  errors.recomendations ? errorInput : normalInput
                }`}
              />
              {errors.recomendations && (
                <p className={errorText}>{errors.recomendations.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* Productos */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Materiales / Productos
            </h3>
            <button
              type="button"
              onClick={() => append({ product_id: "", quantity_used: 1 })}
              className="px-4 py-2 bg-blue-100 text-[#0159B3] font-semibold rounded-lg hover:bg-blue-200 transition text-sm"
            >
              <i className="fas fa-plus mr-2"></i> Agregar Fila
            </button>
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            {fields.length === 0 && (
              <p className="text-sm text-gray-500 text-center">
                No se han agregado productos.
              </p>
            )}

            {fields.map((field, index) => {
              // 1. El producto que el usuario ESTÁ seleccionando AHORA
              const selectedProductId = watch(`products.${index}.product_id`);
              const selectedProduct = availableProducts.find(
                (p) => p.id_product == selectedProductId
              );

              // 2. El producto que se CARGÓ originalmente en esta fila
              const originalProductId = field.product_id; // (Viene de 'reset(data)')
              const originalQuantity = isEditing
                ? parseInt(field.quantity_used || 0, 10)
                : 0;

              // 3. El stock disponible "base" (ej: 20m de cable)
              const stockDisponible = selectedProduct
                ? parseInt(selectedProduct.stock_disponible, 10)
                : 0;

              // 4. El 'max' real para este input
              let maxParaEsteInput = 0;
              if (selectedProduct) {
                if (selectedProductId == originalProductId) {
                  maxParaEsteInput = stockDisponible + originalQuantity;
                } else {
                  maxParaEsteInput = stockDisponible;
                }
              }

              const unit = selectedProduct ? selectedProduct.unit : "-";

              return (
                <div
                  key={field.id}
                  className="flex flex-col md:flex-row gap-4 items-start"
                >
                  <div className="flex-1 w-full">
                    <label className={label}>Producto *</label>
                    <select
                      {...register(`products.${index}.product_id`)}
                      className={`${baseInput} ${
                        errors.products?.[index]?.product_id
                          ? errorInput
                          : normalInput
                      }`}
                    >
                      <option value="">Seleccionar producto</option>
                      {availableProducts.map((p) => (
                        <option key={p.id_product} value={p.id_product}>
                          {p.name_}
                        </option>
                      ))}
                    </select>
                    {errors.products?.[index]?.product_id && (
                      <p className={errorText}>
                        {errors.products[index].product_id.message}
                      </p>
                    )}
                  </div>

                  <div className="w-full md:w-32">
                    <label className={label}>Cantidad *</label>
                    <div className="relative">
                      <input
                        type="number"
                        {...register(`products.${index}.quantity_used`)}
                        className={`${baseInput} ${
                          errors.products?.[index]?.quantity_used
                            ? errorInput
                            : normalInput
                        }`}
                        placeholder="Ej: 5"
                        min="1"
                        max={maxParaEsteInput}
                      />
                      <span className="absolute right-3 top-2.5 text-sm text-gray-400">
                        {unit}
                      </span>
                    </div>
                    {selectedProduct && (
                      <p
                        className={`text-xs mt-1 ${
                          stockDisponible <= 0
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {isEditing
                          ? `Max. Disp: ${maxParaEsteInput} ${unit}`
                          : `Disponible: ${stockDisponible} ${unit}`}
                      </p>
                    )}
                    {errors.products?.[index]?.quantity_used && (
                      <p className={errorText}>
                        {errors.products[index].quantity_used.message}
                      </p>
                    )}
                  </div>

                  <div className="pt-7">
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transition"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              );
            })}
            {errors.products && !errors.products.length && (
              <p className={errorText}>{errors.products.message}</p>
            )}
          </div>
        </section>

        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0159B3] text-white rounded-lg shadow-md hover:bg-[#01447a] transition disabled:opacity-50"
            disabled={(!isDirty && !isEditing) || !isValid}
          >
            <i className="fas fa-save mr-2"></i>
            {isEditing ? "Actualizar Orden" : "Guardar Orden"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioOrdenDeServicio;
