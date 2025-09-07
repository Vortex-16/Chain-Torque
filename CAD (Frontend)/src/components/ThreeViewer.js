// src/components/ThreeViewer.js
import React, { Suspense, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Box, Sphere, Cylinder, Cone, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// Sample 3D objects for demonstration
const SampleCube = ({ position = [0, 1, 0] }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Box
      ref={meshRef}
      position={position}
      args={[2, 2, 2]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial 
        color={hovered ? '#ff6b6b' : '#4ecdc4'} 
        transparent
        opacity={0.8}
      />
    </Box>
  );
};

const SampleSphere = ({ position = [4, 1, 0] }) => {
  const meshRef = useRef();
  
  return (
    <Sphere
      ref={meshRef}
      position={position}
      args={[1.5, 32, 32]}
    >
      <meshStandardMaterial 
        color="#45b7d1"
        metalness={0.6}
        roughness={0.2}
      />
    </Sphere>
  );
};

const SampleCylinder = ({ position = [-4, 1, 0] }) => {
  return (
    <Cylinder
      position={position}
      args={[1, 1, 3, 16]}
    >
      <meshStandardMaterial 
        color="#96ceb4"
        metalness={0.3}
        roughness={0.4}
      />
    </Cylinder>
  );
};

const WorkPlane = () => {
  return (
    <>
      {/* Main work plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#f8f9fa" 
          transparent 
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Grid */}
      <Grid 
        args={[20, 20]} 
        cellSize={1} 
        cellThickness={0.5} 
        cellColor="#e9ecef" 
        sectionSize={5} 
        sectionThickness={1} 
        sectionColor="#adb5bd"
        fadeDistance={25}
        fadeStrength={1}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </>
  );
};

const CameraController = forwardRef((props, ref) => {
  const { camera } = useThree();
  const controlsRef = useRef();

  useImperativeHandle(ref, () => ({
    // Fit to screen - reset camera to show all objects
    fitToScreen: () => {
      camera.position.set(8, 8, 8);
      camera.lookAt(0, 1, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 1, 0);
        controlsRef.current.update();
      }
    },
    
    // Front view
    setFrontView: () => {
      camera.position.set(0, 1, 10);
      camera.lookAt(0, 1, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 1, 0);
        controlsRef.current.update();
      }
    },
    
    // Top view
    setTopView: () => {
      camera.position.set(0, 10, 0);
      camera.lookAt(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    },
    
    // Right view
    setRightView: () => {
      camera.position.set(10, 1, 0);
      camera.lookAt(0, 1, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 1, 0);
        controlsRef.current.update();
      }
    },
    
    // Isometric view
    setIsoView: () => {
      camera.position.set(8, 8, 8);
      camera.lookAt(0, 1, 0);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 1, 0);
        controlsRef.current.update();
      }
    }
  }));

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={3}
      maxDistance={50}
      maxPolarAngle={Math.PI / 1.8}
      target={[0, 1, 0]}
    />
  );
});

const Scene = ({ cameraRef }) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      
      {/* Camera Controller */}
      <CameraController ref={cameraRef} />
      
      {/* Work plane and grid */}
      <WorkPlane />
      
      {/* Sample CAD objects */}
      <SampleCube />
      <SampleSphere />
      <SampleCylinder />
      
      {/* Coordinate system indicator */}
      <group position={[-8, 0, 8]}>
        {/* X-axis - Red */}
        <Cylinder args={[0.05, 0.05, 2]} position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial color="#ff0000" />
        </Cylinder>
        <Cone args={[0.1, 0.3]} position={[2.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <meshStandardMaterial color="#ff0000" />
        </Cone>
        
        {/* Y-axis - Green */}
        <Cylinder args={[0.05, 0.05, 2]} position={[0, 1, 0]}>
          <meshStandardMaterial color="#00ff00" />
        </Cylinder>
        <Cone args={[0.1, 0.3]} position={[0, 2.2, 0]}>
          <meshStandardMaterial color="#00ff00" />
        </Cone>
        
        {/* Z-axis - Blue */}
        <Cylinder args={[0.05, 0.05, 2]} position={[0, 0, 1]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#0000ff" />
        </Cylinder>
        <Cone args={[0.1, 0.3]} position={[0, 0, 2.2]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#0000ff" />
        </Cone>
        
        {/* Labels */}
        <Html position={[2.5, 0, 0]}>
          <div style={{ color: '#ff0000', fontWeight: 'bold', fontSize: '14px' }}>X</div>
        </Html>
        <Html position={[0, 2.5, 0]}>
          <div style={{ color: '#00ff00', fontWeight: 'bold', fontSize: '14px' }}>Y</div>
        </Html>
        <Html position={[0, 0, 2.5]}>
          <div style={{ color: '#0000ff', fontWeight: 'bold', fontSize: '14px' }}>Z</div>
        </Html>
      </group>
    </>
  );
};

const LoadingSpinner = () => (
  <Html center>
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div style={{ 
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #4ecdc4',
        borderRadius: '50%',
        width: '30px',
        height: '30px',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 10px'
      }} />
      <div>Loading 3D Scene...</div>
    </div>
  </Html>
);

const ThreeViewer = forwardRef((props, ref) => {
  const cameraRef = useRef();

  useImperativeHandle(ref, () => ({
    fitToScreen: () => cameraRef.current?.fitToScreen(),
    setFrontView: () => cameraRef.current?.setFrontView(),
    setTopView: () => cameraRef.current?.setTopView(),
    setRightView: () => cameraRef.current?.setRightView(),
    setIsoView: () => cameraRef.current?.setIsoView(),
  }));

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ 
          position: [8, 8, 8], 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        shadows
        style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #f8f9fa 100%)' }}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <Scene cameraRef={cameraRef} />
        </Suspense>
      </Canvas>
      
      {/* 3D Viewer overlay controls */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontSize: '12px'
      }}>
        <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>3D Controls</div>
        <div>• Left click + drag: Rotate</div>
        <div>• Right click + drag: Pan</div>
        <div>• Scroll: Zoom</div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

export default ThreeViewer;
