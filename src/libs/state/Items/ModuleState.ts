// src/libs/state/Items/ModuleState.ts

export type ModuleState = {
  name: string;
  description: string;
  sprite: string;

  price: number;
  isActive: boolean;
  energyConsumption: number;

  // Combat bonuses

  evasionFlat?: number;
  evasionMult?: number;

  globalDamageFlat?: number;
  globalDamageMult?: number;

  hpFlat?: number;
  hpMult?: number;

  maxShieldFlat?: number;
  maxShieldMult?: number;

  regenShieldFlat?: number;
  regenShieldMult?: number;

  maxEnergyFlat?: number;
  maxEnergyMult?: number;

  regenAmmoFlat?: number;
  regenAmmoMult?: number;

  maxAmmoFlat?: number;
  maxAmmoMult?: number;

  armorFlat?: number;
  armorMult?: number;

  precisionFlat?: number;
  precisionMult?: number;

  elementalEffectProbabilityFlat?: number;
  elementalEffectProbabilityMult?: number;

  normalDamageFlat?: number;
  normalDamageMult?: number;

  explosiveDamageFlat?: number;
  explosiveDamageMult?: number;

  ionDamageFlat?: number;
  ionDamageMult?: number;

  corrosiveDamageFlat?: number;
  corrosiveDamageMult?: number;
};

export const initModuleState = (): ModuleState => ({
  name: '',
  description: '',
  sprite: '',
  price: 0,
  isActive: false,
  energyConsumption: 0,
});
