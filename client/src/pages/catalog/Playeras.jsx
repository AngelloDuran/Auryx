import React from "react";
import DesignEditor from "../../components/DesignEditor";
import playeraImg from "../../assets/playera2D.png";

const Playeras = () => {
  return (
    <DesignEditor
      title="Editor de Playeras"
      baseImage={playeraImg}
      modelPath="/models/tshirt.glb"
      modelScale={1}
      modelCameraDistance={80}
      type="playera"
      defaultPosition={{ x: 120, y: 120, width: 150, height: 150 }}
    />
  );
};

export default Playeras;