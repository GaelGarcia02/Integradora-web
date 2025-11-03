import axios from "axios";

const route = "http://127.0.01:4000/api";

export const getServicesRequest = async () =>
  await axios.get(`${route}/services`);

export const getServiceRequest = async (id) =>
  await axios.get(`${route}/services/${id}`);

export const createServiceRequest = async (service) => {
  console.log("Datos enviados:", service);
  return await axios.post(`${route}/services`, service);
};

export const updateServiceRequest = async (id, service) =>
  await axios.put(`${route}/services/${id}`, service);

export const deleteServiceRequest = async (id) =>
  await axios.delete(`${route}/services/${id}`);
