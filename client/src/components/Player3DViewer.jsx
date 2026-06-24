//Player3DViewer.jsx
import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

// =======================
// 📷 Actualiza la cámara sin destruir el Canvas
// =======================
const CameraUpdater = ({ distance }) => {
  const { camera, invalidate } = useThree();
  useEffect(() => {
    camera.position.set(0, 0, distance);
    camera.updateProjectionMatrix();
    invalidate();
  }, [distance, camera, invalidate]);
  return null;
};

// =======================
// 👕 MODELO 3D
// =======================
const TShirtModel = ({ modelPath, color, scale, designTexture }) => {
  const groupRef = useRef();
  const { scene } = useGLTF(modelPath);
  const clonedScene = React.useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!groupRef.current) return;
    const box = new THREE.Box3().setFromObject(groupRef.current);
    const center = new THREE.Vector3();
    box.getCenter(center);
    groupRef.current.position.set(-center.x, -center.y, -center.z);
  }, [clonedScene]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();

    const applyMaterials = (tex) => {
      clonedScene.traverse((child) => {
        if (!child.isMesh) return;
        const mat = new THREE.MeshStandardMaterial();
        if (tex) {
          mat.map = tex;
          const c = new THREE.Color(color);
          const isWhite = c.r > 0.95 && c.g > 0.95 && c.b > 0.95;
          mat.color.set(isWhite ? '#ffffff' : color);
        } else {
          mat.color.set(color);
        }
        mat.roughness = 0.8;
        mat.metalness = 0.0;
        mat.side = THREE.FrontSide;
        mat.needsUpdate = true;
        child.material = mat;
      });
    };

    if (designTexture) {
      const tex = loader.load(designTexture, (t) => {
        t.flipY = false;
        t.colorSpace = THREE.SRGBColorSpace;
        t.needsUpdate = true;
        applyMaterials(t);
      });
      return () => tex.dispose();
    } else {
      applyMaterials(null);
    }
  }, [designTexture, clonedScene, color]);

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
};

// =======================
// ⏳ FALLBACK
// =======================
const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[10, 10, 10]} />
    <meshStandardMaterial color="#7c3aed" wireframe />
  </mesh>
);

// =======================
// 🎮 VISOR PRINCIPAL
// =======================
const Player3DViewer = ({
  modelPath = '/models/tshirt.glb',
  color = '#ffffff',
  autoRotate = true,
  showControls = true,
  className = '',
  height = 'h-96',
  cameraDistance = 80,
  scale = 1,
  designTexture = null,
}) => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  const bgColor = isDark ? '#0f0f1a' : '#1e1b2e';

  return (
    <div
      className={`relative w-full ${height} rounded-2xl overflow-hidden ${className}`}
      style={{ background: bgColor }}
    >
      {/*
        ✅ KEY ELIMINADO del Canvas.
        Sin key, el Canvas NUNCA se destruye al cambiar modelPath, cameraDistance, etc.
        La cámara se actualiza mediante CameraUpdater (useThree hook interno).
        El modelo se recarga mediante el cambio de props en TShirtModel.
      */}
      <Canvas
        frameloop="demand"
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        camera={{ position: [0, 0, cameraDistance], fov: 45 }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(bgColor));
        }}
      >
        {/* Actualiza posición de cámara sin destruir el Canvas */}
        <CameraUpdater distance={cameraDistance} />

        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
        <directionalLight position={[-5, -5, -5]} intensity={0.4} />

        <Environment preset="studio" />

        <Suspense fallback={<LoadingFallback />}>
          <TShirtModel
            modelPath={modelPath}
            color={color}
            scale={scale}
            designTexture={designTexture}
          />
        </Suspense>

        <OrbitControls
          target={[0, 0, 0]}
          enablePan={false}
          minDistance={cameraDistance * 0.3}
          maxDistance={cameraDistance * 2.5}
          autoRotate={autoRotate}
          autoRotateSpeed={1.2}
          enableDamping
          dampingFactor={0.05}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          enableRotate={showControls}
          enableZoom={showControls}
        />
      </Canvas>

      {showControls && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full pointer-events-none">
          🖱️ Arrastra para rotar · Scroll para zoom
        </div>
      )}

      <div className="absolute top-3 right-3 bg-violet-600/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full pointer-events-none">
        3D ✦
      </div>
    </div>
  );
};

// ✅ Solo preload del modelo que existe
useGLTF.preload('/models/tshirt.glb');

export default Player3DViewer;