// src/components/DisplayShipInfo.tsx

import "../css/DisplayShipInfo.css";
import React from 'react';
import type { ShipState } from '../libs/state/Ships/ShipState';
import { ELEMENTAL_TYPES, ElementalEffectType } from '../libs/logic/combat/DamageType';
import { computeEffectiveAttributes } from '../libs/state/Ships/ShipLogic';

type DisplayShipInfoProps = {
  ship: ShipState;
};

export const DisplayShipInfo: React.FC<DisplayShipInfoProps> = ({ ship }) => {
  const effective = computeEffectiveAttributes(ship);

  const getRatio = (current: number, max?: number) =>
    max && max > 0 ? Math.min((current / max) * 100, 100) : 0;

  const hpPercent = getRatio(ship.currentHp, effective.maxHp);
  const shieldPercent = getRatio(ship.currentShield, effective.maxShield);
  const armorPercent = getRatio(ship.currentArmor, effective.maxArmor);

  const elementalStacks: Record<ElementalEffectType, number> = ELEMENTAL_TYPES.reduce((acc, type) => {
    acc[type] = ship.statusEffects.filter(e => e.type === type).length;
    return acc;
  }, { corrosive: 0, fire: 0, ion: 0 });

  return (
    <div className="panel">
      <Bar label="HP" value={ship.currentHp} max={effective.maxHp} percent={hpPercent} type="hp" />
      <Bar label="Shield" value={ship.currentShield} max={effective.maxShield} percent={shieldPercent} type="shield" />
      <Bar label="Armor" value={ship.currentArmor} max={effective.maxArmor} percent={armorPercent} type="armor" />

      <div className="elemental-effects-row">
        {ELEMENTAL_TYPES.map(type =>
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
  type: 'hp' | 'shield' | 'armor';
};

const Bar: React.FC<BarProps> = ({ label, value, max, percent, type }) => {
  return (
    <div className="bar-wrapper">
      <div className="bar-label">{label}</div>
      <div className={`bar-background bar-${type}`}>
        <div className="bar-fill" style={{ width: `${percent}%` }} />
        <span className="bar-text">
          {value} / {max ?? '?'}
        </span>
      </div>
    </div>
  );
};

type ElementalEffectIconProps = {
  type: ElementalEffectType;
  count: number;
};

const ElementalEffectIcon: React.FC<ElementalEffectIconProps> = ({ type, count }) => {
  const src = `/sprites/elementalEffects/${type}.png`;

  return (
    <div className="elemental-effect-icon">
      <img src={src} alt={type} />
      <span className="effect-count">{count}</span>
    </div>
  );
};
