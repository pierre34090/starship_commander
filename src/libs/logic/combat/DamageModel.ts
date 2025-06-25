// src/libs/logic/combat/DamageModel.ts

import { WeaponState } from '../../state/Items/WeaponState';
import { ShipEffectiveAttributes } from '../../state/Ships/ShipEffectiveAttributes';
import { getDamageMultiplierByTarget } from './DamageMultipliers';
import type { DamageType } from './DamageType';
import type { ShipState } from '../../state/Ships/ShipState';

/**
 * Compute the hit chance of an attack based on attacker precision and defender evasion.
 * Uses a logistic function centered at equal stats (50% hit chance).
 * Result is clamped between 5% and 95%.
 */
export function getHitChance(precision: number, evasion: number): number {
  const k = 4; // Slope factor: higher = sharper cutoff
  const x = precision - evasion;
  const rawChance = 1 / (1 + Math.exp(-k * x));

  // Clamp to [5%, 95%] to avoid guaranteed hits/misses
  return Math.max(0.05, Math.min(0.95, rawChance));
}

export function computeRawDamage(
  weapon: WeaponState,
  attackerStats: ShipEffectiveAttributes
): number {
  const base = weapon.damage;
  const multiplier = 1 + attackerStats.globalDamage;

  return base * multiplier;
}

/**
 * Applies passive armor reduction before shield/HP handling.
 * Returns remaining damage, absorbed amount, and updated armor value.
 */
export function applyArmorReduction(
  rawDamage: number,
  damageType: DamageType,
  currentArmor: number
): {
  damageAfterArmor: number;
  absorbedByArmor: number;
  newCurrentArmor: number;
} {
  // Armor absorbs up to its value
  const absorption = Math.min(rawDamage, currentArmor);
  const reducedDamage = rawDamage - absorption;

  // Damage type determines how much armor is degraded by the hit
  const armorLossMultiplier = getDamageMultiplierByTarget(damageType, 'armor');
  const armorLoss = absorption * armorLossMultiplier;
  

  return {
    damageAfterArmor: reducedDamage,
    absorbedByArmor: absorption,
    newCurrentArmor: Math.max(0, currentArmor - armorLoss),
  };
}



export function splitDamageBetweenShieldAndHP(
  damageAfterArmor: number,
  damageType: DamageType,
  currentShield: number
): {
  toShield: number;
  toHp: number;
} {
  const shieldRatio = getDamageMultiplierByTarget(damageType, 'shield');
  const hpRatio = getDamageMultiplierByTarget(damageType, 'hp');

  // Max damage that the shield can absorb, taking into account the type effectiveness
  const maxShieldAbsorbable = currentShield / shieldRatio;

  // Actual damage that will be absorbed (if lower than total damage)
  const shieldAbsorbedRaw = Math.min(damageAfterArmor, maxShieldAbsorbable);

  // Convert back to actual shield cost, clamp defensively
  const toShield = Math.min(currentShield, shieldAbsorbedRaw * shieldRatio);

  // Any remaining raw damage is applied to HP
  const remainingAfterShield = damageAfterArmor - shieldAbsorbedRaw;
  const toHp = Math.max(0, remainingAfterShield * hpRatio);

  return { toShield, toHp };
}

export function applyFlatDamageToShip(
  ship: ShipState,
  damageType: DamageType,
  baseDamage: number
): ShipState {
  const currentArmor = ship.currentArmor ?? 0;
  const currentShield = ship.currentShield ?? 0;


  // Step 1: apply armor reduction
  const {
    damageAfterArmor,
    absorbedByArmor, // pour la generation du message de degat
    newCurrentArmor,
  } = applyArmorReduction(baseDamage, damageType, currentArmor);

  // Step 2: split remaining damage between shield and HP
  const {
    toShield,
    toHp,
  } = splitDamageBetweenShieldAndHP(damageAfterArmor, damageType, currentShield);

  const newShield = Math.max(0, currentShield - toShield);
  const newHp = Math.max(0, ship.currentHp - toHp);
  return {
    ...ship,
    currentArmor: newCurrentArmor,
    currentShield: newShield,
    currentHp: newHp,
  };
}
