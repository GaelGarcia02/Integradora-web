import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getServicesRequest,
  getServiceRequest,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
} from "../api/services.api";
import { get } from "react-hook-form";

const ServicesContext = createContext();

export const useServices = () => {
  const context = useContext(ServicesContext);
  if (!context) {
    throw new Error("useServices must be used within a ServicesProvider");
  }
  return context;
};

export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    try {
      const response = await getServicesRequest();
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const getService = async (id) => {
    try {
      const response = await getServiceRequest(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
    }
  };

  const createService = async (service) => {
    try {
      const response = await createServiceRequest(service);
      setServices([...services, response.data]);
      getServices();
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  };

  const updateService = async (id, service) => {
    try {
      await updateServiceRequest(id, service);
      const updatedServices = services.map((srv) =>
        srv.id === id ? { ...srv, ...service } : srv
      );
      getServices();
      setServices(updatedServices);
    } catch (error) {
      console.error(`Error updating service with ID ${id}:`, error);
      throw error;
    }
  };

  const deleteService = async (id) => {
    try {
      await deleteServiceRequest(id);
      setServices(services.filter((srv) => srv.id !== id));
      getServices();
    } catch (error) {
      console.error(`Error deleting service with ID ${id}:`, error);
      throw error;
    }
  };

  return (
    <ServicesContext.Provider
      value={{
        services,
        getService,
        getServices,
        createService,
        updateService,
        deleteService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};
