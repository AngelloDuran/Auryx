import React from "react";
import { Link, Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">Auryx</Link>
        <div className="flex gap-6">
          <Link to="/catalogo" className="hover:text-blue-600">Catálogo</Link>
          <Link to="/editor" className="hover:text-blue-600">Editor</Link>
          <Link to="/carrito" className="hover:text-blue-600">Carrito</Link>
          <Link to="/profile" className="hover:text-blue-600">Perfil</Link>
        </div>
      </nav>

      {/* Contenido dinámico */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-6 mt-10">
        © {new Date().getFullYear()} Auryx - Personaliza tu estilo
      </footer>
    </div>
  );
};

export default AppLayout;
