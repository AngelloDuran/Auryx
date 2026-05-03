// client/src/services/api.js
const API_URL = 'http://localhost:8080/api';

// ========== AUTENTICACIÓN ==========
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error en el login');
    return { data };
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error en el registro');
    return { data };
  } catch (error) {
    console.error('Register API error:', error);
    throw error;
  }
};

export const googleLogin = () => {
  window.location.href = 'http://localhost:8080/oauth2/authorization/google';
};

// ========== PRODUCTOS ==========
export const getProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener productos');
    return data;
  } catch (error) {
    console.error('Get products error:', error);
    throw error;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener productos por categoría');
    return data;
  } catch (error) {
    console.error('Get products by category error:', error);
    throw error;
  }
};

export const searchProducts = async (searchTerm) => {
  try {
    const response = await fetch(`${API_URL}/products/search?name=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error en la búsqueda');
    return data;
  } catch (error) {
    console.error('Search products error:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Producto no encontrado');
    return data;
  } catch (error) {
    console.error('Get product by id error:', error);
    throw error;
  }
};

export const getActiveProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products/active`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener productos activos');
    return data;
  } catch (error) {
    console.error('Get active products error:', error);
    throw error;
  }
};

// ========== DISEÑOS ==========
const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const saveDesign = async (designData) => {
  try {
    const response = await fetch(`${API_URL}/designs`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(designData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al guardar diseño');
    return data;
  } catch (error) {
    console.error('Save design error:', error);
    throw error;
  }
};

export const getUserDesigns = async () => {
  try {
    const response = await fetch(`${API_URL}/designs/user`, {
      method: 'GET',
      headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al obtener diseños');
    return data;
  } catch (error) {
    console.error('Get user designs error:', error);
    throw error;
  }
};

export const deleteDesign = async (id) => {
  try {
    const response = await fetch(`${API_URL}/designs/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Error al eliminar diseño');
    return data;
  } catch (error) {
    console.error('Delete design error:', error);
    throw error;
  }
};