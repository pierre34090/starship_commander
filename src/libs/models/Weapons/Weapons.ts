import type { WeaponState } from '../../state/WeaponState';

export const laserBlaster: WeaponState = {
  name: 'Laser Blaster',
  description: 'A standard-issue laser weapon. Reliable and precise.',
  attack: 5,
};

export const plasmaCannon: WeaponState = {
  name: 'Plasma Cannon',
  description: 'Fires concentrated plasma bursts. High damage but slow cooldown.',
  attack: 12,
};

export const ionRay: WeaponState = {
  name: 'Ion Ray',
  description: 'Disrupts enemy systems. Weak damage but may cause malfunctions.',
  attack: 3,
};

export const railgun: WeaponState = {
  name: 'Railgun',
  description: 'Fires high-velocity projectiles. Penetrates most armors.',
  attack: 10,
};

export const organicSporeGun: WeaponState = {
  name: 'Spore Gun',
  description: 'Launches corrosive spores. Damage increases over time.',
  attack: 7,
};
