import React, { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// =======================
// 👕 MODELO 3D
// =======================
const TShirtModel = ({ modelPath, color }) => {
  const groupRef = useRef();
  const { scene } = useGLTF(modelPath);
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  // 🎨 Color
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        child.material.side = THREE.DoubleSide;
        child.material.color.set(color);
      }
    });
  }, [clonedScene, color]);

  // 🔥 Auto-centrado usando Box3 con las dimensiones reales del modelo
  useEffect(() => {
    if (!groupRef.current) return;
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    groupRef.current.position.set(-center.x, -center.y, -center.z);
  }, [clonedScene]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
};

// =======================
// 🎮 VISOR PRINCIPAL
// =======================
const Player3DViewer = ({
  modelPath = '/models/tshirt.glb',
  color = '#ffffff',
  autoRotate = true,
  showControls = true,
  className = '',
}) => {
  // Detectar dark mode del html element para ajustar el fondo del canvas
  const isDark = document.documentElement.classList.contains('dark');
  const bgColor = isDark ? '#0f0f1a' : '#1e1b2e';

  return (
    <div className={`relative w-full h-96 rounded-2xl overflow-hidden ${className}`}
      style={{ background: bgColor }}
    >
      <Canvas
        camera={{ position: [0, 0, 80], fov: 45 }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(bgColor));
        }}
      >
        {/* 💡 Luces */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <directionalLight position={[-10, -10, -10]} intensity={0.4} />

        {/* 👕 Modelo */}
        <TShirtModel modelPath={modelPath} color={color} />

        {/* 🎮 Controles */}
        {showControls && (
          <OrbitControls
            target={[0, 0, 0]}
            enablePan={false}
            minDistance={30}
            maxDistance={150}
            autoRotate={autoRotate}
            autoRotateSpeed={1.2}
            enableDamping
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
        )}

        <Environment preset="studio" />
      </Canvas>

      {/* Instrucciones — solo si hay controles */}
      {showControls && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full pointer-events-none">
          🖱️ Arrastra para rotar · Scroll para zoom
        </div>
      )}

      {/* Badge 3D */}
      <div className="absolute top-3 right-3 bg-violet-600/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
        3D ✦
      </div>
    </div>
  );
};

export default Player3DViewer;