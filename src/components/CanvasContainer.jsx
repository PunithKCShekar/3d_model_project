import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import SneakerModel from './SneakerModel';
import CameraController from './CameraController';

export default function CanvasContainer({ config, activePart, setActivePart, lastUpdatedPart, viewMode, exploded }) {
  return (
    <div className="w-full h-full relative">
      {/* Cinematic studio environment overlays */}
      <div className="absolute inset-0 spotlight-vignette pointer-events-none z-10" />
      <div className="absolute inset-0 studio-grid opacity-35 pointer-events-none" />

      {/* R3F Canvas */}
      <Canvas
        shadows
        camera={{ position: [3, 1.2, 3], fov: 45 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.15} />
        
        {/* Main studio overhead keylight */}
        <spotLight
          position={[3, 6, 3]}
          angle={0.35}
          penumbra={1}
          intensity={2.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0001}
        />
        
        {/* Mood back-light glowing in the brand warm amber color */}
        <pointLight
          position={[-1, 1.5, -3]}
          intensity={1.2}
          color="#E6A028"
        />

        {/* Soft fill light to keep details visible on shadow side */}
        <directionalLight
          position={[-3, 1, -1]}
          intensity={0.6}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          <SneakerModel
            config={config}
            activePart={activePart}
            setActivePart={setActivePart}
            lastUpdatedPart={lastUpdatedPart}
            exploded={exploded}
          />
          
          {/* Smooth, blurry contact shadow on the floor */}
          <ContactShadows
            position={[0, -0.6, 0]}
            opacity={0.8}
            scale={3.5}
            blur={2.2}
            far={1.2}
          />
          
          {/* High fidelity environment reflections */}
          <Environment preset="studio" />

          {/* Interpolated view snaps */}
          <CameraController viewMode={viewMode} />
        </Suspense>

        {/* Interaction controls with constraints */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.8}
          maxDistance={4.5}
          maxPolarAngle={Math.PI / 1.7} // Prevent viewing sneaker from directly underneath
          makeDefault
        />
      </Canvas>
    </div>
  );
}
