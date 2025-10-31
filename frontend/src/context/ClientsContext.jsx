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
    setLoading(true);
    try {
      const response = await getClientRequest(id);
      return response.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createClient = async (client) => {
    setLoading(true);
    try {
      const response = await createClientRequest(client);
      setClients((prevClients) => [...prevClients, response.data]);
      getClients();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id, client) => {
    setLoading(true);
    try {
      await updateClientRequest(id, client);
      setClients((prevClients) =>
        prevClients.map((cl) => (cl.id === id ? { ...cl, ...client } : cl))
      );
      getClients();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id) => {
    setLoading(true);
    try {
      await deleteClientRequest(id);
      setClients((prevClients) => prevClients.filter((cl) => cl.id !== id));
      getClients();
    } catch (err) {
      setError(err);
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
