// src/components/DrawingManager.js
import React, { useState, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DrawingManager = ({ activeTool, onGeometryCreated }) => {
  const { camera, raycaster, gl, scene } = useThree();
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [previewGeometry, setPreviewGeometry] = useState(null);
  const [geometries, setGeometries] = useState([]);
  const mousePosition = useRef(new THREE.Vector2());
  const workPlaneRef = useRef();

  // Work plane for drawing (Y = 0 plane)
  const workPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  // Convert screen coordinates to 3D world coordinates on work plane
  const screenTo3D = useCallback((screenX, screenY) => {
    // Normalize screen coordinates to [-1, 1]
    const rect = gl.domElement.getBoundingClientRect();
    mousePosition.current.x = ((screenX - rect.left) / rect.width) * 2 - 1;
    mousePosition.current.y = -((screenY - rect.top) / rect.height) * 2 + 1;

    // Update raycaster
    raycaster.setFromCamera(mousePosition.current, camera);

    // Find intersection with work plane
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(workPlane, intersectionPoint);
    
    return intersectionPoint;
  }, [camera, raycaster, gl]);

  // Handle mouse clicks for drawing
  const handleClick = useCallback((event) => {
    if (activeTool === 'select') return;

    event.stopPropagation();
    const point = screenTo3D(event.clientX, event.clientY);
    
    switch (activeTool) {
      case 'line':
        handleLineClick(point);
        break;
      case 'circle':
        handleCircleClick(point);
        break;
      case 'rectangle':
        handleRectangleClick(point);
        break;
      default:
        break;
    }
  }, [activeTool, screenTo3D]);

  // Handle mouse movement for preview
  const handleMouseMove = useCallback((event) => {
    if (activeTool === 'select' || !isDrawing) return;

    const point = screenTo3D(event.clientX, event.clientY);
    updatePreview(point);
  }, [activeTool, isDrawing, screenTo3D]);

  // Line drawing logic
  const handleLineClick = (point) => {
    if (!isDrawing) {
      // Start line
      setIsDrawing(true);
      setCurrentPoints([point]);
    } else {
      // End line
      const startPoint = currentPoints[0];
      const line = createLine(startPoint, point);
      addGeometry(line, 'line');
      finishDrawing();
    }
  };

  // Circle drawing logic
  const handleCircleClick = (point) => {
    if (!isDrawing) {
      // Set center
      setIsDrawing(true);
      setCurrentPoints([point]);
    } else {
      // Set radius and create circle
      const center = currentPoints[0];
      const radius = center.distanceTo(point);
      const circle = createCircle(center, radius);
      addGeometry(circle, 'circle');
      finishDrawing();
    }
  };

  // Rectangle drawing logic
  const handleRectangleClick = (point) => {
    if (!isDrawing) {
      // Set first corner
      setIsDrawing(true);
      setCurrentPoints([point]);
    } else {
      // Set opposite corner and create rectangle
      const corner1 = currentPoints[0];
      const rectangle = createRectangle(corner1, point);
      addGeometry(rectangle, 'rectangle');
      finishDrawing();
    }
  };

  // Create line geometry
  const createLine = (start, end) => {
    const points = [start, end];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: 0x00ff00, 
      linewidth: 2 
    });
    return new THREE.Line(geometry, material);
  };

  // Create circle geometry
  const createCircle = (center, radius) => {
    const curve = new THREE.EllipseCurve(
      center.x, center.z,  // aX, aY (using X-Z plane)
      radius, radius,      // xRadius, yRadius
      0, 2 * Math.PI,      // aStartAngle, aEndAngle
      false,               // aClockwise
      0                    // aRotation
    );

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map(p => new THREE.Vector3(p.x, center.y, p.y))
    );
    
    const material = new THREE.LineBasicMaterial({ 
      color: 0x0099ff, 
      linewidth: 2 
    });
    
    return new THREE.Line(geometry, material);
  };

  // Create rectangle geometry
  const createRectangle = (corner1, corner2) => {
    const points = [
      new THREE.Vector3(corner1.x, corner1.y, corner1.z),
      new THREE.Vector3(corner2.x, corner1.y, corner1.z),
      new THREE.Vector3(corner2.x, corner1.y, corner2.z),
      new THREE.Vector3(corner1.x, corner1.y, corner2.z),
      new THREE.Vector3(corner1.x, corner1.y, corner1.z), // Close the rectangle
    ];
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: 0xff6600, 
      linewidth: 2 
    });
    
    return new THREE.Line(geometry, material);
  };

  // Update preview during drawing
  const updatePreview = (currentPoint) => {
    if (currentPoints.length === 0) return;

    let preview = null;
    const startPoint = currentPoints[0];

    switch (activeTool) {
      case 'line':
        preview = createLine(startPoint, currentPoint);
        preview.material.color.setHex(0x888888); // Gray for preview
        preview.material.opacity = 0.5;
        preview.material.transparent = true;
        break;
      case 'circle':
        const radius = startPoint.distanceTo(currentPoint);
        preview = createCircle(startPoint, radius);
        preview.material.color.setHex(0x888888);
        preview.material.opacity = 0.5;
        preview.material.transparent = true;
        break;
      case 'rectangle':
        preview = createRectangle(startPoint, currentPoint);
        preview.material.color.setHex(0x888888);
        preview.material.opacity = 0.5;
        preview.material.transparent = true;
        break;
      default:
        break;
    }

    // Remove old preview
    if (previewGeometry && scene) {
      scene.remove(previewGeometry);
    }

    // Add new preview
    if (preview && scene) {
      scene.add(preview);
      setPreviewGeometry(preview);
    }
  };

  // Add geometry to the scene
  const addGeometry = (geometry, type) => {
    if (scene) {
      scene.add(geometry);
      const newGeometry = { object: geometry, type, id: Date.now() };
      setGeometries(prev => [...prev, newGeometry]);
      
      // Notify parent component
      if (onGeometryCreated) {
        onGeometryCreated(newGeometry);
      }
    }
  };

  // Finish current drawing operation
  const finishDrawing = () => {
    setIsDrawing(false);
    setCurrentPoints([]);
    
    // Remove preview
    if (previewGeometry && scene) {
      scene.remove(previewGeometry);
      setPreviewGeometry(null);
    }
  };

  // Cancel current drawing operation
  const cancelDrawing = useCallback(() => {
    if (isDrawing) {
      finishDrawing();
    }
  }, [isDrawing]);

  // Handle escape key to cancel drawing
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        cancelDrawing();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cancelDrawing]);

  // Add event listeners to the canvas
  React.useEffect(() => {
    const canvas = gl.domElement;
    
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleClick, handleMouseMove, gl]);

  // Cleanup when tool changes
  React.useEffect(() => {
    if (activeTool === 'select') {
      cancelDrawing();
    }
  }, [activeTool, cancelDrawing]);

  // Cursor indicator component
  const CursorIndicator = () => {
    const [cursorPosition, setCursorPosition] = useState(new THREE.Vector3());
    const [showCursor, setShowCursor] = useState(false);
    
    React.useEffect(() => {
      const handleMouseMoveForCursor = (event) => {
        if (activeTool !== 'select') {
          const point = screenTo3D(event.clientX, event.clientY);
          setCursorPosition(point);
          setShowCursor(true);
        } else {
          setShowCursor(false);
        }
      };

      const canvas = gl.domElement;
      canvas.addEventListener('mousemove', handleMouseMoveForCursor);
      
      return () => {
        canvas.removeEventListener('mousemove', handleMouseMoveForCursor);
      };
    }, [activeTool]);

    if (!showCursor || activeTool === 'select') return null;

    return (
      <mesh position={cursorPosition}>
        <ringGeometry args={[0.1, 0.15, 8]} />
        <meshBasicMaterial 
          color={
            activeTool === 'line' ? 0x00ff00 :
            activeTool === 'circle' ? 0x0099ff :
            activeTool === 'rectangle' ? 0xff6600 : 0xff0000
          } 
          transparent 
          opacity={0.6} 
        />
      </mesh>
    );
  };

  return (
    <>
      <CursorIndicator />
      {/* Drawing state indicator */}
      {isDrawing && currentPoints.length > 0 && (
        <mesh position={currentPoints[0]}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color={0x00ff00} />
        </mesh>
      )}
    </>
  );
};

export default DrawingManager;
