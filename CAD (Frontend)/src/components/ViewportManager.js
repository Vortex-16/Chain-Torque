// src/components/ViewportManager.js
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import ThreeViewer from './ThreeViewer';

// Integrated 2D Canvas Component
const Canvas2D = ({ onSketchComplete, sketches, activeSketch, onPointAdd }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState([]);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize] = useState(20);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const drawGrid = (ctx, width, height) => {
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.5;
      
      // Vertical lines
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Draw origin
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      const centerX = width / 2;
      const centerY = height / 2;
      
      // X axis
      ctx.beginPath();
      ctx.moveTo(centerX - 50, centerY);
      ctx.lineTo(centerX + 50, centerY);
      ctx.stroke();
      
      // Y axis
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 50);
      ctx.lineTo(centerX, centerY + 50);
      ctx.stroke();
      
      // Origin point
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
      ctx.fill();
    };

    const drawSketch = (ctx, points, color, showPoints) => {
      if (points.length < 2) return;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      
      // Close the sketch if it has more than 2 points
      if (points.length > 2) {
        ctx.closePath();
      }
      
      ctx.stroke();
      
      // Draw points
      if (showPoints) {
        ctx.fillStyle = color;
        points.forEach(point => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    };
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    if (snapToGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
    
    // Draw existing sketches
    sketches.forEach(sketch => {
      drawSketch(ctx, sketch.original2DPoints || sketch.points, '#666', false);
    });
    
    // Draw active sketch
    if (activeSketch) {
      drawSketch(ctx, activeSketch.original2DPoints || activeSketch.points, '#0066ff', true);
    }
    
    // Draw current sketch being drawn
    if (currentPoints.length > 0) {
      drawSketch(ctx, currentPoints, '#ff6600', true);
    }
  }, [sketches, activeSketch, currentPoints, snapToGrid, gridSize]);

  const snapToGridPoint = (x, y) => {
    if (!snapToGrid) return { x, y };
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    return { x: snappedX, y: snappedY };
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const snappedPoint = snapToGridPoint(x, y);
    
    if (!isDrawing) {
      setCurrentPoints([snappedPoint]);
      setIsDrawing(true);
    } else {
      const newPoints = [...currentPoints, snappedPoint];
      setCurrentPoints(newPoints);
      if (onPointAdd) onPointAdd(snappedPoint);
    }
  };

  const handleDoubleClick = () => {
    if (currentPoints.length > 2) {
      if (onSketchComplete) onSketchComplete(currentPoints);
      setCurrentPoints([]);
      setIsDrawing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      setCurrentPoints([]);
      setIsDrawing(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="canvas-2d-container">
      <div className="canvas-2d-toolbar">
        <div className="toolbar-section">
          <label>
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={(e) => setSnapToGrid(e.target.checked)}
            />
            Snap to Grid
          </label>
        </div>
        <div className="toolbar-section">
          <span className="status-text">
            {isDrawing 
              ? `Drawing sketch - ${currentPoints.length} points (Double-click to complete)`
              : 'Click to start sketching'
            }
          </span>
        </div>
        <div className="toolbar-section">
          <span className="help-text">ESC to cancel • ISO key for 3D view</span>
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="sketch-canvas"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        style={{ 
          border: '1px solid #ccc', 
          cursor: isDrawing ? 'crosshair' : 'pointer',
          backgroundColor: '#fafafa'
        }}
      />
    </div>
  );
};

const ViewportManager = forwardRef(({ 
  features, 
  onFeatureAdd, 
  onFeatureDelete, 
  onFeatureUpdate,
  selectedFeature,
  onFeatureSelect 
}, ref) => {
  const [viewMode, setViewMode] = useState('2d'); // '2d' or '3d'
  const [sketches, setSketches] = useState([]);
  const [activeSketch, setActiveSketch] = useState(null);
  const threeViewerRef = useRef();

  // Expose camera control methods to parent
  useImperativeHandle(ref, () => ({
    setFrontView: () => {
      if (threeViewerRef.current && viewMode === '3d') {
        threeViewerRef.current.setFrontView();
      }
    },
    setTopView: () => {
      if (threeViewerRef.current && viewMode === '3d') {
        threeViewerRef.current.setTopView();
      }
    },
    setRightView: () => {
      if (threeViewerRef.current && viewMode === '3d') {
        threeViewerRef.current.setRightView();
      }
    },
    setIsoView: () => {
      if (threeViewerRef.current && viewMode === '3d') {
        threeViewerRef.current.setIsoView();
      }
    },
    fitToScreen: () => {
      if (threeViewerRef.current && viewMode === '3d') {
        threeViewerRef.current.fitToScreen();
      }
    }
  }));

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
            ref={threeViewerRef}
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
});

export default ViewportManager;