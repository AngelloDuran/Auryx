import React, { useState } from "react";
import DesignEditor from "../../components/DesignEditor";
import Player3DViewer from "../../components/Player3DViewer";
import hoddieImg from "../../assets/hoddie.png";

const Hoodies = () => (
  <DesignEditor title="Sudaderas" 
  baseImage={hoddieImg}
  modelPath="/models/hoddie.glb" 
  modelScale={1.2} 
  modelCameraDistance={1}
  type="hoodie" 
  defaultPosition={{ x: 120, y: 120, width: 150, height: 150 }} />
);
export default Hoodies;