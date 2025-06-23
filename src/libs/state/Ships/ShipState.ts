// src/libs/state/Ships/ShipState.ts

import { ShipBaseState } from './ShipBaseState';
import { ShipEffectiveAttributes } from './ShipEffectiveAttributes';
import { computeEffectiveAttributes } from './ShipLogic';
import { WeaponState } from '../Items/WeaponState';
import { ModuleState } from '../Items/ModuleState';

export type ShipState = {
  name: string;
  description: string;
  sprite: string;

  baseStats: ShipBaseState;

  currentHp: number;
  currentShield: number;
  currentArmor: number;

  weapons: WeaponState[];
  modules: ModuleState[];
};

export const initShipState = (): ShipState => ({
  name: '',
  description: '',
  sprite: '',
  baseStats: {
    baseHp: 0,
    baseShield: 0,
    baseArmor: 0,
    baseGlobalDamageBonus: 0,
    basePrecision: 0,
    baseEvasion: 0,
  },
  currentHp: 0,
  currentShield: 0,
  currentArmor: 0,
  weapons: [],
  modules: [],
});

// --- Computed Wrapper ---

export type ShipComputed = {
  ship: ShipState;
  attributes: ShipEffectiveAttributes;
};

export function computeShip(ship: ShipState): ShipComputed {
  return {
    ship,
    attributes: computeEffectiveAttributes(ship),
  };
}

export function isShipDead(ship: ShipState): boolean {
  return ship.currentHp <= 0;
}

// --- Stat Modifiers ---

export function modifyHp(
  ship: ShipState,
  delta: number,
  attrs: ShipEffectiveAttributes
): [ShipState, number] {
  const max = attrs.maxHp;
  const before = ship.currentHp;
  const after = Math.max(0, Math.min(before + delta, max));
  const applied = after - before;
  return [{ ...ship, currentHp: after }, applied];
}

export function modifyShield(
  ship: ShipState,
  delta: number,
  attrs: ShipEffectiveAttributes
): [ShipState, number] {
  const max = attrs.maxShield;
  const before = ship.currentShield;
  const after = Math.max(0, Math.min(before + delta, max));
  const applied = after - before;
  return [{ ...ship, currentShield: after }, applied];
}

export function modifyArmor(
  ship: ShipState,
  delta: number,
  attrs: ShipEffectiveAttributes
): [ShipState, number] {
  const max = attrs.maxArmor;
  const before = ship.currentArmor;
  const after = Math.max(0, Math.min(before + delta, max));
  const applied = after - before;
  return [{ ...ship, currentArmor: after }, applied];
}
