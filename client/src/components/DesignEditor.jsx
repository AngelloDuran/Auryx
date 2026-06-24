//DesignEditor.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import { saveDesign } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Player3DViewer from "./Player3DViewer";

const ZONES_FRONT = [
  { id: "front",        label: "FRONT",       x: 110, y: 130, w: 180, h: 200, color: "rgba(139,92,246,0.25)" },
  { id: "left_chest",   label: "L. CHEST",    x:  90, y: 120, w:  80, h:  80, color: "rgba(59,130,246,0.25)" },
  { id: "right_chest",  label: "R. CHEST",    x: 230, y: 120, w:  80, h:  80, color: "rgba(59,130,246,0.25)" },
  { id: "left_sleeve",  label: "L. SLEEVE",   x:  20, y: 140, w:  80, h:  90, color: "rgba(16,185,129,0.25)" },
  { id: "right_sleeve", label: "R. SLEEVE",   x: 300, y: 140, w:  80, h:  90, color: "rgba(16,185,129,0.25)" },
];

const ZONES_BACK = [
  { id: "back",     label: "BACK",     x: 110, y: 130, w: 180, h: 200, color: "rgba(239,68,68,0.25)"  },
  { id: "back_top", label: "BACK TOP", x: 140, y: 100, w: 120, h:  80, color: "rgba(245,158,11,0.25)" },
];

const Crosshair = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="absolute"
    style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none", zIndex: 5 }}>
    <line x1="8" y1="0" x2="8" y2="16" stroke="#ef4444" strokeWidth="1.5"/>
    <line x1="0" y1="8" x2="16" y2="8" stroke="#ef4444" strokeWidth="1.5"/>
    <circle cx="8" cy="8" r="2" fill="none" stroke="#ef4444" strokeWidth="1.5"/>
  </svg>
);

const DesignZone = ({ zone, isActive, isOccupied, onClick }) => (
  <div
    data-guide="true"
    onClick={onClick}
    style={{
      position: "absolute", left: zone.x, top: zone.y,
      width: zone.w, height: zone.h,
      background: isActive ? zone.color : "rgba(255,255,255,0.05)",
      border: `1.5px dashed ${isActive ? "#8b5cf6" : "#94a3b8"}`,
      borderRadius: 6, cursor: "pointer", zIndex: 10, transition: "all 0.2s",
    }}
  >
    <Crosshair />
    <span style={{
      position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)",
      fontSize: 8, fontWeight: 700, letterSpacing: 1,
      color: isActive ? "#8b5cf6" : "#94a3b8", whiteSpace: "nowrap", pointerEvents: "none",
    }}>
      {isOccupied ? "✓ " : ""}{zone.label}
    </span>
  </div>
);

// Utilidad: aproxima hue-rotate para CSS filter fallback
function getHueRotate(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  const max = Math.max(r,g,b), min = Math.min(r,g,b);
  if (max === min) return 0;
  let h = 0;
  if (max === r) h = ((g - b) / (max - min)) % 6;
  else if (max === g) h = (b - r) / (max - min) + 2;
  else h = (r - g) / (max - min) + 4;
  return Math.round(h * 60);
}

const DesignEditor = ({
  title, baseImage, backImage,
  modelPath = "/models/tshirt.glb",
  modelScale = 1, modelCameraDistance = 80,
  type, defaultPosition = { x: 120, y: 120, width: 150, height: 150 },
  onDesignUpdate, onColorChange,
}) => {
  const { token } = useAuth();
  const [editorMode, setEditorMode] = useState("2d");
  const [garmentView, setGarmentView] = useState("front");
  const [activeZoneId, setActiveZoneId] = useState(null);
  const [showGuides, setShowGuides] = useState(true);
  const [zoneDesigns, setZoneDesigns] = useState({});
  const [freeDesigns, setFreeDesigns] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [color, setColor] = useState("#ffffff");
  const [isSaving, setIsSaving] = useState(false);
  const [tolerance, setTolerance] = useState(240);
  const [coloredShirt, setColoredShirt] = useState(null);
  const [designTexture, setDesignTexture] = useState(null);

  const stageRef = useRef(null);
  const fileInputRef = useRef(null);
  const timeoutRef = useRef(null);

  const colors = ["#000000","#ffffff","#ef4444","#3b82f6","#22c55e","#f59e0b","#8b5cf6","#ec4899"];
  const currentZones = garmentView === "front" ? ZONES_FRONT : ZONES_BACK;
  const currentBaseImage = garmentView === "back" && backImage ? backImage : baseImage;

  // ── Recolorea solo los píxeles de la playera (no el fondo transparente)
  // Sin crossOrigin en imports locales para evitar error de CORS con Vite
  const applyShirtColor = useCallback((hexColor) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      let imageData;
      try {
        imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch {
        // Fallo de CORS: usa CSS filter como fallback visual
        setColoredShirt(null);
        return;
      }

      const data = imageData.data;
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);

      for (let i = 0; i < data.length; i += 4) {
        // Solo pinta píxeles visibles (alpha > 10), ignora el fondo transparente
        if (data[i + 3] > 10) {
          const br = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
          data[i]     = Math.round(r * br);
          data[i + 1] = Math.round(g * br);
          data[i + 2] = Math.round(b * br);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setColoredShirt(canvas.toDataURL("image/png"));
    };

    img.onerror = () => setColoredShirt(null);

    // crossOrigin solo para URLs externas; los imports de Vite son data URLs o blobs
    const isExternal = currentBaseImage.startsWith("http://") || currentBaseImage.startsWith("https://");
    if (isExternal) img.crossOrigin = "anonymous";

    img.src = currentBaseImage;
  }, [currentBaseImage]);

  // Recolorea al cambiar color o vista (front/back)
  useEffect(() => {
    applyShirtColor(color);
    if (onColorChange) onColorChange(color);
  }, [color, applyShirtColor, onColorChange]);

  useEffect(() => {
    applyShirtColor(color);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentBaseImage]);

    const captureAndNotify = useCallback(async () => {
    if (!stageRef.current) return;
    // Solo captura si estamos en modo 2D
    if (editorMode !== "2d") return; // ← AGREGA ESTO
  
    await new Promise(r => requestAnimationFrame(r));
    const guides = stageRef.current.querySelectorAll('[data-guide]');
    guides.forEach(g => { g.style.visibility = 'hidden'; });
    try {
      const canvas = await html2canvas(stageRef.current, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      scale: 1,
      logging: false,
      imageTimeout: 0,
  ignoreElements: (el) => el.tagName === "CANVAS", // ← AGREGA ESTO
});
    const dataUrl = canvas.toDataURL("image/png");
    setDesignTexture(dataUrl);
    if (onDesignUpdate) onDesignUpdate(dataUrl);
      } catch(e) { console.error("Capture error:", e); }
    finally { guides.forEach(g => { g.style.visibility = ''; }); }
}, [onDesignUpdate, editorMode]); // ← agrega editorMode a deps

  useEffect(() => {
  if (editorMode !== "2d") return; // ← también aquí
  if (timeoutRef.current) clearTimeout(timeoutRef.current);
  timeoutRef.current = setTimeout(captureAndNotify, 400);
  return () => clearTimeout(timeoutRef.current);
}, [zoneDesigns, freeDesigns, color, captureAndNotify, editorMode]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const src = reader.result;
      if (activeZoneId) {
        const zone = currentZones.find(z => z.id === activeZoneId);
        if (zone) {
          const w = zone.w * 0.8, h = zone.h * 0.8;
          setZoneDesigns(prev => ({ ...prev, [activeZoneId]: {
            id: Date.now(), src,
            x: zone.x + (zone.w - w) / 2, y: zone.y + (zone.h - h) / 2,
            width: w, height: h, rotation: 0,
          }}));
          setSelectedId(activeZoneId);
        }
      } else {
        const id = Date.now();
        setFreeDesigns(prev => [...prev, { id, src, ...defaultPosition, rotation: 0 }]);
        setSelectedId(`free-${id}`);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const updateZoneDesign = (zoneId, patch) =>
    setZoneDesigns(prev => ({ ...prev, [zoneId]: { ...prev[zoneId], ...patch } }));
  const updateFreeDesign = (id, patch) =>
    setFreeDesigns(prev => prev.map(d => d.id === id ? { ...d, ...patch } : d));

  const deleteSelected = () => {
    if (!selectedId) return;
    if (typeof selectedId === "string" && selectedId.startsWith("free-")) {
      const id = parseInt(selectedId.replace("free-", ""));
      setFreeDesigns(prev => prev.filter(d => d.id !== id));
    } else {
      setZoneDesigns(prev => { const n = { ...prev }; delete n[selectedId]; return n; });
    }
    setSelectedId(null);
  };

  const getSelectedDesign = () => {
    if (!selectedId) return null;
    if (typeof selectedId === "string" && selectedId.startsWith("free-")) {
      return freeDesigns.find(d => d.id === parseInt(selectedId.replace("free-", "")));
    }
    return zoneDesigns[selectedId] || null;
  };

  const updateSelected = (patch) => {
    if (!selectedId) return;
    if (typeof selectedId === "string" && selectedId.startsWith("free-")) {
      updateFreeDesign(parseInt(selectedId.replace("free-", "")), patch);
    } else { updateZoneDesign(selectedId, patch); }
  };

  const removeWhiteBackground = () => {
    const design = getSelectedDesign();
    if (!design) return;
    const img = new Image();
    img.src = design.src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width; canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] >= tolerance && data[i + 1] >= tolerance && data[i + 2] >= tolerance) data[i + 3] = 0;
      }
      ctx.putImageData(imageData, 0, 0);
      updateSelected({ src: canvas.toDataURL("image/png") });
    };
  };

  const captureStage = async (scale = 2) => {
    const guides = stageRef.current?.querySelectorAll('[data-guide]');
    guides?.forEach(g => { g.style.visibility = 'hidden'; });
    const canvas = await html2canvas(stageRef.current, {
    backgroundColor: null, useCORS: true, allowTaint: true, scale, ignoreElements: (el) => el.tagName === "CANVAS", // ← AGREGA ESTO
    });
    guides?.forEach(g => { g.style.visibility = ''; });
    return canvas;
  };

  const handleSave = async () => {
    if (!token) { alert("Debes iniciar sesión"); return; }
    setIsSaving(true);
    try {
      const canvas = await captureStage(2);
      await saveDesign({
        name: `${title} ${new Date().toLocaleString()}`,
        imageData: canvas.toDataURL("image/png"),
        type,
        configuration: JSON.stringify({ zoneDesigns, freeDesigns, color }),
      });
      alert("¡Diseño guardado exitosamente!");
    } catch { alert("Error al guardar"); }
    finally { setIsSaving(false); }
  };

  const handleDownload = async () => {
    try {
      const canvas = await captureStage(2);
      const link = document.createElement("a");
      link.download = `auryx-${type}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch { alert("Error al descargar"); }
  };

  const switchTo3D = async () => {
    await captureAndNotify();
    setEditorMode("3d");
  };

  const selectedDesign = getSelectedDesign();
  const occupiedZones = Object.keys(zoneDesigns);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4">

        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">{title}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Personaliza tu prenda con tus imágenes</p>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-sm">
            <button onClick={() => setEditorMode("2d")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${editorMode === "2d" ? "bg-violet-600 text-white shadow" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
              ✏️ 2D
            </button>
            <button onClick={switchTo3D}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${editorMode === "3d" ? "bg-violet-600 text-white shadow" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}>
              ✦ 3D
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:flex-1">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl p-6 transition-colors duration-300">

              {/* MODO 2D */}
              <div style={{ display: editorMode === "2d" ? "block" : "none" }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    {["front","back"].map(v => (
                      <button key={v}
                        onClick={() => { setGarmentView(v); setActiveZoneId(null); setSelectedId(null); }}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${garmentView === v ? "bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow" : "text-gray-500 dark:text-gray-400"}`}>
                        {v === "front" ? "⬛ FRONT" : "⬜ BACK"}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowGuides(g => !g)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition font-medium ${showGuides ? "border-violet-400 text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20" : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"}`}>
                    {showGuides ? "🔲 Ocultar guías" : "🔲 Mostrar guías"}
                  </button>
                </div>

                <div className="flex justify-center">
                  <div ref={stageRef} className="relative" style={{ width: 400, height: "auto" }}
                    onClick={() => { setSelectedId(null); setActiveZoneId(null); }}>

                    <img
                      src={coloredShirt || currentBaseImage}
                      alt={title}
                      className="w-[400px] h-auto pointer-events-none select-none"
                      style={
                        // Fallback: si el canvas falló (CORS) y el color no es blanco,
                        // usamos CSS filter para aproximar el color visualmente
                        !coloredShirt && color !== "#ffffff"
                          ? { filter: `sepia(1) saturate(3) hue-rotate(${getHueRotate(color)}deg)` }
                          : {}
                      }
                    />

                    {showGuides && currentZones.map(zone => (
                      <DesignZone key={zone.id} zone={zone}
                        isActive={activeZoneId === zone.id}
                        isOccupied={occupiedZones.includes(zone.id)}
                        onClick={(e) => { e.stopPropagation(); setActiveZoneId(zone.id); setSelectedId(zone.id); }} />
                    ))}

                    {Object.entries(zoneDesigns).map(([zoneId, d]) => (
                      <Rnd key={zoneId} size={{ width: d.width, height: d.height }} position={{ x: d.x, y: d.y }}
                        onDragStop={(e, data) => updateZoneDesign(zoneId, { x: data.x, y: data.y })}
                        onResizeStop={(e, dir, ref, delta, pos) => updateZoneDesign(zoneId, { width: parseFloat(ref.style.width), height: parseFloat(ref.style.height), ...pos })}
                        bounds="parent"
                        onMouseDown={(e) => { e.stopPropagation(); setSelectedId(zoneId); setActiveZoneId(zoneId); }}
                        style={{ zIndex: 30 }}
                        className={selectedId === zoneId ? "ring-2 ring-violet-500 ring-offset-1 rounded" : ""}>
                        <div className="w-full h-full" style={{ transform: `rotate(${d.rotation}deg)` }}>
                          <img src={d.src} alt="" className="w-full h-full object-contain pointer-events-none" />
                        </div>
                      </Rnd>
                    ))}

                    {freeDesigns.map(d => (
                      <Rnd key={d.id} size={{ width: d.width, height: d.height }} position={{ x: d.x, y: d.y }}
                        onDragStop={(e, data) => updateFreeDesign(d.id, { x: data.x, y: data.y })}
                        onResizeStop={(e, dir, ref, delta, pos) => updateFreeDesign(d.id, { width: parseFloat(ref.style.width), height: parseFloat(ref.style.height), ...pos })}
                        bounds="parent"
                        onMouseDown={(e) => { e.stopPropagation(); setSelectedId(`free-${d.id}`); }}
                        style={{ zIndex: 30 }}
                        className={selectedId === `free-${d.id}` ? "ring-2 ring-violet-500 ring-offset-1 rounded" : ""}>
                        <div className="w-full h-full" style={{ transform: `rotate(${d.rotation}deg)` }}>
                          <img src={d.src} alt="" className="w-full h-full object-contain pointer-events-none" />
                        </div>
                      </Rnd>
                    ))}
                  </div>
                </div>

                {showGuides && (
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {currentZones.map(z => (
                      <span key={z.id} onClick={() => setActiveZoneId(z.id === activeZoneId ? null : z.id)}
                        className={`text-xs px-2 py-1 rounded-full border cursor-pointer transition font-medium ${
                          activeZoneId === z.id ? "bg-violet-100 dark:bg-violet-900/40 border-violet-400 text-violet-700 dark:text-violet-300"
                          : occupiedZones.includes(z.id) ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 text-emerald-700 dark:text-emerald-400"
                          : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"}`}>
                        {occupiedZones.includes(z.id) ? "✓ " : ""}{z.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* MODO 3D — siempre montado en DOM, nunca destruido */}
              <div style={{ display: editorMode === "3d" ? "block" : "none" }}>
                <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-3">
                  Vista previa 3D · Arrastra para rotar
                </p>
                <Player3DViewer
                  modelPath={modelPath}
                  color={color}
                  designTexture={designTexture}
                  autoRotate={true}
                  showControls={true}
                  cameraDistance={modelCameraDistance}
                  scale={modelScale}
                  height="h-96"
                />
              </div>

            </div>
          </div>

          {/* PANEL HERRAMIENTAS */}
          <div className="lg:w-80">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl p-6 sticky top-20 transition-colors duration-300 space-y-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Herramientas</h3>

              {editorMode === "2d" && (
                <div className={`p-3 rounded-xl border text-xs font-medium transition ${activeZoneId ? "bg-violet-50 dark:bg-violet-900/20 border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300" : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"}`}>
                  {activeZoneId ? `🎯 Zona activa: ${currentZones.find(z => z.id === activeZoneId)?.label}` : "👆 Haz clic en una zona para activarla o sube imagen libre"}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {activeZoneId ? `Subir imagen → ${currentZones.find(z => z.id === activeZoneId)?.label}` : "Subir imagen (libre)"}
                </label>
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleUpload} ref={fileInputRef}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 dark:file:bg-violet-900/30 dark:file:text-violet-400 hover:file:bg-violet-100 dark:hover:file:bg-violet-900/50" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color de prenda</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(c => (
                    <button key={c} onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition ${color === c ? "border-violet-500 scale-110" : "border-gray-300 dark:border-gray-600"}`}
                      style={{ backgroundColor: c }} />
                  ))}
                  <input type="color" value={color} onChange={e => setColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border border-gray-300 dark:border-gray-600" />
                </div>
              </div>

              {selectedDesign && (
                <>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 space-y-2">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Quitar fondo blanco</p>
                    <button onClick={removeWhiteBackground}
                      className="w-full py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm transition">
                      🪄 Quitar fondo
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Tol:</span>
                      <input type="range" min="200" max="255" value={tolerance} onChange={e => setTolerance(Number(e.target.value))} className="flex-1 accent-violet-500" />
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-8">{tolerance}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Rotación: {selectedDesign.rotation}°</label>
                    <input type="range" min="0" max="360" value={selectedDesign.rotation} onChange={e => updateSelected({ rotation: Number(e.target.value) })} className="w-full accent-violet-500" />
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => updateSelected({ rotation: ((selectedDesign.rotation - 15) + 360) % 360 })}
                        className="flex-1 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition">-15°</button>
                      <button onClick={() => updateSelected({ rotation: (selectedDesign.rotation + 15) % 360 })}
                        className="flex-1 py-1 text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition">+15°</button>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2 pt-2">
                {selectedDesign && (
                  <button onClick={deleteSelected} className="w-full py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-xl transition">
                    🗑 Eliminar seleccionado
                  </button>
                )}
                <button onClick={handleDownload} className="w-full py-2 text-sm bg-gray-700 hover:bg-gray-800 text-white rounded-xl transition">
                  ⬇️ Descargar PNG
                </button>
                <button onClick={handleSave} disabled={isSaving}
                  className="w-full py-2 text-sm bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-xl transition disabled:opacity-50 font-semibold">
                  {isSaving ? "Guardando..." : "💾 Guardar diseño"}
                </button>
              </div>

              <div className="p-3 bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30 rounded-xl">
                <p className="text-xs font-semibold text-violet-800 dark:text-violet-300 mb-1">💡 Tips</p>
                <ul className="text-xs text-violet-700 dark:text-violet-400 space-y-0.5">
                  <li>• Haz clic en una zona para activarla</li>
                  <li>• Sube tu imagen y se colocará centrada</li>
                  <li>• Arrastra y redimensiona libremente</li>
                  <li>• Usa el toggle 3D para previsualizar</li>
                  <li>• PNG con fondo transparente = mejor resultado</li>
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