import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAllPersonalRequest,
  getPersonalRequest,
  createPersonalRequest,
  updatePersonalRequest,
  deletePersonalRequest,
  getPersonalRoleRequest,
} from "../api/personal.api";

const PersonalContext = createContext();

export const usePersonal = () => {
  const context = useContext(PersonalContext);
  if (!context) {
    throw new Error("usePersonal must be used within a PersonalProvider");
  }
  return context;
};

export const PersonalProvider = ({ children }) => {
  const [personal, setPersonal] = useState([]);
  const [personalRole, setPersonalRole] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllPersonal();
    getPersonalRole(); // Llamar a ambas
  }, []);

  const getAllPersonal = async () => {
    setLoading(true);
    try {
      const response = await getAllPersonalRequest();
      setPersonal(response.data);
    } catch (error) {
      console.error("Error fetching personal:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getPersonal = async (id) => {
    try {
      const response = await getPersonalRequest(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching personal with ID ${id}:`, error);
      throw error; // Relanza el error
    }
  };

  const getPersonalRole = async () => {
    setLoading(true);
    try {
      const response = await getPersonalRoleRequest();
      setPersonalRole(response.data);
    } catch (error) {
      console.error(`Error fetching personal with role:`, error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const createPersonal = async (personalData) => {
    setLoading(true);
    try {
      await createPersonalRequest(personalData);
      await getAllPersonal(); // Refresca la lista
      await getPersonalRole(); // Refresca la otra lista
    } catch (error) {
      console.error("Error creating personal:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePersonal = async (id, personalData) => {
    setLoading(true);
    try {
      await updatePersonalRequest(id, personalData);
      await getAllPersonal(); // Refresca la lista
      await getPersonalRole(); // Refresca la otra lista
    } catch (error) {
      console.error(`Error updating personal with ID ${id}:`, error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deletePersonal = async (id) => {
    setLoading(true);
    try {
      await deletePersonalRequest(id);
      await getAllPersonal(); // Refresca la lista
      await getPersonalRole(); // Refresca la otra lista
    } catch (error) {
      console.error(`Error deleting personal with ID ${id}:`, error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PersonalContext.Provider
      value={{
        personal,
        personalRole,
        loading,
        error,
        getPersonal,
        getAllPersonal,
        createPersonal,
        updatePersonal,
        deletePersonal,
        getPersonalRole,
      }}
    >
      {children}
    </PersonalContext.Provider>
  );
};
