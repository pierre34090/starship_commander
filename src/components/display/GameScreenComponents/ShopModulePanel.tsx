// src/components/display/GameScreenComponents/ShopModulePanel.tsx

import { useState } from 'react';
import { FloatingWindow } from '../FloatingWindow';
import { ShipStatsPanel } from './ShopModuleComponents/ShipStatsPanel';

export default function ShopModulePanel() {
  const [showStats, setShowStats] = useState(false);

  return (
    <div>
      <button className="game-button" onClick={() => setShowStats(true)}>Ship statistics</button>

      {showStats && (
        <FloatingWindow onClose={() => setShowStats(false)}>
          <ShipStatsPanel />
        </FloatingWindow>
      )}
    </div>
  );
}
