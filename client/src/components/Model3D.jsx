import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Html } from '@react-three/drei';

// Componente de modelo con rotación automática
const RotatingModel = ({ modelPath, autoRotate = true, speed = 0.01 }) => {
  const meshRef = useRef();
  const { scene } = useGLTF(modelPath);
  
  useFrame(() => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += speed;
    }
  });
  
  return <primitive ref={meshRef} object={scene.clone()} scale={2} position={[0, 0, 0]} />;
};

// Placeholder para cuando no hay modelo 3D (usamos imágenes con efecto 3D)
const ImageCard3D = ({ image, name, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    let interval;
    if (isHovered) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 2) % 360);
      }, 50);
    } else {
      setRotation(0);
    }
    return () => clearInterval(interval);
  }, [isHovered]);
  
  return (
    <div
      className="relative cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative w-full pb-[100%] overflow-hidden rounded-2xl shadow-lg">
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="absolute inset-0 backface-hidden">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 backface-hidden" style={{ transform: 'rotateY(180deg)' }}>
            <img
              src={image}
              alt={`${name} trasera`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition" />
      </div>
      <h3 className="text-center mt-3 font-semibold text-gray-800">{name}</h3>
      <p className="text-center text-sm text-gray-500">Pasa el mouse para ver 360°</p>
    </div>
  );
};

export const Model3DViewer = ({ modelPath, className = "h-96" }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError || !modelPath) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-6xl mb-4">🎨</div>
          <p className="text-gray-500">Vista previa 3D no disponible</p>
          <p className="text-sm text-gray-400">Modelo en desarrollo</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${className} rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900`}>
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <spotLight position={[0, 5, 5]} angle={0.3} penumbra={1} />
        <RotatingModel modelPath={modelPath} autoRotate={true} speed={0.005} />
        <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={1} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
};

export default ImageCard3D;