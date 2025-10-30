import axios from "axios";

const route = "http://127.0.01:4000/api";

export const getRolesRequest = async () => await axios.get(`${route}/roles`);

export const getRoleRequest = async (id) =>
  await axios.get(`${route}/roles/${id}`);

export const getRolesUsersRequest = async () =>
  await axios.get(`${route}/roles-users`);

export const createRoleRequest = async (role) => {
  console.log("Datos enviados:", role);
  return await axios.post(`${route}/roles`, role);
};

export const updateRoleRequest = async (id, role) =>
  await axios.put(`${route}/roles/${id}`, role);

export const deleteRoleRequest = async (id) =>
  await axios.delete(`${route}/roles/${id}`);
