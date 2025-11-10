import axios from "axios";

const API_URL = "http://localhost:4000/api/products";

// 🔹 NUEVO: Obtener la lista de productos con el stock calculado
export const getAvailableProductsRequest = async () =>
  await axios.get(`${API_URL}/available`);

// 🔹 Obtener productos con info de proveedor (la que ya tenías)
export const getProductsProviderRequest = async () =>
  await axios.get(`${API_URL}/provider`);

// 🔹 Obtener todos los productos (la lista "cruda")
export const getProductsRequest = async () => await axios.get(API_URL);

// 🔹 Obtener un producto por ID
export const getProductRequest = async (id) =>
  await axios.get(`${API_URL}/${id}`);

// 🔹 Crear producto
export const createProductRequest = async (data) =>
  await axios.post(API_URL, data);

// 🔹 Actualizar producto
export const updateProductRequest = async (id, data) =>
  await axios.put(`${API_URL}/${id}`, data);

// 🔹 Eliminar producto
export const deleteProductRequest = async (id) =>
  await axios.delete(`${API_URL}/${id}`);
