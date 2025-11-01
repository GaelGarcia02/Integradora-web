import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getSuppliersRequest,
  getSupplierRequest,
  createSupplierRequest,
  updateSupplierRequest,
  deleteSupplierRequest,
} from "../api/suppliers.api";

const SuppliersContext = createContext();

export const useSuppliers = () => {
  const context = useContext(SuppliersContext);
  if (!context) {
    throw new Error("useSuppliers must be used within a SuppliersProvider");
  }
  return context;
};

export const SuppliersProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSuppliers();
  }, []);

  const getSuppliers = async () => {
    setLoading(true);
    try {
      const response = await getSuppliersRequest();
      setSuppliers(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getSupplier = async (id) => {
    setLoading(true);
    try {
      const response = await getSupplierRequest(id);
      return response.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createSupplier = async (supplier) => {
    setLoading(true);
    try {
      const response = await createSupplierRequest(supplier);
      setSuppliers((prevSuppliers) => [...prevSuppliers, response.data]);
      getSuppliers();
    } catch (err) {
      console.error(
        "Error al crear proveedor:",
        err.response?.data || err.message
      );
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateSupplier = async (id, supplier) => {
    setLoading(true);
    try {
      await updateSupplierRequest(id, supplier);
      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((sup) =>
          sup.id === id ? { ...sup, ...supplier } : sup
        )
      );
      getSuppliers();
    } catch (err) {
      console.log("no jala");
      console.error(err.response?.data || err.message || err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteSupplier = async (id) => {
    setLoading(true);
    try {
      await deleteSupplierRequest(id);
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((sup) => sup.id !== id)
      );
      getSuppliers();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuppliersContext.Provider
      value={{
        suppliers,
        loading,
        error,
        getSuppliers,
        getSupplier,
        createSupplier,
        updateSupplier,
        deleteSupplier,
      }}
    >
      {children}
    </SuppliersContext.Provider>
  );
};
