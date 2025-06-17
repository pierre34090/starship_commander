// src/components/layout/GameLayout.tsx

import type { ReactNode } from 'react';

export default function GameLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-container">
      <img
        src="/sprites/ui/title.png"
        alt="Starship Commander"
        className="title-image"
      />
      <div className="game-content">
        {children}
      </div>
    </div>
  );
}
