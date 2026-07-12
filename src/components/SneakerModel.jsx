import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Individual parts of the sneaker with custom material characteristics, offset logic, and flash effect
function SneakerPart({
  name,
  geometry,
  args,
  position,
  rotation,
  config,
  activePart,
  setActivePart,
  lastUpdatedPart,
  exploded,
  explodeOffset = [0, 0, 0],
}) {
  const meshRef = useRef();
  const emissiveRef = useRef(0);

  const partConfig = config[name];
  const { color, material: materialType } = partConfig;

  // Trigger flash on color or material change
  useEffect(() => {
    if (lastUpdatedPart === name) {
      emissiveRef.current = 1.5; // Start with high brightness flash
    }
  }, [color, materialType, lastUpdatedPart, name]);

  // Interpolated position for exploded view transitions
  const currentPos = useRef(new THREE.Vector3(...position));
  const targetPos = new THREE.Vector3(
    position[0] + (exploded ? explodeOffset[0] : 0),
    position[1] + (exploded ? explodeOffset[1] : 0),
    position[2] + (exploded ? explodeOffset[2] : 0)
  );

  useFrame(() => {
    if (meshRef.current) {
      // Lerp position for smooth exploded transition
      currentPos.current.lerp(targetPos, 0.12);
      meshRef.current.position.copy(currentPos.current);

      if (meshRef.current.material) {
        // Smooth decay of the flash effect
        emissiveRef.current = THREE.MathUtils.lerp(emissiveRef.current, 0, 0.12);
        meshRef.current.material.emissiveIntensity = emissiveRef.current;
        
        // Use the brand color (warm amber) or the part color for the flash
        meshRef.current.material.emissive = new THREE.Color('#E6A028');
      }
    }
  });

  // Calculate material characteristics
  let metalness = 0.0;
  let roughness = 0.5;
  let clearcoat = 0.0;
  let clearcoatRoughness = 0.0;

  switch (materialType) {
    case 'patent':
      roughness = 0.08;
      metalness = 0.35;
      clearcoat = 1.0;
      clearcoatRoughness = 0.05;
      break;
    case 'knit':
      roughness = 0.95;
      metalness = 0.0;
      break;
    case 'metal':
      roughness = 0.2;
      metalness = 0.9;
      break;
    case 'carbon':
      roughness = 0.35;
      metalness = 0.7;
      break;
    case 'leather':
      roughness = 0.6;
      metalness = 0.15;
      break;
    case 'rubber':
    default:
      roughness = 0.5;
      metalness = 0.0;
      break;
  }

  const isActive = activePart === name;

  return (
    <mesh
      ref={meshRef}
      castShadow
      receiveShadow
      rotation={rotation}
      onClick={(e) => {
        e.stopPropagation();
        setActivePart(name);
      }}
      className="cursor-pointer"
    >
      {geometry === 'box' && <boxGeometry args={args} />}
      {geometry === 'cylinder' && <cylinderGeometry args={args} />}
      
      <meshPhysicalMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        clearcoat={clearcoat}
        clearcoatRoughness={clearcoatRoughness}
        envMapIntensity={1.8}
        // Active parts get a subtle highlight tint (handled by emissive offset)
        emissive={new THREE.Color(isActive ? '#E6A028' : '#000000')}
        emissiveIntensity={isActive ? 0.15 : 0}
      />
    </mesh>
  );
}

export default function SneakerModel({ config, activePart, setActivePart, lastUpdatedPart, exploded }) {
  const groupRef = useRef();

  // Slow inertia float/drift animation (disabled or muted when exploded to keep alignment clear)
  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.position.y = exploded 
        ? -0.05 
        : Math.sin(t * 1.2) * 0.04 - 0.08;
    }
  });

  return (
    <group ref={groupRef} scale={1.4} position={[0, -0.05, 0]}>
      {/* SOLE PARTS (explode downwards) */}
      <SneakerPart
        name="sole"
        geometry="box"
        args={[1.8, 0.22, 0.7]}
        position={[0, -0.4, 0]}
        explodeOffset={[0, -0.3, 0]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />
      <SneakerPart
        name="sole"
        geometry="box"
        args={[0.2, 0.18, 0.68]}
        position={[0.9, -0.35, 0]}
        rotation={[0, 0, 0.15]}
        explodeOffset={[0.1, -0.3, 0]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />
      <SneakerPart
        name="sole"
        geometry="box"
        args={[0.2, 0.26, 0.68]}
        position={[-0.9, -0.32, 0]}
        rotation={[0, 0, -0.1]}
        explodeOffset={[-0.1, -0.3, 0]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />

      {/* UPPER MAIN BODY (explodes up slightly) */}
      <SneakerPart
        name="upper"
        geometry="box"
        args={[1.6, 0.45, 0.64]}
        position={[-0.05, -0.1, 0]}
        explodeOffset={[0, 0.05, 0]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />

      {/* TOE BOX (explodes forward) */}
      <SneakerPart
        name="toe"
        geometry="box"
        args={[0.45, 0.35, 0.62]}
        position={[0.7, -0.15, 0]}
        rotation={[0, 0, 0.12]}
        explodeOffset={[0.3, -0.05, 0]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />

      {/* HEEL CAP (explodes backward) */}
      <SneakerPart
        name="heel"
        geometry="box"
        args={[0.4, 0.55, 0.62]}
        position={[-0.7, 0.05, 0]}
        rotation={[0, 0, -0.15]}
        explodeOffset={[-0.3, 0.05, 0]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />

      {/* TONGUE (explodes upward and forward) */}
      <SneakerPart
        name="tongue"
        geometry="box"
        args={[0.6, 0.15, 0.48]}
        position={[0.25, 0.25, 0]}
        rotation={[0, 0, -0.4]}
        explodeOffset={[0.15, 0.25, 0]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />

      {/* INLINING COLLAR (explodes upward and backward) */}
      <SneakerPart
        name="lining"
        geometry="box"
        args={[0.55, 0.3, 0.52]}
        position={[-0.35, 0.25, 0]}
        rotation={[0, 0, -0.1]}
        explodeOffset={[-0.15, 0.25, 0]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />

      {/* LACES (explode upward) */}
      <SneakerPart
        name="laces"
        geometry="cylinder"
        args={[0.02, 0.02, 0.45, 8]}
        position={[0.2, 0.22, 0]}
        rotation={[1.57, 0, -0.4]}
        explodeOffset={[0.2, 0.45, 0]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />
      <SneakerPart
        name="laces"
        geometry="cylinder"
        args={[0.02, 0.02, 0.45, 8]}
        position={[0.4, 0.14, 0]}
        rotation={[1.57, 0, -0.4]}
        explodeOffset={[0.2, 0.45, 0]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />
      <SneakerPart
        name="laces"
        geometry="cylinder"
        args={[0.02, 0.02, 0.45, 8]}
        position={[0.0, 0.3, 0]}
        rotation={[1.57, 0, -0.4]}
        explodeOffset={[0.2, 0.45, 0]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />

      {/* BRAND CHEVRON / "V" LOGO OUTSIDE (explodes outward right) */}
      <SneakerPart
        name="stripe"
        geometry="box"
        args={[0.4, 0.08, 0.025]}
        position={[0.0, -0.05, 0.325]}
        rotation={[0, 0, -0.3]}
        explodeOffset={[0.05, 0, 0.3]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />
      <SneakerPart
        name="stripe"
        geometry="box"
        args={[0.4, 0.08, 0.025]}
        position={[-0.15, 0.1, 0.325]}
        rotation={[0, 0, 0.8]}
        explodeOffset={[0.05, 0, 0.3]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />

      {/* BRAND CHEVRON / "V" LOGO INSIDE (explodes outward left) */}
      <SneakerPart
        name="stripe"
        geometry="box"
        args={[0.4, 0.08, 0.025]}
        position={[0.0, -0.05, -0.325]}
        rotation={[0, 0, -0.3]}
        explodeOffset={[0.05, 0, -0.3]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />
      <SneakerPart
        name="stripe"
        geometry="box"
        args={[0.4, 0.08, 0.025]}
        position={[-0.15, 0.1, -0.325]}
        rotation={[0, 0, 0.8]}
        explodeOffset={[0.05, 0, -0.3]}
        exploded={exploded}
        config={config}
        activePart={activePart}
        setActivePart={setActivePart}
        lastUpdatedPart={lastUpdatedPart}
      />
    </group>
  );
}
