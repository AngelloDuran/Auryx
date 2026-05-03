import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserDesigns, deleteDesign } from "../services/api";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("all");
  const [previewDesign, setPreviewDesign] = useState(null);

  // Cargar diseños al montar el componente
  useEffect(() => {
    if (token) {
      loadDesigns();
    }
  }, [token]);

  const loadDesigns = async () => {
    setLoading(true);
    try {
      const data = await getUserDesigns();
      setDesigns(data);
    } catch (err) {
      setError(err.message);
      console.error("Error loading designs:", err);
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
        console.error("Error deleting design:", err);
        alert("Error al eliminar el diseño");
      }
    }
  };

  const handlePreview = (design) => {
    setPreviewDesign(design);
  };

  const closePreview = () => {
    setPreviewDesign(null);
  };

  // Filtrar por tipo de prenda
  const filteredDesigns = selectedType === "all"
    ? designs
    : designs.filter((d) => d.type === selectedType);

  // Tipos de prenda disponibles
  const types = [
    { id: "all", name: "Todos", icon: "👕" },
    { id: "playera", name: "Playeras", icon: "👕" },
    { id: "gorra", name: "Gorras", icon: "🧢" },
    { id: "hoodie", name: "Hoodies", icon: "👔" },
    { id: "pantalon", name: "Pantalones", icon: "👖" },
    { id: "pana", name: "Pana", icon: "🧥" },
  ];

  // Si no hay usuario autenticado
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No tienes acceso. Por favor inicia sesión.
          </h2>
          <a
            href="/login"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Cargando tus diseños...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Mis Diseños</h1>
          <p className="text-gray-500 mt-2">
            Hola <span className="font-semibold">{user.name || user.email}</span>, aquí puedes ver todos tus diseños creados
          </p>
        </div>

        {/* Filtros por tipo */}
        <div className="flex flex-wrap gap-3 mb-8">
          {types.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                selectedType === type.id
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              <span className="text-xl">{type.icon}</span>
              <span>{type.name}</span>
            </button>
          ))}
        </div>

        {/* Grid de diseños */}
        {filteredDesigns.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No tienes diseños guardados
            </h3>
            <p className="text-gray-500 mb-4">
              ¡Empieza a crear tus propias prendas personalizadas!
            </p>
            <a
              href="/catalog"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Crear diseño
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredDesigns.map((design) => (
              <div
                key={design.id}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'rotateY(5deg) scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotateY(0deg) scale(1)';
                }}
                onClick={() => handlePreview(design)}
              >
                {/* Imagen del diseño */}
                <div className="relative pb-[100%] bg-gray-100">
                  <img
                    src={design.imageData}
                    alt={design.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                      Ver diseño
                    </span>
                  </div>
                </div>

                {/* Información */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {design.name}
                  </h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500 capitalize">
                      {types.find((t) => t.id === design.type)?.name || design.type}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(design.createdAt).toLocaleDateString("es-MX")}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(design);
                      }}
                      className="flex-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Ver
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(design.id);
                      }}
                      className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
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

      {/* Modal de vista previa */}
      {previewDesign && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closePreview}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">{previewDesign.name}</h2>
              <button
                onClick={closePreview}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <img
                src={previewDesign.imageData}
                alt={previewDesign.name}
                className="w-full rounded-lg"
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Tipo:</span>
                  <span className="ml-2 capitalize font-medium">
                    {types.find((t) => t.id === previewDesign.type)?.name || previewDesign.type}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Fecha:</span>
                  <span className="ml-2">
                    {new Date(previewDesign.createdAt).toLocaleString("es-MX")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Estado:</span>
                  <span className="ml-2 capitalize">{previewDesign.status}</span>
                </div>
              </div>
              {previewDesign.configuration && (
                <div className="mt-4">
                  <details className="text-xs text-gray-500">
                    <summary className="cursor-pointer">Configuración del diseño</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                      {typeof previewDesign.configuration === 'string'
                        ? previewDesign.configuration
                        : JSON.stringify(previewDesign.configuration, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end gap-3">
              <button
                onClick={() => {
                  const link = document.createElement("a");
                  link.download = `auryx-${previewDesign.name}.png`;
                  link.href = previewDesign.imageData;
                  link.click();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Descargar imagen
              </button>
              <button
                onClick={closePreview}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
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