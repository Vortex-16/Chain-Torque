// src/components/CADOperations.js
import React, { useState } from 'react';
import { FaCube, FaRedo, FaPlus, FaMinus, FaCube as FaIntersection } from 'react-icons/fa';

const CADOperations = ({ selectedFeature, onOperation }) => {
  const [extrudeHeight, setExtrudeHeight] = useState(2);
  const [revolveAngle, setRevolveAngle] = useState(360);

  const handleExtrude = () => {
    if (selectedFeature) {
      onOperation({
        type: 'extrude',
        targetId: selectedFeature.id,
        parameters: { height: extrudeHeight }
      });
    }
  };

  const handleRevolve = () => {
    if (selectedFeature) {
      onOperation({
        type: 'revolve',
        targetId: selectedFeature.id,
        parameters: { angle: revolveAngle }
      });
    }
  };

  const handleBoolean = (operation) => {
    if (selectedFeature) {
      onOperation({
        type: 'boolean',
        operation: operation,
        targetId: selectedFeature.id
      });
    }
  };

  return (
    <div className="cad-operations">
      <div className="operations-header">
        <h3>Operations</h3>
      </div>
      
      {!selectedFeature ? (
        <div className="no-selection">
          <p>Select a feature to modify</p>
        </div>
      ) : (
        <div className="operation-panels">
          
          {/* Extrude Panel */}
          <div className="operation-panel">
            <h4><FaCube /> Extrude</h4>
            <div className="parameter-group">
              <label>Height:</label>
              <input
                type="number"
                value={extrudeHeight}
                onChange={(e) => setExtrudeHeight(parseFloat(e.target.value))}
                min="0.1"
                max="50"
                step="0.1"
              />
              <span className="unit">units</span>
            </div>
            <button className="operation-btn" onClick={handleExtrude}>
              Apply Extrude
            </button>
          </div>

          {/* Revolve Panel */}
          <div className="operation-panel">
            <h4><FaRedo /> Revolve</h4>
            <div className="parameter-group">
              <label>Angle:</label>
              <input
                type="number"
                value={revolveAngle}
                onChange={(e) => setRevolveAngle(parseFloat(e.target.value))}
                min="1"
                max="360"
                step="1"
              />
              <span className="unit">degrees</span>
            </div>
            <button className="operation-btn" onClick={handleRevolve}>
              Apply Revolve
            </button>
          </div>

          {/* Boolean Operations */}
          <div className="operation-panel">
            <h4>Boolean Operations</h4>
            <div className="boolean-buttons">
              <button 
                className="operation-btn union"
                onClick={() => handleBoolean('union')}
                title="Union - Combine solids"
              >
                <FaPlus /> Union
              </button>
              <button 
                className="operation-btn subtract"
                onClick={() => handleBoolean('subtract')}
                title="Subtract - Remove material"
              >
                <FaMinus /> Subtract
              </button>
              <button 
                className="operation-btn intersect"
                onClick={() => handleBoolean('intersect')}
                title="Intersect - Keep only overlap"
              >
                <FaIntersection /> Intersect
              </button>
            </div>
          </div>

          {/* Material Properties */}
          <div className="operation-panel">
            <h4>Material</h4>
            <div className="material-controls">
              <div className="parameter-group">
                <label>Color:</label>
                <input
                  type="color"
                  defaultValue="#6699ff"
                  onChange={(e) => {
                    if (selectedFeature && selectedFeature.geometry) {
                      selectedFeature.geometry.material.color.setStyle(e.target.value);
                    }
                  }}
                />
              </div>
              <div className="parameter-group">
                <label>Opacity:</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  defaultValue="0.9"
                  onChange={(e) => {
                    if (selectedFeature && selectedFeature.geometry) {
                      selectedFeature.geometry.material.opacity = parseFloat(e.target.value);
                    }
                  }}
                />
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CADOperations;
