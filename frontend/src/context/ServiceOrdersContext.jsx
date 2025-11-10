import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getServiceOrdersRequest,
  getServiceOrderRequest,
  createServiceOrderRequest,
  updateServiceOrderRequest,
  deleteServiceOrderRequest,
  confirmServiceOrderRequest,
} from "../api/service-orders.api";

const ServiceOrdersContext = createContext();

export const useServiceOrders = () => {
  const context = useContext(ServiceOrdersContext);
  if (!context) {
    throw new Error(
      "useServiceOrders must be used within a ServiceOrdersProvider"
    );
  }
  return context;
};

export const ServiceOrdersProvider = ({ children }) => {
  const [serviceOrders, setServiceOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getServiceOrders();
  }, []);

  const getServiceOrders = async () => {
    setLoading(true);
    try {
      const response = await getServiceOrdersRequest();
      setServiceOrders(response.data);
    } catch (err) {
      console.log(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getServiceOrder = async (id) => {
    try {
      const response = await getServiceOrderRequest(id);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const createServiceOrder = async (serviceOrder) => {
    setLoading(true);
    try {
      await createServiceOrderRequest(serviceOrder);
      await getServiceOrders();
    } catch (err) {
      setError(err);
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateServiceOrder = async (id, serviceOrder) => {
    setLoading(true);
    try {
      await updateServiceOrderRequest(id, serviceOrder);
      await getServiceOrders();
    } catch (err) {
      setError(err);
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteServiceOrder = async (id) => {
    setLoading(true);
    try {
      await deleteServiceOrderRequest(id);
      await getServiceOrders();
    } catch (err) {
      setError(err);
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const confirmServiceOrder = async (id, productsData) => {
    setLoading(true);
    try {
      await confirmServiceOrderRequest(id, productsData);
      await getServiceOrders();
    } catch (err) {
      setError(err);
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ServiceOrdersContext.Provider
      value={{
        serviceOrders,
        loading,
        error,
        getServiceOrders,
        getServiceOrder,
        createServiceOrder,
        updateServiceOrder,
        deleteServiceOrder,
        confirmServiceOrder,
      }}
    >
      {children}
    </ServiceOrdersContext.Provider>
  );
};
