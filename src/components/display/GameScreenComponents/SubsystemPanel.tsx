// src/components/GameScreenComponents/SubsystemPanel.tsx

import React, { useContext } from 'react';
import '../../../css/GameScreenComponents/SubsystemPanel.css';

import type { SubsystemType } from '../../../libs/state/Ships/ShipSubsystems';
import type { ShipState } from '../../../libs/state/Ships/ShipState';

import { GameContext } from '../../../contexts/GameContext';
import {
  canAllocateEnergy,
  allocateEnergyPoint,
  deallocateEnergyPoint,
} from '../../../libs/state/Ships/SubsystemLogic';

import SubsystemTile from './SubsystemTile';

interface Props {
  ship: ShipState;
}

const SubsystemPanel: React.FC<Props> = ({ ship }) => {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState, setGameState } = context;
  if (!gameState) return null;

  const isPlayer = ship.id === gameState.player_ship.id;

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

  const handleLeftClick = (subsystem: SubsystemType) => {
    if (!canAllocateEnergy(ship, subsystem, 1)) return;
    const updatedShip = allocateEnergyPoint(ship, subsystem, 1);
    updateShipInGameState(updatedShip);
  };

  const handleRightClick = (e: React.MouseEvent, subsystem: SubsystemType) => {
    e.preventDefault();
    const updatedShip = deallocateEnergyPoint(ship, subsystem);
    updateShipInGameState(updatedShip);
  };

  const subsystemList = Object.keys(ship.subsystems) as SubsystemType[];

  const totalAllocated = Object.values(ship.energyAllocation).reduce((sum, v) => sum + v, 0);
  const ratio = Math.min(totalAllocated / ship.maxEnergy, 1);

  return (
    <div className="subsystem-panel-wrapper">
      <div className="subsystems-grid">
        {subsystemList.map((subsystem) => (
          <SubsystemTile
            key={subsystem}
            ship={ship}
            subsystem={subsystem}
            onLeftClick={() => handleLeftClick(subsystem)}
            onRightClick={(e) => handleRightClick(e, subsystem)}
          />
        ))}
      </div>

      <div
        className="energy-bar-wrapper"
        title={`Energy: ${totalAllocated} / ${ship.maxEnergy}`}
      >
        <div className="bar-background vertical">
          <div
            className="bar-fill-energy"
            style={{ height: `${ratio * 100}%` }}
          />
        </div>
        <img
          src="/sprites/subsytems/energy.png"
          alt="energy"
          className="energy-icon"
        />
      </div>
    </div>
  );
};

export default SubsystemPanel;
