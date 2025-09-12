// src/components/SketchManager.js
import React, { useState, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const SketchManager = ({ activeTool, onSketchComplete }) => {
  const { camera, raycaster, gl, scene } = useThree();
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentSketch, setCurrentSketch] = useState(null);
  const [sketchPoints, setSketchPoints] = useState([]);
  const [previewMesh, setPreviewMesh] = useState(null);
  const mousePosition = useRef(new THREE.Vector2());

  // Active sketch plane (XY plane at Y=0 for now)
  const sketchPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  
  // Convert screen to 3D coordinates on sketch plane
  const screenTo3D = useCallback((screenX, screenY) => {
    const rect = gl.domElement.getBoundingClientRect();
    mousePosition.current.x = ((screenX - rect.left) / rect.width) * 2 - 1;
    mousePosition.current.y = -((screenY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mousePosition.current, camera);
    const intersectionPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(sketchPlane, intersectionPoint);
    
    return intersectionPoint;
  }, [camera, raycaster, gl]);

  // Create 2D profile from sketch points
  const createProfile = (points, type) => {
    if (points.length < 2) return null;

    let shape;
    
    switch (type) {
      case 'rectangle':
        if (points.length >= 2) {
          const [p1, p2] = points;
          shape = new THREE.Shape();
          shape.moveTo(p1.x, p1.z);
          shape.lineTo(p2.x, p1.z);
          shape.lineTo(p2.x, p2.z);
          shape.lineTo(p1.x, p2.z);
          shape.lineTo(p1.x, p1.z);
        }
        break;
        
      case 'circle':
        if (points.length >= 2) {
          const center = points[0];
          const radius = center.distanceTo(points[1]);
          shape = new THREE.Shape();
          shape.absarc(center.x, center.z, radius, 0, Math.PI * 2, false);
        }
        break;
        
      case 'line':
      case 'polyline':
        shape = new THREE.Shape();
        shape.moveTo(points[0].x, points[0].z);
        for (let i = 1; i < points.length; i++) {
          shape.lineTo(points[i].x, points[i].z);
        }
        break;
        
      default:
        return null;
    }
    
    return shape;
  };

  // Create 3D solid from 2D profile
  const extrudeProfile = (profile, height = 1) => {
    if (!profile) return null;

    const extrudeSettings = {
      depth: height,
      bevelEnabled: false,
    };

    const geometry = new THREE.ExtrudeGeometry(profile, extrudeSettings);
    const material = new THREE.MeshLambertMaterial({ 
      color: 0x6699ff,
      transparent: true,
      opacity: 0.9
    });

    const mesh = new THREE.Mesh(geometry, material);
    
    // Position correctly (rotate to stand up)
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = height / 2;
    
    return mesh;
  };

  // Handle sketch completion
  const completeSketch = (type) => {
    if (sketchPoints.length < 2) return;

    const profile = createProfile(sketchPoints, type);
    if (!profile) return;

    const solid = extrudeProfile(profile, 2); // Default 2 unit height
    
    if (solid && scene) {
      scene.add(solid);
      
      const sketchData = {
        type: 'solid',
        operation: 'extrude',
        profile: sketchPoints,
        geometry: solid,
        id: Date.now()
      };
      
      if (onSketchComplete) {
        onSketchComplete(sketchData);
      }
    }

    // Reset sketch
    setSketchPoints([]);
    setIsDrawing(false);
    setCurrentSketch(null);
    
    // Remove preview
    if (previewMesh && scene) {
      scene.remove(previewMesh);
      setPreviewMesh(null);
    }
  };

  // Handle mouse clicks for sketching
  const handleClick = useCallback((event) => {
    if (activeTool === 'select') return;

    event.stopPropagation();
    const point = screenTo3D(event.clientX, event.clientY);
    
    switch (activeTool) {
      case 'rectangle':
        if (!isDrawing) {
          setIsDrawing(true);
          setSketchPoints([point]);
        } else {
          setSketchPoints(prev => [...prev, point]);
          completeSketch('rectangle');
        }
        break;
        
      case 'circle':
        if (!isDrawing) {
          setIsDrawing(true);
          setSketchPoints([point]);
        } else {
          setSketchPoints(prev => [...prev, point]);
          completeSketch('circle');
        }
        break;
        
      case 'line':
        if (!isDrawing) {
          setIsDrawing(true);
          setSketchPoints([point]);
        } else {
          setSketchPoints(prev => [...prev, point]);
          completeSketch('line');
        }
        break;
        
      default:
        break;
    }
  }, [activeTool, isDrawing, screenTo3D]);

  // Handle mouse movement for preview
  const handleMouseMove = useCallback((event) => {
    if (!isDrawing || sketchPoints.length === 0) return;

    const point = screenTo3D(event.clientX, event.clientY);
    const previewPoints = [...sketchPoints, point];
    
    const profile = createProfile(previewPoints, activeTool);
    if (profile) {
      // Remove old preview
      if (previewMesh && scene) {
        scene.remove(previewMesh);
      }
      
      // Create new preview
      const newPreview = extrudeProfile(profile, 2);
      if (newPreview) {
        newPreview.material.opacity = 0.3;
        newPreview.material.color.setHex(0x888888);
        scene.add(newPreview);
        setPreviewMesh(newPreview);
      }
    }
  }, [isDrawing, sketchPoints, activeTool, screenTo3D, previewMesh, scene]);

  // Add event listeners
  React.useEffect(() => {
    const canvas = gl.domElement;
    
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleClick, handleMouseMove, gl]);

  // Escape to cancel
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isDrawing) {
        setIsDrawing(false);
        setSketchPoints([]);
        setCurrentSketch(null);
        
        if (previewMesh && scene) {
          scene.remove(previewMesh);
          setPreviewMesh(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawing, previewMesh, scene]);

  // Render sketch points
  return (
    <>
      {/* Show sketch points */}
      {sketchPoints.map((point, index) => (
        <mesh key={index} position={point}>
          <sphereGeometry args={[0.05]} />
          <meshBasicMaterial color={0x00ff00} />
        </mesh>
      ))}
      
      {/* Sketch plane indicator */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial 
          color="#e8f4f8" 
          transparent 
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

export default SketchManager;
