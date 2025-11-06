import { createContext, useContext, useState } from "react";
import axios from "axios";

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);

  const API_URL = "http://localhost:4000/api/products";

  // 🔹 Obtener todos los productos (ahora incluye categoría y unidad desde categories)
  const getProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
    }
  };

  // 🔹 Obtener un producto por ID
  const getProduct = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/${id}`);
      setProduct(res.data);
      return res.data;
    } catch (error) {
      console.error("❌ Error al obtener producto:", error);
    }
  };

  // 🔹 Crear producto
  const createProduct = async (data) => {
    try {
      // 🔍 No enviamos 'unit' porque ahora viene desde la tabla categories
      const cleanData = { ...data };
      delete cleanData.unit;

      const res = await axios.post(API_URL, cleanData);
      setProducts((prev) => [...prev, res.data]);
      return res.data;
    } catch (error) {
      console.error("❌ Error al crear producto:", error);
      throw error;
    }
  };

  // 🔹 Actualizar producto
  const updateProduct = async (id, data) => {
    try {
      // 🔍 No enviamos 'unit' porque ahora se obtiene desde la categoría
      const cleanData = { ...data };
      delete cleanData.unit;

      const res = await axios.put(`${API_URL}/${id}`, cleanData);
      setProducts((prev) =>
        prev.map((p) => (p.id_product === id ? { ...p, ...cleanData } : p))
      );
      return res.data;
    } catch (error) {
      console.error("❌ Error al actualizar producto:", error);
      throw error;
    }
  };

  // 🔹 Eliminar producto
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProducts((prev) => prev.filter((p) => p.id_product !== id));
    } catch (error) {
      console.error("❌ Error al eliminar producto:", error);
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        product,
        getProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};