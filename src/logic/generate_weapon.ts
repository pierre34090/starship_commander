// src/logic/generate_weapon.ts

import { Weapon } from "../models/weapons/Weapon";

// Liste d’exemples de noms d’armes
const weaponNames = [
  "Laser Mk I",
  "Plasma Cutter",
  "Ion Blaster",
  "Railgun",
  "Photon Torpedo",
  "Pulse Cannon",
  "Missile Launcher",
  "Gauss Rifle",
  "Particle Beam",
  "EMP Emitter"
];

/** Retourne une instance Weapon avec un nom choisi aléatoirement. */
export function generateRandomWeapon(): Weapon {
  const idx = Math.floor(Math.random() * weaponNames.length);
  const name = weaponNames[idx];
  return new Weapon(name);
}
