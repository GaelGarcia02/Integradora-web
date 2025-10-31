import axios from "axios";

const route = "http://127.0.01:4000/api";

export const getClientsRequest = async () =>
  await axios.get(`${route}/clients`);

export const getClientRequest = async (id) =>
  await axios.get(`${route}/clients/${id}`);

export const createClientRequest = async (client) => {
  console.log("Datos enviados:", client);
  return await axios.post(`${route}/clients`, client);
};

export const updateClientRequest = async (id, client) =>
  await axios.put(`${route}/clients/${id}`, client);

export const deleteClientRequest = async (id) =>
  await axios.delete(`${route}/clients/${id}`);
