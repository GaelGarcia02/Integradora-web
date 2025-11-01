import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getContactsRequest,
  getContactRequest,
  createContactRequest,
  updateContactRequest,
  deleteContactRequest,
} from "../api/contacts.api";

const ContactsContext = createContext();

export const useContacts = () => {
  const context = useContext(ContactsContext);
  if (!context) {
    throw new Error("useContacts debe ser usado dentro de un ContactsProvider");
  }
  return context;
};

export const ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getContacts();
  }, []);

  const getContacts = async () => {
    setLoading(true);
    try {
      const response = await getContactsRequest();
      setContacts(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getContact = async (id) => {
    setLoading(true);
    try {
      const response = await getContactRequest(id);
      return response.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (contact) => {
    setLoading(true);
    try {
      const response = await createContactRequest(contact);
      setContacts((prevContacts) => [...prevContacts, response.data]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (id, contact) => {
    setLoading(true);
    try {
      await updateContactRequest(id, contact);
      setContacts((prevContacts) =>
        prevContacts.map((ct) => (ct.id === id ? { ...ct, ...contact } : ct))
      );
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id) => {
    setLoading(true);
    try {
      await deleteContactRequest(id);
      setContacts((prevContacts) => prevContacts.filter((ct) => ct.id !== id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts,
        loading,
        error,
        getContacts,
        getContact,
        createContact,
        updateContact,
        deleteContact,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};
