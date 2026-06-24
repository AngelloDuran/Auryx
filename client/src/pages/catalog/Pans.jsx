import React, { useState } from "react";
import DesignEditor from "../../components/DesignEditor";
import Player3DViewer from "../../components/Player3DViewer";
import pansImg from "../../assets/pans.png";  // 👈 cambia a la imagen de pana

const Pans = () => (
  <DesignEditor title="Pans" 
  baseImage={pansImg}
    modelPath="/models/pans.glb" 
    modelScale={0.3} 
    modelCameraDistance={80}
    type="pana" 
    defaultPosition={{ x: 120, y: 150, width: 120, height: 180 }} />
);
export default Pans;