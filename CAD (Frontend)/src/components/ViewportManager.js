// src/components/ViewportManager.js
import React, { useState, useEffect } from 'react';
import Canvas2D from './Canvas2D';
import ThreeViewer from './ThreeViewer';

const ViewportManager = ({ 
  features, 
  onFeatureAdd, 
  onFeatureDelete, 
  onFeatureUpdate,
  selectedFeature,
  onFeatureSelect 
}) => {
  const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
  const [sketches, setSketches] = useState([]);
  const [activeSketch, setActiveSketch] = useState(null);

  // Listen for ISO key press to switch to 3D
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Check for 'i' key (for ISO view)
      if (e.key.toLowerCase() === 'i' && !e.ctrlKey && !e.altKey) {
        toggleViewMode();
      }
      // Escape to go back to 2D
      if (e.key === 'Escape' && viewMode === '3d') {
        setViewMode('2d');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewMode]);

  const toggleViewMode = () => {
    setViewMode(prev => prev === '2d' ? '3d' : '2d');
  };

  const handleSketchComplete = (points) => {
    if (points.length < 3) return;

    // Convert 2D points to normalized coordinates for 3D extrusion
    const normalizedPoints = points.map(point => ({
      x: (point.x - 400) / 400, // Normalize to -1 to 1 range
      y: -(point.y - 300) / 300  // Flip Y and normalize
    }));

    // Create a new sketch feature
    const newSketch = {
      id: `sketch_${Date.now()}`,
      type: 'sketch',
      name: `Sketch ${sketches.length + 1}`,
      points: normalizedPoints,
      original2DPoints: points,
      visible: true,
      created: new Date().toISOString()
    };

    setSketches(prev => [...prev, newSketch]);
    
    // Automatically switch to 3D when sketch is completed
    setViewMode('3d');
    
    // Add to features list
    if (onFeatureAdd) {
      onFeatureAdd(newSketch);
    }
  };

  const handlePointAdd = (point) => {
    // Real-time feedback while sketching
    console.log('Point added:', point);
  };

  return (
    <div className="viewport-manager">
      <div className="viewport-header">
        <div className="view-mode-indicator">
          <span className={`mode-badge ${viewMode === '2d' ? 'active' : ''}`}>
            2D Sketch
          </span>
          <span className={`mode-badge ${viewMode === '3d' ? 'active' : ''}`}>
            3D Model
          </span>
        </div>
        
        <div className="viewport-controls">
          <button 
            className={`view-toggle ${viewMode === '2d' ? 'active' : ''}`}
            onClick={() => setViewMode('2d')}
            title="Switch to 2D Sketch Mode"
          >
            2D
          </button>
          <button 
            className={`view-toggle ${viewMode === '3d' ? 'active' : ''}`}
            onClick={() => setViewMode('3d')}
            title="Switch to 3D Model View (ISO)"
          >
            3D
          </button>
        </div>
        
        <div className="viewport-info">
          <span className="shortcut-hint">
            Press 'I' for Isometric view • ESC for 2D
          </span>
        </div>
      </div>

      <div className="viewport-content">
        {viewMode === '2d' ? (
          <Canvas2D
            onSketchComplete={handleSketchComplete}
            sketches={sketches}
            activeSketch={activeSketch}
            onPointAdd={handlePointAdd}
          />
        ) : (
          <ThreeViewer
            features={features}
            onFeatureSelect={onFeatureSelect}
            selectedFeature={selectedFeature}
            sketches={sketches}
          />
        )}
      </div>

      <div className="viewport-status">
        <div className="status-left">
          {viewMode === '2d' ? (
            <span>Sketch Mode - Draw profiles to create 3D geometry</span>
          ) : (
            <span>3D Model View - Modify and visualize your designs</span>
          )}
        </div>
        <div className="status-right">
          <span>Sketches: {sketches.length} | Features: {features.length}</span>
        </div>
      </div>
    </div>
  );
};

export default ViewportManager;