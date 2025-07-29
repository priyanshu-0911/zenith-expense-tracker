// src/components/nebula/NebulaBackground.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Particle system for the nebula effect
function NebulaParticles() {
  const pointsRef = useRef();
  const { viewport } = useThree();
  
  // Generate particle positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(5000 * 3);
    
    for (let i = 0; i < 5000; i++) {
      // Create a spherical distribution with some randomness
      const radius = Math.random() * 25 + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    return positions;
  }, []);
  
  // Animate the particles
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });
  
  return (
    <Points ref={pointsRef} positions={particlePositions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#8A2BE2"
        size={0.8}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Nebula cloud effect
function NebulaCloud() {
  const cloudRef = useRef();
  
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.z = state.clock.elapsedTime * 0.01;
    }
  });
  
  return (
    <mesh ref={cloudRef} position={[0, 0, -10]}>
      <sphereGeometry args={[15, 32, 32]} />
      <meshBasicMaterial
        transparent
        opacity={0.1}
        color="#4FD1C5"
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Main nebula background component
const NebulaBackground = () => {
  return (
    <div className="nebula-background">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'radial-gradient(ellipse at center, #1a0033 0%, #0d0221 100%)'
        }}
      >
        <NebulaParticles />
        <NebulaCloud />
      </Canvas>
    </div>
  );
};

export default NebulaBackground;
