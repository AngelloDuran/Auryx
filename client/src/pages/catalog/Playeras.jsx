import React, { useState } from "react";
import DesignEditor from "../../components/DesignEditor";
import Player3DViewer from "../../components/Player3DViewer";
import playeraImg from "../../assets/playera2D.svg";

const Playeras = () => {
  const [currentDesign, setCurrentDesign] = useState(null);
  const [show3D, setShow3D] = useState(false);
  
  const handleDesignUpdate = (designData) => {
    setCurrentDesign(designData);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Toggle 3D View */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShow3D(!show3D)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition"
          >
            <span>{show3D ? "🎨" : "🔄"}</span>
            {show3D ? "Ver editor 2D" : "Ver vista 3D"}
          </button>
        </div>
        
        {show3D ? (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-center mb-4">Vista Previa 3D</h2>
            <Player3DViewer 
              designImage={currentDesign || playeraImg}
              color="#ececec"
              autoRotate={true}
            />
            <p className="text-center text-gray-500 mt-4">
              🖱️ Arrastra para rotar la playera en 360°
            </p>
            <div className="mt-4 text-center text-sm text-gray-400">
              Nota: La vista 3D es una demostración interactiva
            </div>
          </div>
        ) : (
          <DesignEditor
            title="Editor de Playeras"
            baseImage={playeraImg}
            type="playera"
            defaultPosition={{ x: 120, y: 120, width: 150, height: 150 }}
            onDesignUpdate={handleDesignUpdate}
          />
        )}
      </div>
    </div>
  );
};

export default Playeras;