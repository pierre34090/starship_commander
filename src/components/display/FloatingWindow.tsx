// src/components/display/FloatingWindow.tsx

import React from 'react';
import '../../css/FloatingWindow.css';

type Props = {
  onClose: () => void;
  children: React.ReactNode;
};

export const FloatingWindow: React.FC<Props> = ({ onClose, children }) => {
  return (
    <div className="floating-window-overlay">
      <div className="floating-window">
        <button className="floating-close-button" onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  );
};
