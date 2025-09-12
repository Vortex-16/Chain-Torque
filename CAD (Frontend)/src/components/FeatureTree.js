// src/components/FeatureTree.js
import React from 'react';
import { FaCube, FaCircle, FaSquare, FaEye, FaEyeSlash, FaTrash } from 'react-icons/fa';

const FeatureTree = ({ features, onFeatureToggle, onFeatureDelete, onFeatureSelect }) => {
  const getFeatureIcon = (type) => {
    switch (type) {
      case 'extrude':
        return <FaCube />;
      case 'revolve':
        return <FaCircle />;
      case 'sketch':
        return <FaSquare />;
      default:
        return <FaCube />;
    }
  };

  return (
    <div className="feature-tree">
      <div className="feature-tree-header">
        <h3>Feature Tree</h3>
      </div>
      <div className="feature-list">
        {features.length === 0 ? (
          <div className="no-features">
            <p>No features created yet</p>
            <p className="hint">Start by creating a sketch</p>
          </div>
        ) : (
          features.map((feature, index) => (
            <div 
              key={feature.id} 
              className={`feature-item ${feature.visible ? 'visible' : 'hidden'}`}
              onClick={() => onFeatureSelect && onFeatureSelect(feature)}
            >
              <div className="feature-icon">
                {getFeatureIcon(feature.operation)}
              </div>
              <div className="feature-info">
                <div className="feature-name">
                  {feature.operation} {index + 1}
                </div>
                <div className="feature-details">
                  {feature.type} - {feature.profile?.length || 0} points
                </div>
              </div>
              <div className="feature-controls">
                <button
                  className="toggle-visibility"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFeatureToggle && onFeatureToggle(feature.id);
                  }}
                  title={feature.visible ? 'Hide' : 'Show'}
                >
                  {feature.visible ? <FaEye /> : <FaEyeSlash />}
                </button>
                <button
                  className="delete-feature"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFeatureDelete && onFeatureDelete(feature.id);
                  }}
                  title="Delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FeatureTree;
