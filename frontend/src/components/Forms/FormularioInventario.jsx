import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useInventory } from "../../context/InventoryContext";
import { useCategories } from "../../context/CategoriesContext"; // 👈 Importa categorías

// ✅ Esquema de validación Yup (ya sin `unit`)
const validationSchema = Yup.object().shape({
  name_: Yup.string().required("Este campo es obligatorio"),
  category_id: Yup.string().required("Este campo es obligatorio"),
  description_: Yup.string().required("Este campo es obligatorio"),
  sale_price: Yup.number()
    .typeError("Debe ser un número válido")
    .required("Este campo es obligatorio"),
  model: Yup.string(),
  factory_code: Yup.string(),
  supplier_id: Yup.string().required("Este campo es obligatorio"),
  manufacturer_brand: Yup.string().required("Este campo es obligatorio"),
  initial_stock: Yup.number()
    .typeError("Debe ser un número válido")
    .required("Este campo es obligatorio"),
  minimum_stock: Yup.number()
    .typeError("Debe ser un número válido")
    .required("Este campo es obligatorio"),
  product_image: Yup.string().nullable(),
});

const FormularioInventario = ({ productData, onClose }) => {
  const { createProduct, updateProduct, deleteProduct } = useInventory();
  const { categories, getCategories } = useCategories();

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const isEditing = !!productData;

  // --- Cargar categorías ---
  useEffect(() => {
    getCategories();
  }, []);

  // --- Valores iniciales ---
  const emptyValues = {
    name_: "",
    category_id: "",
    description_: "",
    sale_price: "",
    model: "",
    factory_code: "",
    supplier_id: "",
    manufacturer_brand: "",
    initial_stock: "",
    minimum_stock: "",
    product_image: "",
  };

  // --- Estilos reutilizables ---
  const label = "block text-sm font-semibold text-gray-700 mb-1";
  const baseInput =
    "w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2";
  const normalInput =
    "border-gray-300 focus:ring-[#0159B3] focus:border-[#0159B3]";
  const errorInput = "border-red-500 focus:ring-red-500 focus:border-red-500";
  const errorText = "text-red-500 text-sm mt-1";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: emptyValues,
    mode: "onTouched",
  });

  // --- Cargar producto si se está editando ---
  useEffect(() => {
    if (productData && Object.keys(productData).length > 0) {
      reset({ ...emptyValues, ...productData });
      setPreviewImage(productData.product_image || null);
      const category = categories.find(
        (c) => c.id_category === productData.category_id
      );
      setSelectedCategory(category || null);
    } else {
      reset(emptyValues);
      setPreviewImage(null);
      setSelectedCategory(null);
    }
  }, [productData, categories, reset]);

  // --- Manejar imagen ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("product_image", reader.result);
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Guardar producto (crear o editar) ---
  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await updateProduct(productData.id_product, data);
        Swal.fire({
          icon: "success",
          title: "Producto actualizado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await createProduct(data);
        Swal.fire({
          icon: "success",
          title: "Producto agregado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      onClose();
    } catch (error) {
      console.error("❌ Error al guardar producto:", error);
      Swal.fire({
        icon: "error",
        title: "Error al guardar el producto",
        text: error.message || "Intente nuevamente",
      });
    }
  };

  // --- Eliminar producto ---
  const handleDelete = async () => {
    if (!productData?.id_product) return;
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteProduct(productData.id_product);
        Swal.fire({
          icon: "success",
          title: "Producto eliminado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
        onClose();
      } catch {
        Swal.fire({
          icon: "error",
          title: "Error al eliminar producto",
        });
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 mt-2 rounded-2xl shadow-md">
      {/* 🔹 Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-[#0159B3]">
          {isEditing ? "Editar Producto" : "Registrar Producto"}
        </h2>

        {isEditing && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <i className="fas fa-trash mr-2"></i>Eliminar
            </button>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-sm mb-6">
        Complete el formulario | (*) Campos obligatorios
      </p>
      <hr className="mb-6 border-gray-300" />

      {/* 🔹 Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 🔸 Imagen del producto */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Imagen del Producto
          </h3>

          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center mb-3">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Vista previa"
                  className="object-cover w-full h-full"
                />
              ) : (
                <i className="fas fa-box text-4xl text-gray-400"></i>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-sm"
            />
          </div>
        </section>

        {/* 🔸 Información general */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Información del Producto
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label htmlFor="name_" className={label}>
                Nombre del Producto *
              </label>
              <input
                type="text"
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

            {/* Categoría con unidad automática */}
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
                onChange={(e) => {
                  const selected = categories.find(
                    (c) => c.id_category == e.target.value
                  );
                  setSelectedCategory(selected || null);
                  setValue("category_id", e.target.value);
                }}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id_category} value={cat.id_category}>
                    {cat.name_}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className={errorText}>{errors.category_id.message}</p>
              )}

              {selectedCategory && (
                <p className="mt-2 text-sm text-gray-600">
                  Unidad asignada:{" "}
                  <strong className="text-[#0159B3]">
                    {selectedCategory.unit}
                  </strong>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* 🔸 Detalles técnicos */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Detalles Técnicos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="model" className={label}>
                Modelo
              </label>
              <input
                type="text"
                id="model"
                {...register("model")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>

            <div>
              <label htmlFor="factory_code" className={label}>
                Código de Fábrica
              </label>
              <input
                type="text"
                id="factory_code"
                {...register("factory_code")}
                className={`${baseInput} ${normalInput}`}
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="description_" className={label}>
              Descripción *
            </label>
            <textarea
              id="description_"
              {...register("description_")}
              className={`${baseInput} ${
                errors.description_ ? errorInput : normalInput
              }`}
              rows="3"
            />
            {errors.description_ && (
              <p className={errorText}>{errors.description_.message}</p>
            )}
          </div>
        </section>

        {/* 🔸 Stock y precios */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Inventario y Proveedor
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="initial_stock" className={label}>
                Stock Inicial *
              </label>
              <input
                type="number"
                id="initial_stock"
                {...register("initial_stock")}
                className={`${baseInput} ${
                  errors.initial_stock ? errorInput : normalInput
                }`}
              />
              {errors.initial_stock && (
                <p className={errorText}>{errors.initial_stock.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="minimum_stock" className={label}>
                Stock Mínimo *
              </label>
              <input
                type="number"
                id="minimum_stock"
                {...register("minimum_stock")}
                className={`${baseInput} ${
                  errors.minimum_stock ? errorInput : normalInput
                }`}
              />
              {errors.minimum_stock && (
                <p className={errorText}>{errors.minimum_stock.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="supplier_id" className={label}>
                Proveedor *
              </label>
              <input
                type="text"
                id="supplier_id"
                {...register("supplier_id")}
                className={`${baseInput} ${
                  errors.supplier_id ? errorInput : normalInput
                }`}
              />
              {errors.supplier_id && (
                <p className={errorText}>{errors.supplier_id.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="sale_price" className={label}>
                Precio de Venta *
              </label>
              <input
                type="number"
                step="0.01"
                id="sale_price"
                {...register("sale_price")}
                className={`${baseInput} ${
                  errors.sale_price ? errorInput : normalInput
                }`}
              />
              {errors.sale_price && (
                <p className={errorText}>{errors.sale_price.message}</p>
              )}
            </div>
          </div>
        </section>

        {/* 🔸 Botones finales */}
        <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-4">
          <button
            type="submit"
            className="flex-1 bg-[#0159B3] text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!isValid}
          >
            {isEditing ? "Actualizar Producto" : "Registrar Producto"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition duration-150 ease-in-out"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioInventario;