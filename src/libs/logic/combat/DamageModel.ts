// src/libs/logic/combat/DamageModel.ts

import { WeaponState } from '../../state/Items/WeaponState';
import { ShipEffectiveAttributes } from '../../state/Ships/ShipEffectiveAttributes';
import { getDamageMultiplierByTarget } from './DamageMultipliers';
import type { DamageType } from './DamageMultipliers';

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
  defenderStats: ShipEffectiveAttributes,
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



/**
 * Splits damage between shield and HP based on type effectiveness and available shield.
 * Assumes damage has already been reduced by armor.
 */
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

  const potentialShieldDamage = damageAfterArmor * shieldRatio;
  const toShield = Math.min(potentialShieldDamage, currentShield);

  const remainingAfterShield = damageAfterArmor - toShield;
  const toHp = remainingAfterShield * hpRatio;

  return { toShield, toHp };
}