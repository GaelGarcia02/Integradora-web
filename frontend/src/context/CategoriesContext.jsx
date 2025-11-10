import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCategoriesRequest,
  getCategoryRequest,
  createCategoryRequest,
  updateCategoryRequest,
  deleteCategoryRequest,
} from "../api/category.api";

const CategoriesContext = createContext();

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
};

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategoriesRequest();
      setCategories(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getCategory = async (id) => {
    try {
      const response = await getCategoryRequest(id);
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const createCategory = async (category) => {
    setLoading(true);
    try {
      await createCategoryRequest(category);
      await getCategories();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id, category) => {
    setLoading(true);
    try {
      await updateCategoryRequest(id, category); // Actualiza la BD
      await getCategories(); // Pide la lista fresca
    } catch (error) {
      console.error(`Error updating category with ID ${id}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteCategoryRequest(id);
      await getCategories();
    } catch (error) {
      console.error(`Error deleting category with ID ${id}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        error,
        getCategory,
        getCategories,
        createCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};
