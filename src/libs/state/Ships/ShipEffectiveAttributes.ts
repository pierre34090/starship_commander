import type { DamageType, ElementalEffectType } from '../../logic/combat/DamageType';

export type ShipEffectiveAttributes = {
  maxHp: number;
  maxShield: number;
  maxArmor: number;

  regenShield: number;

  globalDamage: number;
  precision: number;
  evasion: number;

  maxEnergy: number;

  regenAmmo: number;
  maxAmmo: number;

  elementalEffectProbability: number;

  damageByType: Record<DamageType, number>;

  elementalDamage: Record<ElementalEffectType, number>;
  elementalEffectDuration: Record<ElementalEffectType, number>;
};
