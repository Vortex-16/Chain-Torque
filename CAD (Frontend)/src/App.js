// src/App.js
import React, { useState, useRef } from "react";
import {
  FaSave,
  FaUndo,
  FaRedo,
  FaDownload,
  FaCog,
  FaFile,
  FaVectorSquare,
  FaCircle,
  FaSlash,
  FaArrowsAlt,
  FaMousePointer,
  FaDrawPolygon,
  FaFont,
  FaRuler,
  FaTrash,
  FaSearchPlus,
  FaSearchMinus,
  FaExpandArrowsAlt,
  FaCopy,
  FaCut,
  FaPaste,
  FaRobot,
} from "react-icons/fa";

import ThreeViewer from "./components/ThreeViewer";
import "./App.css";

const App = () => {
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [activeTool, setActiveTool] = useState('select');
  const [activeView, setActiveView] = useState('iso');
  const threeViewerRef = useRef();

  const toggleAIPanel = () => {
    setShowAIPanel(!showAIPanel);
  };

  const handleToolSelect = (tool) => {
    setActiveTool(tool);
  };

  // View control functions
  const handleViewChange = (view) => {
    setActiveView(view);
    if (threeViewerRef.current) {
      switch(view) {
        case 'front':
          threeViewerRef.current.setFrontView();
          break;
        case 'top':
          threeViewerRef.current.setTopView();
          break;
        case 'right':
          threeViewerRef.current.setRightView();
          break;
        case 'iso':
          threeViewerRef.current.setIsoView();
          break;
        default:
          break;
      }
    }
  };

  // Zoom and fit functions
  const handleZoomIn = () => {
    // This will be handled by the camera controls
    console.log('Zoom In clicked');
  };

  const handleZoomOut = () => {
    // This will be handled by the camera controls  
    console.log('Zoom Out clicked');
  };

  const handleFitToScreen = () => {
    if (threeViewerRef.current) {
      threeViewerRef.current.fitToScreen();
    }
  };

  return (
    <div className="app">
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-left">
          <h1>ChainTorque CAD</h1>
          <span className="filename">untitled_model.cad</span>
        </div>
        <div className="topbar-icons">
          <FaFile title="New File" />
          <FaSave title="Save" />
          <FaUndo title="Undo" />
          <FaRedo title="Redo" />
          <FaCopy title="Copy" />
          <FaCut title="Cut" />
          <FaPaste title="Paste" />
          <FaDownload title="Export" />
          <FaSearchPlus 
            title="Zoom In" 
            onClick={handleZoomIn}
            style={{ cursor: 'pointer' }}
          />
          <FaSearchMinus 
            title="Zoom Out" 
            onClick={handleZoomOut}
            style={{ cursor: 'pointer' }}
          />
          <FaExpandArrowsAlt 
            title="Fit to Screen" 
            onClick={handleFitToScreen}
            style={{ cursor: 'pointer' }}
            className="fit-to-screen-btn"
          />
          <FaRobot 
            title="Torquy" 
            className={`ai-copilot ${showAIPanel ? 'active' : ''}`}
            onClick={toggleAIPanel}
          />
          <FaCog title="Settings" />
        </div>
      </div>

      <div className="main">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="tool-section">
            <h3>Select</h3>
            <FaMousePointer 
              title="Select" 
              className={activeTool === 'select' ? 'active' : ''} 
              onClick={() => handleToolSelect('select')}
            />
          </div>
          <div className="tool-section">
            <h3>Draw</h3>
            <FaSlash 
              title="Line Tool" 
              className={activeTool === 'line' ? 'active' : ''} 
              onClick={() => handleToolSelect('line')}
            />
            <FaCircle 
              title="Circle Tool" 
              className={activeTool === 'circle' ? 'active' : ''} 
              onClick={() => handleToolSelect('circle')}
            />
            <FaVectorSquare 
              title="Rectangle Tool" 
              className={activeTool === 'rectangle' ? 'active' : ''} 
              onClick={() => handleToolSelect('rectangle')}
            />
            <FaDrawPolygon 
              title="Polygon Tool" 
              className={activeTool === 'polygon' ? 'active' : ''} 
              onClick={() => handleToolSelect('polygon')}
            />
          </div>
          <div className="tool-section">
            <h3>Modify</h3>
            <FaArrowsAlt 
              title="Move Tool" 
              className={activeTool === 'move' ? 'active' : ''} 
              onClick={() => handleToolSelect('move')}
            />
            <FaExpandArrowsAlt 
              title="Scale Tool" 
              className={activeTool === 'scale' ? 'active' : ''} 
              onClick={() => handleToolSelect('scale')}
            />
            <FaRedo 
              title="Rotate Tool" 
              className={activeTool === 'rotate' ? 'active' : ''} 
              onClick={() => handleToolSelect('rotate')}
            />
            <FaTrash 
              title="Delete" 
              className={activeTool === 'delete' ? 'active' : ''} 
              onClick={() => handleToolSelect('delete')}
            />
          </div>
          <div className="tool-section">
            <h3>Annotate</h3>
            <FaFont 
              title="Text Tool" 
              className={activeTool === 'text' ? 'active' : ''} 
              onClick={() => handleToolSelect('text')}
            />
            <FaRuler 
              title="Dimension Tool" 
              className={activeTool === 'dimension' ? 'active' : ''} 
              onClick={() => handleToolSelect('dimension')}
            />
          </div>
        </div>

        {/* Canvas Area with 3D Viewer - Full Width */}
        <div className="canvas-area" data-tool={activeTool}>
          <div className="canvas-header">
            <span>3D Viewport</span>
            <div className="view-controls">
              <button 
                className={activeView === 'front' ? 'active' : ''}
                onClick={() => handleViewChange('front')}
              >
                Front
              </button>
              <button 
                className={activeView === 'top' ? 'active' : ''}
                onClick={() => handleViewChange('top')}
              >
                Top
              </button>
              <button 
                className={activeView === 'right' ? 'active' : ''}
                onClick={() => handleViewChange('right')}
              >
                Right
              </button>
              <button 
                className={activeView === 'iso' ? 'active' : ''}
                onClick={() => handleViewChange('iso')}
              >
                Iso
              </button>
            </div>
          </div>
          
          {/* 3D Viewer Integration */}
          <div className="three-viewer-container">
            <ThreeViewer ref={threeViewerRef} />
          </div>
        </div>
      </div>

      {/* AI Copilot Panel - Floating Overlay */}
      <div className={`ai-panel-floating ${showAIPanel ? 'visible' : 'hidden'}`}>
        <div className="ai-header">
          <FaRobot />
          <h3>Torquy</h3>
          <button className="close-btn" onClick={toggleAIPanel}>×</button>
        </div>
        <div className="ai-chat">
          <div className="chat-messages">
            <div className="ai-message">
              <strong>🤖 Torquy:</strong><br/>
              Hello! I'm Torquy, your CAD assistant. I can help you with:
              <ul>
                <li>"Create a 10mm hole here"</li>
                <li>"Add 2mm fillet to all edges"</li>
                <li>"Extrude this face 50mm"</li>
                <li>"Change material to aluminum"</li>
                <li>"Mirror this part across X-axis"</li>
              </ul>
              Currently viewing: 3D sample objects
            </div>
          </div>
          <div className="chat-input">
            <input 
              type="text" 
              placeholder="Ask me to edit your model..." 
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  // Handle AI command input
                  console.log('AI Command:', e.target.value);
                }
              }}
            />
            <button>Send</button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="statusbar">
        <span>Ready | Tool: {activeTool} | Objects: 3 | FPS: 60</span>
        <span>ChainTorque CAD v0.1.0 - 3D Enabled</span>
      </div>
    </div>
  );
};

export default App;