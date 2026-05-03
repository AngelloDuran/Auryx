import React, { useState } from "react";
import playeraImg from "../assets/playera2D.avif";

const TshirtEditor = () => {
  const [design, setDesign] = useState(null);
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [size, setSize] = useState({ width: 150, height: 150 });
  const [rotation, setRotation] = useState(0);
  const [tshirtColor, setTshirtColor] = useState("#ffffff"); // Color inicial blanco

  const handleDesignUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setDesign(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    setPosition({
      x: e.clientX - e.target.offsetWidth / 2,
      y: e.clientY - e.target.offsetHeight / 2,
    });
  };

  const handleResize = (e) => {
    setSize({
      width: e.target.value,
      height: e.target.value,
    });
  };

  const handleRotate = (e) => {
    setRotation(e.target.value);
  };

  const handleColorChange = (e) => {
    setTshirtColor(e.target.value);
  };

  const handleDownload = () => {
    const tshirt = document.getElementById("tshirt-canvas");
    const link = document.createElement("a");
    link.download = "mi-diseño.png";
    link.href = tshirt.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-bold">Editor de Playeras</h1>

      {/* Selector de color */}
      <div className="flex items-center gap-3">
        <label className="font-medium">Color de la playera:</label>
        <input
          type="color"
          value={tshirtColor}
          onChange={handleColorChange}
          className="w-10 h-10 border rounded-full cursor-pointer"
        />
      </div>

      {/* Contenedor de playera */}
      <div className="relative w-[400px] h-[500px] flex items-center justify-center">
        <img
          src={playeraImg}
          alt="Playera"
          style={{
            width: "400px",
            height: "auto",
            filter: `brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(1) contrast(1) drop-shadow(0px 0px 2px #000)`,
            mixBlendMode: "multiply",
            backgroundColor: tshirtColor,
            borderRadius: "10px",
          }}
        />

        {/* Diseño subido */}
        {design && (
          <img
            src={design}
            alt="Diseño"
            draggable
            onDragEnd={handleDrag}
            style={{
              position: "absolute",
              left: position.x,
              top: position.y,
              width: `${size.width}px`,
              height: `${size.height}px`,
              transform: `rotate(${rotation}deg)`,
              cursor: "move",
            }}
          />
        )}
      </div>

      {/* Controles */}
      <div className="flex flex-col items-center gap-3">
        <label className="font-medium">Subir diseño:</label>
        <input type="file" accept="image/*" onChange={handleDesignUpload} />

        <label className="font-medium">Tamaño del diseño:</label>
        <input
          type="range"
          min="50"
          max="300"
          value={size.width}
          onChange={handleResize}
        />

        <label className="font-medium">Rotación del diseño:</label>
        <input
          type="range"
          min="0"
          max="360"
          value={rotation}
          onChange={handleRotate}
        />

        {/* Botón para descargar */}
        <button
          onClick={handleDownload}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg mt-4"
        >
          Descargar diseño
        </button>
      </div>
    </div>
  );
};

export default TshirtEditor;
