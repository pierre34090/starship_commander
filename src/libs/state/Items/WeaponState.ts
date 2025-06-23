// src/libs/state/Items/WeaponState.ts

export type WeaponState = {
  name: string;
  description: string;
  sprite: string;

  price: number;
  isActive: boolean;

  damage: number;
  cooldown: number;              // cooldown duration (in rounds)
  cooldownRemaining: number;    // turns left before this weapon can fire

  type: 'normal' | 'explosive' | 'ion' | 'corrosive';
  ammoConsumption: number;
  energyConsumption: number;
  elementalEffectProbability: number;
};

export const initWeaponState = (): WeaponState => ({
  name: '',
  description: '',
  sprite: '',
  price: 0,
  isActive: false,
  damage: 0,
  cooldown: 0,
  cooldownRemaining: 0,
  type: 'normal',
  ammoConsumption: 0,
  energyConsumption: 0,
  elementalEffectProbability: 0,
});