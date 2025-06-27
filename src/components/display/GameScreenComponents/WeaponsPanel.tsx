// src/components/GameScreenComponents/WeaponsPanel.tsx

import React, { useContext } from 'react';

// ✅ Module CSS importé correctement
import styles from '../../../css/PanelStyles.module.css';
import '../../../css/GameScreenComponents/WeaponsPanel.css';

import { GameContext } from '../../../contexts/GameContext';
import { assignWeaponTarget } from '../../../libs/state/Ships/ShipLogic';
import {
  canAllocateEnergy,
  allocateEnergyPoint,
  deallocateEnergyPoint,
} from '../../../libs/state/Ships/SubsystemLogic';

import type { WeaponState } from '../../../libs/state/Items/WeaponState';
import type { SubsystemType } from '../../../libs/state/Ships/ShipSubsystems';
import type { ShipState } from '../../../libs/state/Ships/ShipState';

interface ShipPanelProps {
  ship: ShipState;
}

const WeaponsPanel: React.FC<ShipPanelProps> = ({ ship }) => {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState, setGameState } = context;
  if (!gameState) return null;

  const isPlayer = ship.id === gameState.player_ship.id;
  const currentEnemy = gameState.stageEnemies.find(e => e.status === 'alive');

  const updateShipInGameState = (updatedShip: ShipState) => {
    if (isPlayer) {
      setGameState({ ...gameState, player_ship: updatedShip });
    } else {
      const updatedEnemies = gameState.stageEnemies.map((e) =>
        e.id === ship.id ? updatedShip : e
      );
      setGameState({ ...gameState, stageEnemies: updatedEnemies });
    }
  };

  const handleLeftClick = (weapon: WeaponState) => {
    if (weapon.isActive && currentEnemy) {
      const updatedShip = assignWeaponTarget(ship, weapon.id, {
        shipId: currentEnemy.id,
        subsystem: 'shields',
      });
      updateShipInGameState(updatedShip);
    } else if (canAllocateEnergy(ship, 'weapons', weapon.energyConsumption)) {
      const updatedShip = allocateEnergyPoint(ship, 'weapons', weapon.energyConsumption);
      const updatedWeapons = updatedShip.weapons.map((w) =>
        w.id === weapon.id ? { ...w, isActive: true } : w
      );
      updateShipInGameState({ ...updatedShip, weapons: updatedWeapons });
    }
  };

  const handleRightClick = (e: React.MouseEvent, weapon: WeaponState) => {
    e.preventDefault();
    if (!weapon.isActive) return;

    const updatedShip = deallocateEnergyPoint(ship, 'weapons');
    const updatedWeapons = updatedShip.weapons.map((w) =>
      w.id === weapon.id ? { ...w, isActive: false } : w
    );
    updateShipInGameState({ ...updatedShip, weapons: updatedWeapons });
  };

  const handleTargetChange = (weaponId: string, value: SubsystemType) => {
    if (!currentEnemy) return;

    const updatedWeapons = ship.weapons.map((w) =>
      w.id === weaponId
        ? {
            ...w,
            target: {
              shipId: currentEnemy.id,
              subsystem: value,
            },
          }
        : w
    );

    updateShipInGameState({ ...ship, weapons: updatedWeapons });
  };

  return (
    <div className={styles.panel}>
      <h3 className="weapon-panel-title">Weapons</h3>
      <div className="weapons-container">
        {(ship.weapons ?? []).map((weapon) => (
          <div
            key={weapon.id}
            onClick={() => handleLeftClick(weapon)}
            onContextMenu={(e) => handleRightClick(e, weapon)}
            className={`weapon-card ${weapon.isActive ? 'active' : 'inactive'}`}
          >
            <strong>{weapon.name}</strong>
            <p>{weapon.description}</p>
            <p>⚡ {weapon.energyConsumption} | ⏳ {weapon.cooldownRemaining}</p>
            {weapon.isActive && currentEnemy && (
              <select
                value={weapon.target?.subsystem ?? ''}
                onChange={(e) =>
                  handleTargetChange(weapon.id, e.target.value as SubsystemType)
                }
              >
                <option value="">-- Target --</option>
                {(['shields', 'weapons', 'engines', 'targeting'] as SubsystemType[]).map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeaponsPanel;
