import React, { useState } from "react";
import DesignEditor from "../../components/DesignEditor";
import Player3DViewer from "../../components/Player3DViewer";
import panaImg from "../../assets/pans.png";  // 👈 cambia a la imagen de pana

const Pana = () => {
  const [currentDesign, setCurrentDesign] = useState(null);
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const [show3D, setShow3D] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Editor de Pans</h1>  {/* 👈 texto correcto */}
          <button
            onClick={() => setShow3D(!show3D)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            {show3D ? "🎨 Modo 2D" : "🔄 Vista 3D"}
          </button>
        </div>

        {show3D ? (
          <Player3DViewer
            modelPath="/models/tshirt.glb"
            designImage={currentDesign}
            color={currentColor}
            autoRotate={true}
            showControls={true}
          />
        ) : (
          <DesignEditor
            title="Pans"                         // 👈 título correcto
            baseImage={panaImg}                  // 👈 imagen de pana
            type="pans"                          // 👈 tipo correcto
            defaultPosition={{ x: 110, y: 85, width: 155, height: 155 }} // posición ajustada
            onDesignUpdate={setCurrentDesign}
            onColorChange={setCurrentColor}
          />
        )}
      </div>
    </div>
  );
};

export default Pana;