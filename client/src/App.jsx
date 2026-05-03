// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import Dashboard from './pages/Dashboard';
import Playeras from './pages/catalog/Playeras';
import Gorras from './pages/catalog/Gorras';
import Hoodies from './pages/catalog/Hoodies';
import Pantalones from './pages/catalog/Pantalones';
import Pana from './pages/catalog/Pana';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Ruta principal del catálogo - muestra el menú de categorías */}
              <Route 
                path="/catalog" 
                element={
                  <PrivateRoute>
                    <Catalog />
                  </PrivateRoute>
                } 
              />
              
              {/* Rutas de editores por categoría */}
              <Route 
                path="/catalog/playeras" 
                element={
                  <PrivateRoute>
                    <Playeras />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/catalog/gorras" 
                element={
                  <PrivateRoute>
                    <Gorras />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/catalog/hoodies" 
                element={
                  <PrivateRoute>
                    <Hoodies />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/catalog/pantalones" 
                element={
                  <PrivateRoute>
                    <Pantalones />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/catalog/pana" 
                element={
                  <PrivateRoute>
                    <Pana />
                  </PrivateRoute>
                } 
              />
              
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              {/* Redirección por defecto */}
              <Route path="/" element={<Navigate to="/catalog" />} />
            </Routes>
          </div>
        </ProductProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;