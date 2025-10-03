import React, { createContext, useState, useEffect, useContext } from "react";
import { login as loginAPI, register as registerAPI } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = async (credentials) => {
    try {
      const res = await loginAPI(credentials);
      setToken(res.data.access_token);
      setUser(res.data.user);
    } catch (error) {
      console.error("Error en login:", error.response?.data || error.message);
    }
  };

  const register = async (data) => {
    try {
      const res = await registerAPI(data);
      setToken(res.data.access_token);
      setUser(res.data.user);
    } catch (error) {
      console.error("Error en register:", error.response?.data || error.message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
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
