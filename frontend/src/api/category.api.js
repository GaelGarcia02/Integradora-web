import axios from "axios";

const route = "http://127.0.01:4000/api";

export const getCategoriesRequest = async () =>
  await axios.get(`${route}/categories`);

export const getCategoryRequest = async (id) =>
  await axios.get(`${route}/categories/${id}`);

export const createCategoryRequest = async (category) => {
  console.log("Datos enviados:", category);
  return await axios.post(`${route}/categories`, category);
};

export const updateCategoryRequest = async (id, category) =>
  await axios.put(`${route}/categories/${id}`, category);

export const deleteCategoryRequest = async (id) =>
  await axios.delete(`${route}/categories/${id}`);
