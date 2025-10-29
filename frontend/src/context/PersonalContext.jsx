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

  useEffect(() => {
    getAllPersonal();
  }, []);

  const getAllPersonal = async () => {
    try {
      const response = await getAllPersonalRequest();
      setPersonal(response.data);
    } catch (error) {
      console.error("Error fetching personal:", error);
    }
  };

  const getPersonal = async (id) => {
    try {
      const response = await getPersonalRequest(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching personal with ID ${id}:`, error);
    }
  };

  const getPersonalRole = async (id) => {
    try {
      const response = await getPersonalRoleRequest(id);
      setPersonalRole(response.data);
    } catch (error) {
      console.error(`Error fetching personal with ID ${id}:`, error);
    }
  };

  const createPersonal = async (personalData) => {
    try {
      const response = await createPersonalRequest(personalData);
      setPersonal([...personal, response.data]);
      getPersonal();
    } catch (error) {
      console.error("Error creating personal:", error);
      throw error;
    }
  };

  const updatePersonal = async (id, personalData) => {
    try {
      await updatePersonalRequest(id, personalData);
      const updatedPersonal = personal.map((p) =>
        p.id === id ? { ...p, ...personalData } : p
      );
      getPersonal();
      setPersonal(updatedPersonal);
    } catch (error) {
      console.error(`Error updating personal with ID ${id}:`, error);
      throw error;
    }
  };

  const deletePersonal = async (id) => {
    try {
      await deletePersonalRequest(id);
      setPersonal(personal.filter((p) => p.id !== id));
      getPersonal();
    } catch (error) {
      console.error(`Error deleting personal with ID ${id}:`, error);
      throw error;
    }
  };

  return (
    <PersonalContext.Provider
      value={{
        personal,
        personalRole,
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
