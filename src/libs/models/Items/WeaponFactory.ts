// src/libs/factories/WeaponFactory.ts


//SERVIRA PLUS TARD POUR GENERER ALEATOIRE LE STUFF DES ENEMIS

import type { WeaponState } from '../../state/Items/WeaponState';
import { v4 as uuidv4 } from 'uuid';

/**
 * Crée une instance unique d'une arme à partir d'un template (sans id).
 * Génère un UUID unique pour l'arme.
 */
export function createWeaponInstance(template: Omit<WeaponState, 'id'>): WeaponState {
  return {
    id: uuidv4(),
    ...template,
  };
}
