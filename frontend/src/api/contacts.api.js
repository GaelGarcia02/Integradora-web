import axios from "axios";

const route = "http://127.0.01:4000/api";

export const getContactsRequest = async () =>
  await axios.get(`${route}/contacts`);

export const getContactRequest = async (id) =>
  await axios.get(`${route}/contacts/${id}`);

export const createContactRequest = async (contact) => {
  console.log("Datos enviados:", contact);
  return await axios.post(`${route}/contacts`, contact);
};

export const updateContactRequest = async (id, contact) =>
  await axios.put(`${route}/contacts/${id}`, contact);

export const deleteContactRequest = async (id) =>
  await axios.delete(`${route}/contacts/${id}`);
