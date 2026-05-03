import React, { useState } from "react";
import DesignEditor from "../../components/DesignEditor";
import Player3DViewer from "../../components/Player3DViewer";
import gorraImg from "../../assets/gorra.webp";

const Gorras = () => {
  const [currentDesign, setCurrentDesign] = useState(null);
  const [currentColor, setCurrentColor] = useState("#ffffff");
  const [show3D, setShow3D] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Editor de Gorras</h1>
          <button
            onClick={() => setShow3D(!show3D)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg"
          >
            {show3D ? "🎨 Modo 2D" : "🔄 Vista 3D"}
          </button>
        </div>

        {show3D ? (
          <Player3DViewer
            modelPath="/models/tshirt.glb"  // o "/models/gorra.glb"
            designImage={currentDesign}
            color={currentColor}
            autoRotate={true}
            showControls={true}
          />
        ) : (
          <DesignEditor
            title="Gorras"
            baseImage={gorraImg}
            type="gorra"
            defaultPosition={{ x: 100, y: 80, width: 140, height: 140 }}
            onDesignUpdate={setCurrentDesign}
            onColorChange={setCurrentColor}
          />
        )}
      </div>
    </div>
  );
};

export default Gorras;