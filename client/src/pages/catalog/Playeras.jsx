import React, { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import playeraImg from "../../assets/playera2D.png";

const Playeras = () => {
  const [designs, setDesigns] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [tolerance, setTolerance] = useState(240);
  const stageRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [color, setColor] = useState("#ffffff");
  const [talla, setTalla] = useState("M");
  const fileInputRef = useRef(null);

  const coloresDisponibles = [
    "#000000", "#ffffff", "#ff0000", "#0055ff", "#008000", "#ff9900", "#800080"
  ];

  const addDesign = (src) => {
    const id = Date.now();
    setDesigns((prev) => [
      ...prev,
      {
        id,
        src,
        x: 120,
        y: 120,
        width: 150,
        height: 150,
        rotation: 0,
      },
    ]);
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
    setDesigns((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const rotateSelected = (delta) => {
    if (!selectedId) return;
    const d = designs.find((x) => x.id === selectedId);
    if (!d) return;
    let next = (d.rotation + delta) % 360;
    if (next < 0) next += 360;
    updateDesign(selectedId, { rotation: next });
  };

  const removeWhiteBackgroundFor = (id, tol = tolerance) => {
    const d = designs.find((x) => x.id === id);
    if (!d) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = d.src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (r >= tol && g >= tol && b >= tol) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      const cleaned = canvas.toDataURL("image/png");
      updateDesign(id, { src: cleaned });
    };
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setDesigns((prev) => prev.filter((d) => d.id !== selectedId));
    setSelectedId(null);
  };

  const handleSave = () => {
    localStorage.setItem("playeraDesigns", JSON.stringify(designs));
    alert("Diseños guardados (simulación en localStorage)");
  };

  const handleDownload = async () => {
    if (!stageRef.current) return;
    const canvas = await html2canvas(stageRef.current, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = "auryx-playera.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const selected = designs.find((d) => d.id === selectedId);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Editor de Playeras</h2>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleUpload}
          ref={fileInputRef}
          className="block"
        />

        {/* Rotación */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => rotateSelected(-15)}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            title="Rotar -15°"
          >
            ↺ -15°
          </button>
          <button
            onClick={() => rotateSelected(15)}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            title="Rotar +15°"
          >
            ↻ +15°
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rotación:</span>
            <input
              type="range"
              min="0"
              max="360"
              value={selected?.rotation ?? 0}
              onChange={(e) => selectedId && updateDesign(selectedId, { rotation: Number(e.target.value) })}
            />
            <span className="text-sm w-10 text-right">{selected?.rotation ?? 0}°</span>
          </div>
        </div>

        {/* Quitar fondo del diseño seleccionado */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => selectedId && removeWhiteBackgroundFor(selectedId)}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={!selectedId}
            title="Quitar fondo blanco del diseño seleccionado"
          >
            Quitar fondo
          </button>
          <label className="text-sm text-gray-600">
            Tolerancia:
            <input
              className="ml-2 align-middle"
              type="range"
              min="200"
              max="255"
              value={tolerance}
              onChange={(e) => setTolerance(Number(e.target.value))}
            />
            <span className="ml-1">{tolerance}</span>
          </label>
        </div>

        {/* Acciones */}
        <button
          onClick={deleteSelected}
          className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          disabled={!selectedId}
        >
          Eliminar diseño
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          disabled={designs.length === 0}
        >
          Guardar
        </button>
        <button
          onClick={handleDownload}
          className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          disabled={designs.length === 0}
        >
          Descargar PNG
        </button>
      </div>

      {/* Paleta de Colores */}
      <div className="flex items-center gap-3 mb-4">
        {coloresDisponibles.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className="w-8 h-8 rounded-full border shadow cursor-pointer hover:scale-110 transition-transform"
            style={{
              backgroundColor: c,
              borderColor: c === "#ffffff" ? "#ccc" : c,
            }}
          />
        ))}
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-10 h-8 cursor-pointer rounded-md border border-gray-300"
        />
      </div>

      {/* Stage */}
      <div className="flex justify-center">
        <div ref={stageRef} className="relative" style={{ width: 400, height: "auto" }}>
          {/* Capa de color */}
          <div
            className="absolute top-0 left-0 w-full h-full"
            style={{ backgroundColor: color, zIndex: 1 }}
          ></div>

          {/* Imagen base con sombras */}
          <img
            src={playeraImg}
            alt="Playera"
            className="w-[400px] h-auto pointer-events-none select-none relative z-10"
            style={{ mixBlendMode: "multiply" }}
          />

          {/* Diseños */}
          {designs.map((d) => (
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
              className={`group ${selectedId === d.id ? "ring-2 ring-indigo-500" : ""}`}
              style={{ zIndex: 20 }}
            >
              <div
                className="w-full h-full relative"
                style={{ transform: `rotate(${d.rotation}deg)` }}
              >
                <img src={d.src} alt="Diseño" className="w-full h-full object-contain pointer-events-none select-none" />
                {selectedId === d.id && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs bg-black/70 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100">
                    Seleccionado
                  </div>
                )}
              </div>
            </Rnd>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-gray-500 mt-3">
        Consejo: sube imágenes PNG con fondo blanco o transparente para mejores resultados.
      </p>
    </div>
  );
};

export default Playeras;
