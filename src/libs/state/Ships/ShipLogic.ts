// src/libs/logic/Ships/ShipLogic.ts

import { ShipState } from '../../state/Ships/ShipState';
import { ShipEffectiveAttributes } from '../../state/Ships/ShipEffectiveAttributes';
import { ModuleState } from '../../state/Items/ModuleState';

// --- Effective computation ---

import type { ShipState } from './ShipState';
import type { ShipEffectiveAttributes } from './ShipEffectiveAttributes';
import type { ModuleState } from '../Items/ModuleState';

export function computeEffectiveAttributes(ship: ShipState): ShipEffectiveAttributes {
  const base = ship.baseStats;
  const activeModules = ship.modules.filter((mod) => mod.isActive);

  const sum = (key: keyof ModuleState): number =>
    activeModules.reduce(
      (acc, mod) => acc + (typeof mod[key] === 'number' ? (mod[key] as number) : 0),
      0
    );

  const flat = (suffix: string): number =>
    sum(`${suffix}Flat` as keyof ModuleState);

  const mult = (suffix: string): number =>
    sum(`${suffix}Mult` as keyof ModuleState);

  return {
    maxHp: (base.baseHp + flat('hp')) * (1 + mult('hp')),
    maxShield: (base.baseShield + flat('maxShield')) * (1 + mult('maxShield')),
    maxArmor: (base.baseArmor + flat('armor')) * (1 + mult('armor')),

    regenShield: flat('regenShield') * (1 + mult('regenShield')),

    globalDamage: (base.baseGlobalDamage + flat('globalDamage')) * (1 + mult('globalDamage')),
    precision: (base.basePrecision + flat('precision')) * (1 + mult('precision')),
    evasion: (base.baseEvasion + flat('evasion')) * (1 + mult('evasion')),

    maxEnergy: flat('maxEnergy') * (1 + mult('maxEnergy')),

    regenAmmo: flat('regenAmmo') * (1 + mult('regenAmmo')),
    maxAmmo: flat('maxAmmo') * (1 + mult('maxAmmo')),

    elementalEffectProbability:
      flat('elementalEffectProbability') * (1 + mult('elementalEffectProbability')),

    damageByType: {
      normal: flat('normalDamage') + 100 * mult('normalDamage'),
      explosive: flat('explosiveDamage') + 100 * mult('explosiveDamage'),
      ion: flat('ionDamage') + 100 * mult('ionDamage'),
      corrosive: flat('corrosiveDamage') + 100 * mult('corrosiveDamage'),
    },
  };
}


// --- Ship wrapper ---

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

// --- Stat modifiers ---

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

// --- Stub : damage handling ---

export function takeDamage(target: ShipState, attacker: ShipState): ShipState {
  // TODO: implement damage calculation logic
  return target;
}
