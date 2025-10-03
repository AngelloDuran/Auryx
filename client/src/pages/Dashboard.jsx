import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <h2 className="text-xl font-semibold text-gray-700">
          No tienes acceso. Por favor inicia sesión.
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Bienvenido 🚀</h1>
        <p className="text-gray-700 mb-6">
          Hola <span className="font-semibold">{user.name || user.email}</span>, 
          has iniciado sesión correctamente.
        </p>

        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
