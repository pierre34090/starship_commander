// src/components/GameScreenComponents/SubsystemTile.tsx

import React from 'react';
import type { SubsystemType } from '../../../libs/state/Ships/ShipSubsystems';
import type { ShipState } from '../../../libs/state/Ships/ShipState';

interface Props {
  ship: ShipState;
  subsystem: SubsystemType;
  onLeftClick: () => void;
  onRightClick: (e: React.MouseEvent) => void;
}

const SubsystemTile: React.FC<Props> = ({ ship, subsystem, onLeftClick, onRightClick }) => {
  const sys = ship.subsystems[subsystem];
  const energyAllocated = ship.energyAllocation[subsystem];
  const energyMax = sys.level;

  const hpPerLevel = sys.hpPerLevel;
  const currentHp = sys.currentHp;

  return (
    <div
      onClick={onLeftClick}
      onContextMenu={onRightClick}
      style={{
        width: '100px',
        height: '80px',
        borderRadius: '6px',
        backgroundColor: sys.isDisabled ? '#444' : 'rgba(255, 255, 255, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        fontFamily: 'monospace',
        fontSize: '12px',
        position: 'relative',
        padding: '6px 4px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '13px', color: 'white' }}>{subsystem.toUpperCase()}</div>

      <div style={{ color: '#ccc' }}>
        {sys.currentHp} / {sys.maxHp} HP
      </div>

      <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>
        {Array.from({ length: energyMax }).map((_, i) => {
          const start = i * hpPerLevel;
          const end = (i + 1) * hpPerLevel;

          let healthRatio = 1;
          if (currentHp <= start) healthRatio = 0;
          else if (currentHp < end) healthRatio = (currentHp - start) / hpPerLevel;

          const fillColor = i < energyAllocated ? 'white' : 'transparent';
          const damageOverlay = healthRatio < 1 ? `linear-gradient(to top, red ${100 - healthRatio * 100}%, transparent ${100 - healthRatio * 100}%)` : '';

          return (
            <div
              key={i}
              style={{
                width: '8px',
                height: '7px',
                border: '1px solid white',
                borderRadius: '1px',
                backgroundColor: fillColor,
                backgroundImage: damageOverlay,
                backgroundBlendMode: 'multiply',
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SubsystemTile;
