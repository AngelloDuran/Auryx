import axios from "axios";

const API = axios.create({
  baseURL: 'http://localhost:8000',
});

export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// Google Login redirige al backend
export const googleLogin = () => {
  window.location.href = `${'http://localhost:8000'}/auth/google/login`;
};
