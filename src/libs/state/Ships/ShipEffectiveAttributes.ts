// src/libs/state/Ships/ShipEffectiveAttributes.ts

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

  damageByType: {
    normal: number;
    explosive: number;
    ion: number;
    corrosive: number;
  };
};