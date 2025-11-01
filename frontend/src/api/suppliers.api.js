import axios from "axios";

const route = "http://127.0.01:4000/api";

export const getSuppliersRequest = async () =>
  await axios.get(`${route}/suppliers`);

export const getSupplierRequest = async (id) =>
  await axios.get(`${route}/suppliers/${id}`);

export const createSupplierRequest = async (supplier) => {
  console.log("Datos enviados:", supplier);
  return await axios.post(`${route}/suppliers`, supplier);
};

export const updateSupplierRequest = async (id, supplier) =>
  await axios.put(`${route}/suppliers/${id}`, supplier);

export const deleteSupplierRequest = async (id) =>
  await axios.delete(`${route}/suppliers/${id}`);
