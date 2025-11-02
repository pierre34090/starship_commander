// src/components/GameScreenComponents/WeaponTile.tsx

import React, { useContext } from 'react';
import { GameContext } from '../../../contexts/GameContext';
import type { WeaponState } from '../../../libs/state/Items/WeaponState';
import '../../../css/GameScreenComponents/WeaponTile.css';

interface DisplayWeaponProps {
  weapon: WeaponState;
  onLeftClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;

  index: number;
  draggedIndex: number | null;
  setDraggedIndex: (i: number | null) => void;
  onDrop: (targetIndex: number) => void;
  onStartDrag?: (offset: { x: number; y: number }) => void;
  isPreview?: boolean;
}

const DisplayWeapon: React.FC<DisplayWeaponProps> = ({
  weapon,
  onLeftClick,
  onRightClick,
  index,
  draggedIndex,
  setDraggedIndex,
  onDrop,
  onStartDrag,
  isPreview = false,
}) => {
  const { targetingWeaponId, setTargetingWeaponId } = useContext(GameContext)!;

  const cooldownRatio =
    weapon.cooldown > 0
      ? 1 - Math.min(weapon.cooldownRemaining / weapon.cooldown, 1)
      : 0;

  const showEffectIcon = weapon.type !== 'normal';
  const isReadyNoTarget =
    weapon.isActive && weapon.cooldownRemaining === 0 && !weapon.target;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreview) return;
    setDraggedIndex(index);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    if (onStartDrag) onStartDrag(offset);
  };

  const handleClick = () => {
    if (isPreview) return;

    if (!weapon.isActive) {
      onLeftClick(); // activation normale
      return;
    }

    // Arme déjà active : ciblage
    setTimeout(() => {
      setTargetingWeaponId(weapon.id);
      document.body.style.cursor = "url('/sprites/weapons/targetCursor.png') 8 8, auto";
    }, 0);
  };

  const tileClass = [
    'weapon-tile',
    weapon.isActive ? 'active' : '',
    isReadyNoTarget ? 'ready-no-target' : '',
    !isPreview && draggedIndex === index ? 'dragged' : '',
  ].join(' ');

  return (
    <div
      className={tileClass}
      onMouseDown={handleMouseDown}
      onMouseUp={() => !isPreview && onDrop(index)}
      onClick={handleClick}
      onContextMenu={onRightClick}
    >
      <div className="cooldown-bar-container">
        <div
          className="cooldown-bar-fill"
          style={{ height: `${cooldownRatio * 100}%` }}
        />
      </div>

      <div className="weapon-content">
        <div className="weapon-top-row">
          {weapon.ammoConsumption > 0 && (
            <div className="ammo-info">
              <span>{weapon.ammoConsumption}</span>
              <img
                src="/sprites/weapons/ammo.png"
                alt="ammo"
                className="ammo-icon"
              />
            </div>
          )}
          {showEffectIcon && (
            <img
              src={`/sprites/elementalEffects/${weapon.type}.png`}
              alt={weapon.type}
              className="elemental-icon"
            />
          )}
        </div>

        <div className="weapon-name">{weapon.name}</div>

        <div className="energy-boxes">
          {Array.from({ length: weapon.energyConsumption }).map((_, i) => (
            <div
              key={i}
              className={`energy-box ${weapon.isActive ? 'filled' : 'empty'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayWeapon;
