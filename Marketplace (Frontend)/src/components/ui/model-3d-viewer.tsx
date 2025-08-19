import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  Minimize,
  Play,
  Pause,
  Eye,
  Loader2,
} from 'lucide-react';

interface Model3DViewerProps {
  modelUrl: string;
  className?: string;
  onLoadStart?: () => void;
  onLoadComplete?: () => void;
  onError?: (error: string) => void;
}

export const Model3DViewer: React.FC<Model3DViewerProps> = ({
  modelUrl,
  className = '',
  onLoadStart,
  onLoadComplete,
  onError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const [controls, setControls] = useState({
    zoom: 1,
    rotation: { x: 0, y: 0, z: 0 },
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js scene (mock implementation)
    const initializeViewer = async () => {
      setIsLoading(true);
      onLoadStart?.();

      try {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real implementation, you would:
        // 1. Initialize Three.js scene, camera, renderer
        // 2. Load the 3D model using GLTFLoader or similar
        // 3. Add lighting, controls, etc.
        // 4. Handle user interactions

        setIsLoading(false);
        onLoadComplete?.();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load 3D model';
        setError(errorMessage);
        setIsLoading(false);
        onError?.(errorMessage);
      }
    };

    initializeViewer();

    return () => {
      // Cleanup Three.js resources
    };
  }, [modelUrl, onLoadStart, onLoadComplete, onError]);

  const handleZoomIn = () => {
    setControls(prev => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.2, 5),
    }));
  };

  const handleZoomOut = () => {
    setControls(prev => ({
      ...prev,
      zoom: Math.max(prev.zoom * 0.8, 0.2),
    }));
  };

  const handleReset = () => {
    setControls({
      zoom: 1,
      rotation: { x: 0, y: 0, z: 0 },
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
      >
        <div className='text-center text-muted-foreground p-8'>
          <Eye className='h-12 w-12 mx-auto mb-4 opacity-50' />
          <h3 className='text-lg font-semibold mb-2'>
            Failed to Load 3D Model
          </h3>
          <p className='text-sm'>{error}</p>
          <Button
            variant='outline'
            size='sm'
            className='mt-4'
            onClick={() => {
              setError(null);
              setIsLoading(true);
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-gray-900 rounded-lg overflow-hidden ${className}`}
    >
      {isLoading ? (
        <div className='flex items-center justify-center h-full text-white'>
          <div className='text-center'>
            <Loader2 className='h-12 w-12 animate-spin mx-auto mb-4' />
            <h3 className='text-lg font-semibold mb-2'>Loading 3D Model</h3>
            <p className='text-sm text-gray-400'>
              Please wait while we load your model...
            </p>
            <div className='mt-4 w-64 bg-gray-800 rounded-full h-2'>
              <div
                className='bg-blue-500 h-2 rounded-full animate-pulse'
                style={{ width: '60%' }}
              ></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Mock 3D Scene */}
          <div className='w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900'>
            <div
              className={`w-32 h-32 bg-blue-500 rounded-lg shadow-2xl transform transition-transform duration-1000 ${
                isRotating ? 'animate-spin-y' : ''
              }`}
              style={{
                transform: `scale(${controls.zoom})`,
              }}
            >
              <div className='w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center'>
                <div className='text-white font-bold text-lg'>3D</div>
              </div>
            </div>
          </div>

          {/* Controls Overlay */}
          <div className='absolute top-4 right-4 flex flex-col gap-2'>
            <Button
              size='sm'
              variant='secondary'
              onClick={handleZoomIn}
              className='bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white'
              title='Zoom In'
            >
              <ZoomIn className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              variant='secondary'
              onClick={handleZoomOut}
              className='bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white'
              title='Zoom Out'
            >
              <ZoomOut className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              variant='secondary'
              onClick={handleReset}
              className='bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white'
              title='Reset View'
            >
              <RotateCcw className='h-4 w-4' />
            </Button>
            <Button
              size='sm'
              variant='secondary'
              onClick={toggleRotation}
              className='bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white'
              title={isRotating ? 'Stop Rotation' : 'Start Rotation'}
            >
              {isRotating ? (
                <Pause className='h-4 w-4' />
              ) : (
                <Play className='h-4 w-4' />
              )}
            </Button>
            <Button
              size='sm'
              variant='secondary'
              onClick={toggleFullscreen}
              className='bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white'
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize className='h-4 w-4' />
              ) : (
                <Maximize className='h-4 w-4' />
              )}
            </Button>
          </div>

          {/* Info Overlay */}
          <div className='absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm'>
            <p>Zoom: {Math.round(controls.zoom * 100)}%</p>
            <p>File: {modelUrl.split('/').pop()}</p>
          </div>
        </>
      )}
    </div>
  );
};
