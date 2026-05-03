// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Bienvenido a Auryx</h1>
        <p className="text-lg mb-6">
          Diseña y personaliza tu ropa con inteligencia artificial en tiempo real.
        </p>
        <Link
          to="/catalogo"
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-200 transition"
        >
          Explorar Plantillas
        </Link>
      </section>

      {/* Catálogo Preview */}
      <section className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">Catálogo de Plantillas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition">
            <span className="text-5xl">👕</span>
            <p className="mt-2 font-semibold">Playeras</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition">
            <span className="text-5xl">👖</span>
            <p className="mt-2 font-semibold">Pantalones</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition">
            <span className="text-5xl">🧢</span>
            <p className="mt-2 font-semibold">Gorras</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition">
            <span className="text-5xl">🧥</span>
            <p className="mt-2 font-semibold">Hoodies</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition">
            <span className="text-5xl">👖</span>
            <p className="mt-2 font-semibold">Pana</p>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-gray-50 py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-10">¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-xl mb-2">1. Elige una plantilla</h3>
            <p>Selecciona la prenda que quieras personalizar.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-xl mb-2">2. Diseña tu estilo</h3>
            <p>Sube tu diseño y ajusta colores, tamaño y posición.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold text-xl mb-2">3. Haz tu pedido</h3>
            <p>Guarda, añade al carrito y recibe tu prenda en casa.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Empieza a crear tu estilo</h2>
        <p className="mb-6">Únete a Auryx y personaliza tus prendas hoy mismo.</p>
        <Link
          to="/register"
          className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow hover:bg-gray-200 transition"
        >
          Registrarse
        </Link>
      </section>
    </div>
  );
};

export default Home;
