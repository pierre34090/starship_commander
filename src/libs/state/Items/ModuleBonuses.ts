// src/libs/state/Items/ModuleBonuses.ts

import type { DamageType, ElementalEffectType } from '../../logic/combat/DamageType';

export type FlatAndMult = {
  flat?: number;
  mult?: number;
};

export type DamageBonuses = Record<DamageType, FlatAndMult>;
export type ElementalBonuses = {
  elementalDamage: Record<ElementalEffectType, FlatAndMult>;
  elementalEffectDuration: Record<ElementalEffectType, FlatAndMult>;
};

export type BaseModuleBonuses = {
  evasion?: FlatAndMult;
  globalDamage?: FlatAndMult;
  hp?: FlatAndMult;
  maxShield?: FlatAndMult;
  regenShield?: FlatAndMult;
  maxEnergy?: FlatAndMult;
  regenAmmo?: FlatAndMult;
  maxAmmo?: FlatAndMult;
  armor?: FlatAndMult;
  precision?: FlatAndMult;
  elementalEffectProbability?: FlatAndMult;
  damageByType?: DamageBonuses;
} & ElementalBonuses;
