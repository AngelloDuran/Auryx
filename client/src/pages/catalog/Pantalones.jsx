import React, { useState } from "react";
import DesignEditor from "../../components/DesignEditor";
import Player3DViewer from "../../components/Player3DViewer";
import pantalonImg from "../../assets/pants.png";

const Pantalones = () => (
  <DesignEditor title="Pantalones" 
  baseImage={pantalonImg}
    modelPath="/models/pants.glb" 
    modelScale={1} modelCameraDistance={3200}
    type="pantalon" 
    defaultPosition={{ x: 120, y: 150, width: 120, height: 180 }} />
);
export default Pantalones;