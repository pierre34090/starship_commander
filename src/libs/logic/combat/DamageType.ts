// src/libs/logic/combat/DamageType.ts

export type DamageType = 'normal' | 'ion' | 'corrosive' | 'explosive';
export const DAMAGE_TYPES: DamageType[] = ['normal', 'ion', 'corrosive', 'explosive'];

// Elemental = all damage types except 'normal'
export type ElementalEffectType = Exclude<DamageType, 'normal'>;
export const ELEMENTAL_TYPES: ElementalEffectType[] = ['ion', 'corrosive', 'explosive'];

export type ElementalEffect = {
  type: ElementalEffectType; // donc 'ion' | 'explosive' | 'corrosive'
  remainingTurns: number;
};

