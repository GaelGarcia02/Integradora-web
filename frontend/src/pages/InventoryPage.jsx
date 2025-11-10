import React, { useEffect, useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { useCategories } from "../context/CategoriesContext";
import Swal from "sweetalert2";
import BotonModal from "../components/Buttons/BotonModal";
import FormularioInventario from "../components/Forms/FormularioInventario";

const InventoryPage = () => {
  const { products, getProducts, deleteProduct } = useInventory();
  const { categories, getCategories } = useCategories();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name_");

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  const filteredProducts = products
    .filter((p) =>
      selectedCategory === "all"
        ? true
        : String(p.category_id) === String(selectedCategory)
    )
    .filter((p) => p.name_.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price") return a.sale_price - b.sale_price;
      if (sortBy === "stock") return b.stock_disponible - a.stock_disponible;
      return a.name_.localeCompare(b.name_);
    });

  const handleDelete = async (id_product) => {
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
        await deleteProduct(id_product);
        Swal.fire({
          icon: "success",
          title: "Producto eliminado correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
        getProducts();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error al eliminar producto",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl shadow-sm">
      {/* 🔹 Encabezado */}
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-box text-[#0159B3] text-xl"></i>
        <h2 className="text-2xl font-bold text-gray-800">Inventario</h2>
      </div>

      <hr className="mb-6 border-gray-300" />

      {/* 🔹 Botón + filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <BotonModal
          nombreBoton="Nuevo Producto"
          icono="fas fa-plus"
          contenidoModal={<FormularioInventario onClose={getProducts} />}
          titulo="Registrar Producto"
        />

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Buscar..."
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0159B3]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <label className="text-gray-600 text-sm font-medium">
              Ordenar por:
            </label>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0159B3]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name_">Nombre</option>
              <option value="price">Precio</option>
              <option value="stock">Stock</option>
            </select>
            <i className="fas fa-arrow-down text-[#0159B3]"></i>
          </div>
        </div>
      </div>

      {/* 🔹 Menú de Categorías */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            selectedCategory === "all"
              ? "bg-[#0159B3] text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Todas
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id_category}
            onClick={() => setSelectedCategory(cat.id_category)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              selectedCategory === cat.id_category
                ? "bg-[#0159B3] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat.name_}
          </button>
        ))}
      </div>

      {/* 🔹 Productos */}
      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No hay productos en esta categoría o no coinciden con la búsqueda.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id_product}
              className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center text-center hover:shadow-lg transition relative"
            >
              <div className="w-28 h-28 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center mb-3">
                {product.product_image ? (
                  <img
                    src={product.product_image}
                    alt={product.name_}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <i className="fas fa-box text-4xl text-gray-400"></i>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {product.name_}
              </h3>

              <p className="text-sm text-gray-500 mb-1">
                Categoría:{" "}
                <span className="font-medium text-gray-700">
                  {product.category_name || "Sin categoría"}
                </span>
              </p>

              <p className="text-[#0159B3] font-bold text-lg mb-2">
                ${product.sale_price}
              </p>

              <div className="w-full text-sm text-gray-600 mb-4 text-left px-2">
                <div className="flex justify-between items-center border-b pb-1 mb-1">
                  <span className="font-semibold text-gray-800">
                    Disponible:
                  </span>
                  <span
                    className={`font-bold text-lg ${
                      product.stock_disponible <= product.minimum_stock
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {product.stock_disponible}
                    <span className="text-xs ml-1">{product.unit}</span>
                  </span>
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Físico (Total):</span>
                  <span>{product.stock_fisico}</span>
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Comprometido:</span>
                  <span>{product.stock_comprometido}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <BotonModal
                  nombreBoton="Editar"
                  icono="fas fa-edit"
                  color="bg-yellow-500 hover:bg-yellow-600"
                  contenidoModal={
                    <FormularioInventario
                      productData={product}
                      onClose={getProducts}
                    />
                  }
                  titulo="Editar Producto"
                />
                <button
                  onClick={() => handleDelete(product.id_product)}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
