import React, { useRef, useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import { saveDesign } from "../services/api";
import { useAuth } from "../context/AuthContext";

const DesignEditor = ({ 
  title, 
  baseImage, 
  type, 
  defaultPosition = { x: 120, y: 120, width: 150, height: 150 },
  onDesignUpdate,   // nueva prop
  onColorChange     // nueva prop
}) => {
  const { token } = useAuth();
  const [designs, setDesigns] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [color, setColor] = useState("#ffffff");
  const [isSaving, setIsSaving] = useState(false);
  const [tolerance, setTolerance] = useState(240);
  const stageRef = useRef(null);
  const fileInputRef = useRef(null);
  const timeoutRef = useRef(null);

  const colors = [
    "#000000", "#ffffff", "#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899"
  ];

  // Notificar al padre cuando el color cambia
  useEffect(() => {
    if (onColorChange) onColorChange(color);
  }, [color, onColorChange]);

  // Capturar la imagen actual del canvas y enviarla al padre
  const captureAndNotify = async () => {
    if (!stageRef.current) return;
    if (!onDesignUpdate) return;
    try {
      const canvas = await html2canvas(stageRef.current, {
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        scale: 0.5, // escala reducida para mejor rendimiento
      });
      const imageData = canvas.toDataURL("image/png");
      onDesignUpdate(imageData);
    } catch (error) {
      console.error("Error capturing design for preview:", error);
    }
  };

  // Debounce para capturar después de cambios en diseños o color
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      captureAndNotify();
    }, 300);
    return () => clearTimeout(timeoutRef.current);
  }, [designs, color]);

  // El resto de las funciones originales (addDesign, handleUpload, etc.) se mantienen igual
  // ... (copia aquí todas las funciones existentes sin cambios)

  const addDesign = (src) => {
    const id = Date.now();
    setDesigns(prev => [...prev, { id, src, ...defaultPosition, rotation: 0 }]);
    setSelectedId(id);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => addDesign(reader.result);
    reader.readAsDataURL(file);
  };

  const updateDesign = (id, patch) => {
    setDesigns(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d));
  };

  const rotateSelected = (delta) => {
    if (!selectedId) return;
    const design = designs.find(d => d.id === selectedId);
    if (!design) return;
    const newRotation = (design.rotation + delta) % 360;
    updateDesign(selectedId, { rotation: newRotation });
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setDesigns(prev => prev.filter(d => d.id !== selectedId));
    setSelectedId(null);
  };

  const removeWhiteBackground = () => {
    if (!selectedId) return;
    const design = designs.find(d => d.id === selectedId);
    if (!design) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = design.src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i+1], b = data[i+2];
        if (r >= tolerance && g >= tolerance && b >= tolerance) {
          data[i+3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      const cleaned = canvas.toDataURL("image/png");
      updateDesign(selectedId, { src: cleaned });
    };
  };

  const handleSave = async () => {
    if (!token) {
      alert("Debes iniciar sesión para guardar tus diseños");
      return;
    }
    setIsSaving(true);
    try {
      const canvas = await html2canvas(stageRef.current, {
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        scale: 2,
      });
      const imageData = canvas.toDataURL("image/png");
      await saveDesign({
        name: `${title} ${new Date().toLocaleString()}`,
        imageData,
        type,
        configuration: JSON.stringify({ designs, color }),
      });
      alert("¡Diseño guardado exitosamente!");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el diseño");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      const canvas = await html2canvas(stageRef.current, {
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = `auryx-${type}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error al descargar:", error);
      alert("Error al descargar la imagen");
    }
  };

  const selectedDesign = designs.find(d => d.id === selectedId);

  // El JSX original se mantiene sin cambios
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-gray-500 mt-2">Personaliza tu prenda con tus imágenes</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Editor Panel */}
          <div className="lg:flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-center">
                <div ref={stageRef} className="relative" style={{ width: 400, height: "auto" }}>
                  <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundColor: color, zIndex: 1 }} />
                  <img
                    src={baseImage}
                    alt={title}
                    className="w-[400px] h-auto pointer-events-none select-none relative z-10"
                    style={{ mixBlendMode: "multiply" }}
                  />
                  {designs.map(d => (
                    <Rnd
                      key={d.id}
                      size={{ width: d.width, height: d.height }}
                      position={{ x: d.x, y: d.y }}
                      onDragStop={(e, data) => updateDesign(d.id, { x: data.x, y: data.y })}
                      onResizeStop={(e, dir, ref, delta, pos) =>
                        updateDesign(d.id, {
                          width: parseFloat(ref.style.width),
                          height: parseFloat(ref.style.height),
                          ...pos,
                        })
                      }
                      bounds="parent"
                      onMouseDown={() => setSelectedId(d.id)}
                      className={`group ${selectedId === d.id ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
                      style={{ zIndex: 20 }}
                    >
                      <div className="w-full h-full" style={{ transform: `rotate(${d.rotation}deg)` }}>
                        <img src={d.src} alt="Diseño" className="w-full h-full object-contain pointer-events-none" />
                      </div>
                    </Rnd>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="lg:w-96">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Herramientas</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Subir imagen</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleUpload}
                  ref={fileInputRef}
                  className="w-full text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Color de fondo</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        color === c ? "border-blue-500 scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <input
                    type="color"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-300"
                  />
                </div>
              </div>

              {selectedDesign && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Quitar fondo blanco</label>
                  <button
                    onClick={removeWhiteBackground}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-3"
                  >
                    🪄 Quitar fondo
                  </button>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-gray-600">Tolerancia:</label>
                    <input
                      type="range"
                      min="200"
                      max="255"
                      value={tolerance}
                      onChange={(e) => setTolerance(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600 w-12">{tolerance}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">A mayor tolerancia, más blancos se vuelven transparentes</p>
                </div>
              )}

              {selectedDesign && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rotación: {selectedDesign.rotation}°</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={selectedDesign.rotation}
                    onChange={e => updateDesign(selectedId, { rotation: Number(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => rotateSelected(-15)} className="flex-1 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200">-15°</button>
                    <button onClick={() => rotateSelected(15)} className="flex-1 px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200">+15°</button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {selectedDesign && (
                  <button onClick={deleteSelected} className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                    Eliminar diseño seleccionado
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  disabled={designs.length === 0}
                >
                  Descargar PNG
                </button>
                <button
                  onClick={handleSave}
                  className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
                  disabled={designs.length === 0 || isSaving}
                >
                  {isSaving ? "Guardando..." : "Guardar diseño"}
                </button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Tips</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Sube imágenes PNG con fondo blanco o transparente</li>
                  <li>• Usa "Quitar fondo" para eliminar fondos blancos</li>
                  <li>• Ajusta la tolerancia para mejor resultado</li>
                  <li>• Arrastra y redimensiona tus diseños</li>
                  <li>• Guarda tus creaciones en tu perfil</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignEditor;