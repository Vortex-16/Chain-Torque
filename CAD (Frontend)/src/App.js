// src/App.js
import React from "react";
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

import "./App.css";

const App = () => {
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
          <FaSearchPlus title="Zoom In" />
          <FaSearchMinus title="Zoom Out" />
          <FaExpandArrowsAlt title="Fit to Screen" />
          <FaRobot title="AI Copilot" className="ai-copilot" />
          <FaCog title="Settings" />
        </div>
      </div>

      <div className="main">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="tool-section">
            <h3>Select</h3>
            <FaMousePointer title="Select" className="active" />
          </div>
          <div className="tool-section">
            <h3>Draw</h3>
            <FaSlash title="Line Tool" />
            <FaCircle title="Circle Tool" />
            <FaVectorSquare title="Rectangle Tool" />
            <FaDrawPolygon title="Polygon Tool" />
          </div>
          <div className="tool-section">
            <h3>Modify</h3>
            <FaArrowsAlt title="Move Tool" />
            <FaExpandArrowsAlt title="Scale Tool" />
            <FaRedo title="Rotate Tool" />
            <FaTrash title="Delete" />
          </div>
          <div className="tool-section">
            <h3>Annotate</h3>
            <FaFont title="Text Tool" />
            <FaRuler title="Dimension Tool" />
          </div>
        </div>

        {/* Canvas Area */}
        <div className="canvas-area">
          <div className="canvas-header">
            <span>3D Viewport</span>
            <div className="view-controls">
              <button>Front</button>
              <button>Top</button>
              <button>Right</button>
              <button>Iso</button>
            </div>
          </div>
          <div className="grid"></div>
          <div className="crosshair-x"></div>
          <div className="crosshair-y"></div>
          
          {/* Placeholder for 3D viewer */}
          <div className="model-viewer-placeholder">
            <FaRobot size={48} />
            <p>3D Model Viewer</p>
            <p>Three.js integration coming soon...</p>
          </div>
        </div>

        {/* AI Copilot Panel (initially hidden) */}
        <div className="ai-panel hidden">
          <div className="ai-header">
            <FaRobot />
            <h3>AI Copilot</h3>
          </div>
          <div className="ai-chat">
            <div className="chat-messages">
              <div className="ai-message">
                Hello! I'm your CAD copilot. Try commands like:
                <ul>
                  <li>"Create a 10mm hole here"</li>
                  <li>"Add 2mm fillet to all edges"</li>
                  <li>"Extrude this face 50mm"</li>
                </ul>
              </div>
            </div>
            <div className="chat-input">
              <input type="text" placeholder="Ask me to edit your model..." />
              <button>Send</button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="statusbar">
        <span>Ready | Cursor: (121, 256) | FPS: 60 | Model: No file loaded</span>
        <span>ChainTorque v0.1.0</span>
      </div>
    </div>
  );
};

export default App;