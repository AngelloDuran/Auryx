import React, { createContext, useState, useEffect, useContext } from "react";
import { login as loginAPI, register as registerAPI } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await loginAPI(credentials);
      // 👈 La respuesta de loginAPI ya es el objeto directamente
      // En api.js, estamos devolviendo { data } o directamente los datos?
      // Según tu api.js, login devuelve { data }
      const { token, id, email, name } = response.data;
      
      setToken(token);
      const userData = { id, email, name };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await registerAPI(data);
      // El registro no devuelve token, solo los datos del usuario
      const { id, email, name } = response.data;
      const userData = { id, email, name };
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error("Error en register:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};