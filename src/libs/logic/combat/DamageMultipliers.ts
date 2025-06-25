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
      case 'ion': return 2.0;
      case 'normal': return 1.0;
      case 'fire': return 0.5;
      case 'corrosive': return 0.0;
    }
  }

  if (target === 'armor') {
    switch (damageType) {
      case 'corrosive': return 2.0;
      case 'normal': return 1;
      case 'fire': return 0.5;
      case 'ion': return 0.0;
    }
  }

  if (target === 'hp') {
    switch (damageType) {
      case 'fire': return 2.0;
      case 'normal': return 1.0;
      case 'corrosive':
      case 'ion': return 0.5;
    }
  }

  // Fallback for safety
  return 1.0;
}
