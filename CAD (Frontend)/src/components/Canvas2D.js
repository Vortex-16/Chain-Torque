// src/components/Canvas2D.js
import React, { useRef, useEffect, useState } from 'react';

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
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    if (snapToGrid) {
      drawGrid(ctx, canvas.width, canvas.height);
    }
    
    // Draw existing sketches
    sketches.forEach(sketch => {
      drawSketch(ctx, sketch.points, '#666', false);
    });
    
    // Draw active sketch
    if (activeSketch) {
      drawSketch(ctx, activeSketch.points, '#0066ff', true);
    }
    
    // Draw current sketch being drawn
    if (currentPoints.length > 0) {
      drawSketch(ctx, currentPoints, '#ff6600', true);
    }
  }, [sketches, activeSketch, currentPoints, snapToGrid, gridSize]);

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
      // Start new sketch
      setCurrentPoints([snappedPoint]);
      setIsDrawing(true);
    } else {
      // Add point to current sketch
      const newPoints = [...currentPoints, snappedPoint];
      setCurrentPoints(newPoints);
      
      if (onPointAdd) {
        onPointAdd(snappedPoint);
      }
    }
  };

  const handleDoubleClick = () => {
    if (currentPoints.length > 2) {
      // Complete the sketch
      if (onSketchComplete) {
        onSketchComplete(currentPoints);
      }
      setCurrentPoints([]);
      setIsDrawing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      // Cancel current sketch
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

export default Canvas2D;