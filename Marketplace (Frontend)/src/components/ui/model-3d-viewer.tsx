import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface Model3DViewerProps {
  modelUrl: string;
  className?: string;
}

function Model({ url }: { url: string }) {
  // useGLTF returns a loaded GLTF scene
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export function Model3DViewer({ modelUrl, className = '' }: Model3DViewerProps) {
  const controlsRef = useRef<any>(null);
  const [rotation, setRotation] = useState(0);

  // Manual revolve
  const handleRevolve = () => {
    setRotation((prev) => prev + Math.PI / 8);
  };

  // Manual zoom in
  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2); // Zoom in should move camera closer
      controlsRef.current.update();
    }
  };

  // Manual zoom out
  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2); // Zoom out should move camera farther
      controlsRef.current.update();
    }
  };

  return (
    <div
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}
      style={{ height: 400 }}
    >
      <Suspense
        fallback={
          <div className='flex items-center justify-center h-full text-white'>
            <div className='text-center'>
              <Loader2 className='h-12 w-12 animate-spin mx-auto mb-4' />
              <h3 className='text-lg font-semibold mb-2'>Loading 3D Model</h3>
              <p className='text-sm text-gray-400'>Please wait while we load your model...</p>
            </div>
          </div>
        }
      >
        <Canvas camera={{ position: [0, 0, 3] }} style={{ height: '100%', width: '100%' }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[2, 2, 2]} intensity={1} />
          <group rotation={[0, rotation, 0]}>
            <Model url={modelUrl} />
          </group>
          <OrbitControls ref={controlsRef} enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      </Suspense>

      {/* Manual Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        <Button size="sm" onClick={handleRevolve}>Revolve</Button>
        <Button size="sm" onClick={handleZoomIn}>Zoom In (+)</Button>
        <Button size="sm" onClick={handleZoomOut}>Zoom Out (-)</Button>
      </div>
    </div>
  );
};
