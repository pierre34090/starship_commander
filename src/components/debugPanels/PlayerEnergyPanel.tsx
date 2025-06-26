// src/components/debugPanels/PlayerEnergyPanel.tsx

import React from 'react';
import { GameContext } from '../../contexts/GameContext';
import type { SubsystemType } from '../../libs/state/Ships/ShipSubsystems';
import type { ShipState } from '../../libs/state/Ships/ShipState';

const subsystems: SubsystemType[] = ['shields', 'weapons', 'engines', 'targeting'];

export default function PlayerEnergyPanel() {
  const context = React.useContext(GameContext);
  if (!context) return null;

  const { gameState, setGameState } = context;
  const ship = gameState?.player_ship;
  const energy = ship.baseStats.energy;
  const allocation = ship.energyAllocation;

  const totalAllocated = subsystems.reduce(
    (sum, type) => sum + (allocation[type] ?? 0),
    0
  );

  const modify = (type: SubsystemType, delta: number) => {
    const newValue = (allocation[type] ?? 0) + delta;
    if (newValue < 0) return;
    const newTotal = totalAllocated + delta;
    if (newTotal > energy) return;

    const newAlloc = { ...allocation, [type]: newValue };
    const newShip = { ...ship, energyAllocation: newAlloc } as ShipState;
    setGameState({ ...gameState, player_ship: newShip });
  };

  return (
    <div style={{ padding: 12, border: '1px solid #999', borderRadius: 8, background: '#f7f7f7' }}>
      <h3>Energy Allocation</h3>
      <p>Total Energy: {energy} | Allocated: {totalAllocated}</p>
      {subsystems.map((type) => (
        <div key={type} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
          <span style={{ width: 80 }}>{type}</span>
          <button onClick={() => modify(type, -1)} disabled={allocation[type] <= 0}>-</button>
          <span>{allocation[type] ?? 0}</span>
          <button onClick={() => modify(type, 1)} disabled={totalAllocated >= energy}>+</button>
        </div>
      ))}
    </div>
  );
}
