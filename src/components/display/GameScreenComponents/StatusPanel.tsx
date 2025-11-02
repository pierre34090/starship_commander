// src/components/display/gameScreenComponents/StatusPanel.tsx

import React from 'react';
import '../../../css/GameScreenComponents/StatusPanel.css';
import { computeEffectiveAttributes } from '../../../libs/state/Ships/ShipLogic';
import { ELEMENTAL_TYPES, ElementalEffectType } from '../../../libs/logic/combat/DamageType';
import type { ShipState } from '../../../libs/state/Ships/ShipState';

type Props = {
  ship: ShipState;
};

export const StatusPanel: React.FC<Props> = ({ ship }) => {
  const stats = computeEffectiveAttributes(ship);

  const getRatio = (current: number, max?: number) =>
    max && max > 0 ? Math.min((current / max) * 100, 100) : 0;

  const hpPercent = getRatio(ship.currentHp, stats.maxHp);
  const shieldPercent = getRatio(ship.currentShield, stats.maxShield);
  const armorPercent = getRatio(ship.currentArmor, stats.maxArmor);

  const elementalStacks: Record<ElementalEffectType, number> = ELEMENTAL_TYPES.reduce((acc, type) => {
    acc[type] = ship.statusEffects.filter(e => e.type === type).length;
    return acc;
  }, { corrosive: 0, fire: 0, ion: 0 });

  return (
    <div className="ship-bars-container">
      <Bar label="HP" value={ship.currentHp} max={stats.maxHp} percent={hpPercent} type="hp" />
      <Bar
        label="Shield"
        value={ship.currentShield}
        max={stats.maxShield}
        regen={stats.regenShield}
        percent={shieldPercent}
        type="shield"
      />
      <Bar label="Armor" value={ship.currentArmor} max={stats.maxArmor} percent={armorPercent} type="armor" />

      <div className="elemental-effects-row">
        {ELEMENTAL_TYPES.map((type) =>
          elementalStacks[type] > 0 ? (
            <ElementalEffectIcon key={type} type={type} count={elementalStacks[type]} />
          ) : null
        )}
      </div>
    </div>
  );
};

type BarProps = {
  label: string;
  value: number;
  max?: number;
  percent: number;
  regen?: number;
  type: 'hp' | 'shield' | 'armor';
};

const Bar: React.FC<BarProps> = ({ label, value, max, percent, regen, type }) => {
  return (
    <div className="bar-wrapper">
      <div className="bar-label">{label}</div>
      <div className={`bar-background bar-${type}`}>
        <div className={`bar-fill bar-fill-${type}`} style={{ width: `${percent}%` }} />
        <span className="bar-text left">
          {value} / {max ?? '?'}
        </span>
        {regen !== undefined && (
          <span className="bar-text right">+{regen}</span>
        )}
      </div>
    </div>
  );
};

const ElementalEffectIcon: React.FC<{ type: ElementalEffectType; count: number }> = ({ type, count }) => {
  const src = `/sprites/elementalEffects/${type}.png`;

  return (
    <div className="elemental-effect-icon">
      <img src={src} alt={type} />
      <span className="effect-count">{count}</span>
    </div>
  );
};
