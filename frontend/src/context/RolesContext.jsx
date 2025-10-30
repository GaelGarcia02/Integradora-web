import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getRolesRequest,
  getRoleRequest,
  getRolesUsersRequest,
  createRoleRequest,
  updateRoleRequest,
  deleteRoleRequest,
} from "../api/role.api";

const RolesContext = createContext();

export const useRoles = () => {
  const context = useContext(RolesContext);
  if (!context) {
    throw new Error("useRoles must be used within a RolesProvider");
  }
  return context;
};

export const RolesProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);
  const [rolesUsers, setRolesUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRoles();
    getRolesUsers();
  }, []);

  const getRoles = async () => {
    setLoading(true);
    try {
      const response = await getRolesRequest();
      setRoles(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getRole = async (id) => {
    setLoading(true);
    try {
      const response = await getRoleRequest(id);
      return response.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getRolesUsers = async () => {
    setLoading(true);
    try {
      const response = await getRolesUsersRequest();
      setRolesUsers(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createRole = async (role) => {
    setLoading(true);
    try {
      const response = await createRoleRequest(role);
      setRoles((prevRoles) => [...prevRoles, response.data]);
      getRolesUsers();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, role) => {
    setLoading(true);
    try {
      await updateRoleRequest(id, role);
      setRoles((prevRoles) =>
        prevRoles.map((rl) => (rl.id === id ? { ...rl, ...role } : rl))
      );
      getRolesUsers();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteRole = async (id) => {
    setLoading(true);
    try {
      await deleteRoleRequest(id);
      setRoles((prevRoles) => prevRoles.filter((rl) => rl.id !== id));
      getRolesUsers();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RolesContext.Provider
      value={{
        roles,
        rolesUsers,
        loading,
        error,
        getRoles,
        getRole,
        getRolesUsers,
        createRole,
        updateRole,
        deleteRole,
      }}
    >
      {children}
    </RolesContext.Provider>
  );
};
