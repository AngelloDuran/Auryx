import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

// Páginas del catálogo
import Catalog from "./pages/Catalog";
import Playeras from "./pages/catalog/Playeras";
import Pantalones from "./pages/catalog/Pantalones";
import Gorras from "./pages/catalog/Gorras";
import Hoodies from "./pages/catalog/Hoodies";
import Pana from "./pages/catalog/Pana";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Catalog />} />

          {/* Subrutas del catálogo */}
          <Route path="/catalog/playeras" element={<Playeras />} />
          <Route path="/catalog/pantalones" element={<Pantalones />} />
          <Route path="/catalog/gorras" element={<Gorras />} />
          <Route path="/catalog/hoodies" element={<Hoodies />} />
          <Route path="/catalog/pana" element={<Pana />} />

          {/* Rutas privadas */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
