import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getClientsRequest,
  getClientRequest,
  createClientRequest,
  updateClientRequest,
  deleteClientRequest,
} from "../api/clients.api";

const ClientsContext = createContext();

export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClients must be used within a ClientsProvider");
  }
  return context;
};

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    setLoading(true);
    try {
      const response = await getClientsRequest();
      setClients(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getClient = async (id) => {
    try {
      const response = await getClientRequest(id);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const createClient = async (client) => {
    setLoading(true);
    try {
      await createClientRequest(client);
      await getClients();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id, client) => {
    setLoading(true);
    try {
      await updateClientRequest(id, client);
      await getClients();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id) => {
    setLoading(true);
    try {
      await deleteClientRequest(id);
      await getClients();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClientsContext.Provider
      value={{
        clients,
        loading,
        error,
        getClients,
        getClient,
        createClient,
        updateClient,
        deleteClient,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};
