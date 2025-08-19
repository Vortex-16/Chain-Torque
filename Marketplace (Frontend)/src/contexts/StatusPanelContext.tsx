import React, { createContext, useContext, useState } from 'react';

interface StatusPanelContextType {
  showStatusPanel: boolean;
  toggleStatusPanel: () => void;
  closeStatusPanel: () => void;
}

const StatusPanelContext = createContext<StatusPanelContextType | undefined>(
  undefined
);

export const StatusPanelProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showStatusPanel, setShowStatusPanel] = useState(false);

  const toggleStatusPanel = () => {
    setShowStatusPanel(!showStatusPanel);
  };

  const closeStatusPanel = () => {
    setShowStatusPanel(false);
  };

  return (
    <StatusPanelContext.Provider
      value={{
        showStatusPanel,
        toggleStatusPanel,
        closeStatusPanel,
      }}
    >
      {children}
    </StatusPanelContext.Provider>
  );
};

export const useStatusPanel = () => {
  const context = useContext(StatusPanelContext);
  if (context === undefined) {
    throw new Error('useStatusPanel must be used within a StatusPanelProvider');
  }
  return context;
};
