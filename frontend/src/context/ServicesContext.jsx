import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getServicesRequest,
  getServiceRequest,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
} from "../api/services.api";

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    setLoading(true);
    try {
      const response = await getServicesRequest();
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const getService = async (id) => {
    try {
      const response = await getServiceRequest(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      throw error;
    }
  };

  const createService = async (service) => {
    setLoading(true);
    try {
      await createServiceRequest(service);
      await getServices();
    } catch (error) {
      console.error("Error creating service:", error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id, service) => {
    setLoading(true);
    try {
      await updateServiceRequest(id, service);
      await getServices();
    } catch (error) {
      console.error(`Error updating service with ID ${id}:`, error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id) => {
    setLoading(true);
    try {
      await deleteServiceRequest(id);
      await getServices();
    } catch (error) {
      console.error(`Error deleting service with ID ${id}:`, error);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServicesContext.Provider
      value={{
        services,
        loading,
        error,
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
