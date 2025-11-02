// src/libs/logic/Combat/DamageMultipliers.ts

import type { DamageType } from './DamageType';

export type DamageTarget = 'shield' | 'armor' | 'hp';

/**
 * Returns how much damage of a given type affects a given target.
 */
export function getDamageMultiplierByTarget(
  damageType: DamageType,
  target: DamageTarget
): number {
  if (target === 'shield') {
    switch (damageType) {
      case 'ion': return 4.0;
      case 'normal': return 2.0;
      case 'fire': return 1;
      case 'corrosive': return 1;
    }
  }

  if (target === 'armor') {
    switch (damageType) {
      case 'corrosive': return 4.0;
      case 'normal': return 2;
      case 'fire': return 1;
      case 'ion': return 1;
    }
  }

  if (target === 'hp') {
    switch (damageType) {
      case 'fire': return 4;
      case 'normal': return 2;
      case 'corrosive': return 1;
      case 'ion': return 1;
    }
  }

  // Fallback for safety
  return 1.0;
}
