import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserDesigns, deleteDesign } from "../services/api";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [previewDesign, setPreviewDesign] = useState(null);

  useEffect(() => {
    if (token) loadDesigns();
  }, [token]);

  const loadDesigns = async () => {
    setLoading(true);
    try {
      const data = await getUserDesigns();
      setDesigns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este diseño?")) {
      try {
        await deleteDesign(id);
        setDesigns(designs.filter((d) => d.id !== id));
      } catch (err) {
        alert("Error al eliminar el diseño");
      }
    }
  };

  const filteredDesigns = selectedType === "all"
    ? designs
    : designs.filter((d) => d.type === selectedType);

  const types = [
    { id: "all",      name: "Todos",      icon: "🗂️" },
    { id: "playera",  name: "Playeras",   icon: "👕" },
    { id: "gorra",    name: "Gorras",     icon: "🧢" },
    { id: "hoodie",   name: "Hoodies",    icon: "👔" },
    { id: "pantalon", name: "Pantalones", icon: "👖" },
    { id: "pana",     name: "Pana",       icon: "🧥" },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-2xl shadow-md text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-4">
            No tienes acceso. Por favor inicia sesión.
          </h2>
          <Link
            to="/login"
            className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-xl transition"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          Cargando tus diseños...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">

        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Mis Diseños
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Hola{" "}
            <span className="font-semibold text-violet-600 dark:text-violet-400">
              {user.name || user.email}
            </span>
            , aquí puedes ver todos tus diseños creados
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-8">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                selectedType === type.id
                  ? "bg-violet-600 text-white border-violet-600 shadow"
                  : "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500"
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>

        {/* Grid vacío */}
        {filteredDesigns.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">
              No tienes diseños guardados
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              ¡Empieza a crear tus propias prendas personalizadas!
            </p>
            <Link
              to="/catalog"
              className="inline-block bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-semibold transition"
            >
              Crear diseño
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                onClick={() => setPreviewDesign(design)}
                className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Imagen */}
                <div className="relative pb-[100%] bg-gray-100 dark:bg-gray-800">
                  <img
                    src={design.imageData}
                    alt={design.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black/70 text-white px-3 py-1 rounded-full text-sm transition">
                      Ver diseño
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                    {design.name}
                  </h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {types.find((t) => t.id === design.type)?.name || design.type}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(design.createdAt).toLocaleDateString("es-MX")}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewDesign(design); }}
                      className="flex-1 px-3 py-1.5 text-sm bg-violet-500 hover:bg-violet-600 text-white rounded-lg transition"
                    >
                      Ver
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(design.id); }}
                      className="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal preview */}
      {previewDesign && (
        <div
          className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewDesign(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {previewDesign.name}
              </h2>
              <button
                onClick={() => setPreviewDesign(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-xl"
              >
                ×
              </button>
            </div>

            {/* Contenido modal */}
            <div className="p-4">
              <img
                src={previewDesign.imageData}
                alt={previewDesign.name}
                className="w-full rounded-xl"
              />
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Tipo</span>
                  <p className="font-medium text-gray-900 dark:text-white capitalize mt-0.5">
                    {types.find((t) => t.id === previewDesign.type)?.name || previewDesign.type}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Fecha</span>
                  <p className="font-medium text-gray-900 dark:text-white mt-0.5">
                    {new Date(previewDesign.createdAt).toLocaleDateString("es-MX")}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                  <span className="text-gray-500 dark:text-gray-400 text-xs">Estado</span>
                  <p className="font-medium text-gray-900 dark:text-white capitalize mt-0.5">
                    {previewDesign.status}
                  </p>
                </div>
              </div>

              {previewDesign.configuration && (
                <details className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <summary className="cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">
                    Configuración del diseño
                  </summary>
                  <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-auto max-h-40 text-gray-700 dark:text-gray-300">
                    {typeof previewDesign.configuration === "string"
                      ? previewDesign.configuration
                      : JSON.stringify(previewDesign.configuration, null, 2)}
                  </pre>
                </details>
              )}
            </div>

            {/* Footer modal */}
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.download = `auryx-${previewDesign.name}.png`;
                  link.href = previewDesign.imageData;
                  link.click();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition"
              >
                Descargar imagen
              </button>
              <button
                onClick={() => setPreviewDesign(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;