// src/components/layout/GameLayout.tsx

import type { ReactNode } from 'react';
import '../../css/GameLayout.css';

export default function GameLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-container">
      <div className="title-wrapper">
        <img
          src="/sprites/ui/title.png"
          alt="Starship Commander"
          className="title-image"
        />
      </div>
      <div className="game-content">
        {children}
      </div>
    </div>
  );
}
