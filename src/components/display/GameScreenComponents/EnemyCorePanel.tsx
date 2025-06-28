// src/components/GameScreenComponents/EnemyCorePanel.tsx

import React, { useContext } from 'react';
import type { ShipState } from '../../../libs/state/Ships/ShipState';
import type { SubsystemType } from '../../../libs/state/Ships/ShipSubsystems';
import { GameContext } from '../../../contexts/GameContext';
import '../../../css/GameScreenComponents/EnemyCorePanel.css';

const subsystemOrder: SubsystemType[] = [
  'shields',
  'weapons',
  'engines',
  'targeting',
  'spy',
  'reactor',
];

interface Props {
  ship: ShipState;
}

const EnemyCorePanel: React.FC<Props> = ({ ship }) => {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState, setGameState, targetingWeaponId, setTargetingWeaponId } = context;

  const handleAssignTarget = (subsystem: SubsystemType) => {
    if (!targetingWeaponId || !gameState) return;

    const updatedWeapons = gameState.player_ship.weapons.map((w) =>
      w.id === targetingWeaponId
        ? {
            ...w,
            target: {
              shipId: ship.id,
              subsystem,
            },
          }
        : w
    );

    const updatedGameState = {
      ...gameState,
      player_ship: {
        ...gameState.player_ship,
        weapons: updatedWeapons,
      },
    };

    setGameState(updatedGameState);
    setTargetingWeaponId(null);
    document.body.style.cursor = 'default';
  };

  const handleRightClick = (e: React.MouseEvent) => {
    if (!targetingWeaponId) return;
    e.preventDefault();
    setTargetingWeaponId(null);
    document.body.style.cursor = 'default';
  };

  return (
    <div className="enemy-core-panel" onContextMenu={handleRightClick}>
      <div className="enemy-sprite-container">
        <img src={ship.sprite} alt="enemy ship" className="enemy-sprite" />
      </div>

      <div className="enemy-subsystems-grid">
        {subsystemOrder.map((type) => {
          const state = ship.subsystems[type];
          return (
            <div
              key={type}
              className={`subsystem-tile ${state.isDisabled ? 'disabled' : ''}`}
              onClick={() => handleAssignTarget(type)}
            >
              <img
                src={`/sprites/subsystems/${type}.png`}
                alt={type}
                className="subsystem-icon"
              />
              <span className="subsystem-hp">
                {state.currentHp} / {state.maxHp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EnemyCorePanel;
