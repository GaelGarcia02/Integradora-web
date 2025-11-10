import { createContext, useContext, useState, useEffect } from "react";
import {
  getAvailableProductsRequest,
  getProductRequest,
  createProductRequest,
  updateProductRequest,
  deleteProductRequest,
} from "../api/inventory.api.js";

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await getAvailableProductsRequest();
      setProducts(res.data);
    } catch (error) {
      console.error("Error al obtener productos disponibles:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id) => {
    try {
      const res = await getProductRequest(id);
      return res.data;
    } catch (error) {
      console.error("Error al obtener producto:", error);
      throw error; // Relanza el error
    }
  };

  const createProduct = async (data) => {
    setLoading(true);
    try {
      const res = await createProductRequest(data);
      await getAvailableProducts(); // Refresca la lista
      return res.data;
    } catch (error) {
      console.error("Error al crear producto:", error);
      setError(error);
      throw error; // Relanza el error
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, data) => {
    setLoading(true);
    try {
      const res = await updateProductRequest(id, data);
      await getAvailableProducts(); // Refresca la lista
      return res.data;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      setError(error);
      throw error; // Relanza el error
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      await deleteProductRequest(id);
      await getAvailableProducts(); // Refresca la lista
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setError(error);
      throw error; // Relanza el error
    } finally {
      setLoading(false);
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        products,
        loading,
        error,
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
