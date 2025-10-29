import axios from "axios";

const route = "http://127.0.01:4000/api";

export const getAllPersonalRequest = async () =>
  await axios.get(`${route}/personal`);

export const getPersonalRequest = async (id) =>
  await axios.get(`${route}/personal/${id}`);

export const getPersonalRequest2 = async (id) =>
  await axios.get("http://127.0.01:4000/api/personal/");

export const getPersonalRoleRequest = async () =>
  await axios.get("http://127.0.01:4000/api/personal-role");

export const createPersonalRequest = async (personal) => {
  console.log("Datos enviados:", personal);
  return await axios.post(`${route}/personal`, personal);
};

export const updatePersonalRequest = async (id, personal) =>
  await axios.put(`${route}/personal/${id}`, personal);

export const deletePersonalRequest = async (id) =>
  await axios.delete(`${route}/personal/${id}`);
