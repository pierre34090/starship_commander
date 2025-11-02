// src/components/GameScreenComponents/WeaponsPanel.tsx

import React, { useContext, useState } from 'react';
import '../../../css/GameScreenComponents/WeaponsPanel.css';

import { GameContext } from '../../../contexts/GameContext';
import {
  canAllocateEnergy,
  allocateEnergyPoint,
  deallocateEnergyPoint,
} from '../../../libs/state/Ships/SubsystemLogic';

import type { WeaponState } from '../../../libs/state/Items/WeaponState';
import type { ShipState } from '../../../libs/state/Ships/ShipState';

import DisplayWeapon from './WeaponTile';
import { computeEffectiveAttributes } from '../../../libs/state/Ships/ShipLogic';

interface ShipPanelProps {
  ship: ShipState;
}

const WeaponsPanel: React.FC<ShipPanelProps> = ({ ship }) => {
  const context = useContext(GameContext);
  if (!context) return null;

  const { gameState, setGameState } = context;
  if (!gameState) return null;

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const isPlayer = ship.id === gameState.player_ship.id;
  const stats = computeEffectiveAttributes(ship);
  const ammoRatio = Math.min(ship.currentAmmo / stats.maxAmmo, 1);

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

  const swapWeapons = (fromIndex: number, toIndex: number) => {
    const newWeapons = [...ship.weapons];
    const [moved] = newWeapons.splice(fromIndex, 1);
    newWeapons.splice(toIndex, 0, moved);
    updateShipInGameState({ ...ship, weapons: newWeapons });
  };

  const handleLeftClick = (weapon: WeaponState) => {
    if (weapon.isActive) return;
    if (!canAllocateEnergy(ship, 'weapons', weapon.energyConsumption)) return;

    const updatedShip = allocateEnergyPoint(ship, 'weapons', weapon.energyConsumption);
    const updatedWeapons = updatedShip.weapons.map((w) =>
      w.id === weapon.id ? { ...w, isActive: true } : w
    );
    updateShipInGameState({ ...updatedShip, weapons: updatedWeapons });
  };

  const handleRightClick = (e: React.MouseEvent, weapon: WeaponState) => {
    e.preventDefault();
    if (!weapon.isActive) return;

    const updatedShip = deallocateEnergyPoint(ship, 'weapons', weapon.energyConsumption);
    const updatedWeapons = updatedShip.weapons.map((w) =>
      w.id === weapon.id ? { ...w, isActive: false } : w
    );
    updateShipInGameState({ ...updatedShip, weapons: updatedWeapons });
  };

  return (
    <div
      className="weapons-panel-wrapper"
      onMouseMove={(e) => setMousePosition({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setDraggedIndex(null)}
    >
      <div className="weapons-grid">
        {(ship.weapons ?? []).map((weapon, index) => (
          <DisplayWeapon
            key={weapon.id}
            weapon={weapon}
            onLeftClick={() => handleLeftClick(weapon)}
            onRightClick={(e) => handleRightClick(e, weapon)}
            index={index}
            draggedIndex={draggedIndex}
            setDraggedIndex={setDraggedIndex}
            onDrop={(targetIndex) => {
              if (draggedIndex !== null && draggedIndex !== targetIndex) {
                swapWeapons(draggedIndex, targetIndex);
              }
              setDraggedIndex(null);
            }}
            onStartDrag={(offset) => setDragOffset(offset)}
          />
        ))}
      </div>

      <div
        className="ammo-bar-wrapper"
        title={`Ammo: ${ship.currentAmmo} / ${stats.maxAmmo}`}
      >
        <div className="bar-background vertical">
          <div
            className="bar-fill-ammo"
            style={{ height: `${ammoRatio * 100}%` }}
          />
        </div>
        <img
          src="/sprites/weapons/ammo.png"
          alt="ammo"
          className="ammo-icon"
        />
      </div>

      {draggedIndex !== null && ship.weapons[draggedIndex] && (
        <div
          className="weapon-drag-preview"
          style={{
            position: 'fixed',
            top: mousePosition.y - dragOffset.y,
            left: mousePosition.x - dragOffset.x,
            pointerEvents: 'none',
            opacity: 0.95,
            zIndex: 1000,
          }}
        >
          <DisplayWeapon
            weapon={ship.weapons[draggedIndex]}
            onLeftClick={() => {}}
            onRightClick={() => {}}
            index={draggedIndex}
            draggedIndex={null}
            setDraggedIndex={() => {}}
            onDrop={() => {}}
            isPreview={true}
          />
        </div>
      )}
    </div>
  );
};

export default WeaponsPanel;
