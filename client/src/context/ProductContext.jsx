// client/src/context/ProductContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProducts, getProductsByCategory, searchProducts } from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Cargar todos los productos
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos por categoría
  const loadProductsByCategory = async (category) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(category);
    try {
      let data;
      if (category === 'all') {
        data = await getProducts();
      } else {
        data = await getProductsByCategory(category);
      }
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading products by category:', err);
    } finally {
      setLoading(false);
    }
  };

  // Buscar productos
  const searchProductsByName = async (searchTerm) => {
    if (!searchTerm.trim()) {
      await loadProducts();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(searchTerm);
      setProducts(data);
    } catch (err) {
      setError(err.message);
      console.error('Error searching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos al iniciar
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      selectedCategory,
      loadProducts,
      loadProductsByCategory,
      searchProductsByName,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);