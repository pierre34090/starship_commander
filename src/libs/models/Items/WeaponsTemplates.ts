// src/libs/models/Items/WeaponsTemplates.ts

import type { WeaponState } from '../../state/Items/WeaponState';

export const laserBlaster: Omit<WeaponState, 'id'> = {
  name: 'Laser Blaster',
  description: 'A standard-issue laser weapon. Reliable and precise.',
  sprite: 'sprites/weapons/laser_blaster.png',
  price: 100,
  isActive: true,
  damage: 5,
  cooldown: 1,
  cooldownRemaining: 0,
  type: 'normal',
  ammoConsumption: 1,
  energyConsumption: 2,
  elementalEffectProbability: 0.0,
};

export const plasmaBomb: Omit<WeaponState, 'id'> = {
  name: 'Plasma Bomb',
  description: 'Fires a slow but powerful explosive charge. Deals area damage.',
  sprite: 'sprites/weapons/laser_blaster.png',
  price: 250,
  isActive: true,
  damage: 12,
  cooldown: 3,
  cooldownRemaining: 0,
  type: 'explosive',
  ammoConsumption: 2,
  energyConsumption: 4,
  elementalEffectProbability: 0.9,
};

export const ionPulse: Omit<WeaponState, 'id'> = {
  name: 'Ion Pulse',
  description: 'Disrupts enemy systems without causing hull damage.',
  sprite: 'sprites/weapons/laser_blaster.png',
  price: 180,
  isActive: false,
  damage: 0,
  cooldown: 2,
  cooldownRemaining: 0,
  type: 'ion',
  ammoConsumption: 1,
  energyConsumption: 3,
  elementalEffectProbability: 0.6,
};

export const acidSprayer: Omit<WeaponState, 'id'> = {
  name: 'Acid Sprayer',
  description: 'Sprays corrosive acid, slowly damaging enemy hull over time.',
  sprite: 'sprites/weapons/laser_blaster.png',
  price: 150,
  isActive: false,
  damage: 4,
  cooldown: 2,
  cooldownRemaining: 0,
  type: 'corrosive',
  ammoConsumption: 1,
  energyConsumption: 2,
  elementalEffectProbability: 0.4,
};
