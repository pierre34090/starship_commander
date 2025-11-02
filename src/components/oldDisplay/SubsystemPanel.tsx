// src/components/SubsystemPanel.tsx

import React, { useContext } from 'react';
import { GameContext } from '../contexts/GameContext';
import {
  canAllocateEnergy,
  allocateEnergyPoint,
  deallocateEnergyPoint,
} from '../libs/state/Ships/SubsystemLogic';

type SubsystemType = 'shields' | 'weapons' | 'engines' | 'targeting';

const subsystemLabels: Record<SubsystemType, string> = {
  shields: 'Shields',
  weapons: 'Weapons',
  engines: 'Engines',
  targeting: 'Targeting',
};

export default function SubsystemPanel() {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState, setGameState } = context;
  if (!gameState) return null;

  const player = gameState.player_ship;

  const handleLeftClick = (subsystem: SubsystemType) => {
    if (canAllocateEnergy(player, subsystem, 1)) {
      const updatedShip = allocateEnergyPoint(player, subsystem, 1);
      setGameState({ ...gameState, player_ship: updatedShip });
    }
  };

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement>,
    subsystem: SubsystemType
  ) => {
    e.preventDefault();
    if ((player.energyAllocation[subsystem] ?? 0) > 0) {
      const updatedShip = deallocateEnergyPoint(player, subsystem);
      setGameState({ ...gameState, player_ship: updatedShip });
    }
  };

  return (
    <div className="panel">
      <h3>Subsystems</h3>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {(Object.keys(subsystemLabels) as SubsystemType[]).map((sub) => (
          <div
            key={sub}
            onClick={() => handleLeftClick(sub)}
            onContextMenu={(e) => handleRightClick(e, sub)}
            style={{
              border: '1px solid #ccc',
              borderRadius: 8,
              padding: '8px',
              backgroundColor: '#e8e8f8',
              cursor: 'pointer',
              width: 150,
            }}
          >
            <strong>{subsystemLabels[sub]}</strong>
            <p>Allocated: {player.energyAllocation[sub] ?? 0}</p>
            {/* On peut enrichir ici avec info bonus si besoin */}
          </div>
        ))}
      </div>
    </div>
  );
}
