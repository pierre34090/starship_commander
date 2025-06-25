// src/libs/logic/combat/ElementalEffectUtils.ts

import type { ShipState } from '../../state/Ships/ShipState';
import type { WeaponState } from '../../state/Items/WeaponState';
import type { ShipEffectiveAttributes } from '../../state/Ships/ShipEffectiveAttributes';
import type { ElementalEffect } from './DamageType';

import { ELEMENTAL_TYPES } from './DamageType';
import { applyFlatDamageToShip } from './DamageModel';
import { computeEffectiveAttributes } from '../../state/Ships/ShipLogic';
import { MessageBus } from '../../../contexts/MessageContext';

/**
 * Applique un effet élémentaire spécifique à un vaisseau, avec ses dégâts.
 */
export function applyElementalDamage(
  ship: ShipState,
  type: keyof ShipEffectiveAttributes['elementalDamage'],
  baseDamage: number
): ShipState {
  return applyFlatDamageToShip(ship, type, baseDamage); // Applique les dégâts plats du type donné
}

/**
 * Applique tous les effets élémentaires actifs à un vaisseau :
 * - Dégâts passifs par type
 * - Réduction de durée
 * - Nettoyage des effets expirés
 */
export function applyElementalStatusEffects(ship: ShipState): ShipState {
  let updatedShip = ship;
  const attrs: ShipEffectiveAttributes = computeEffectiveAttributes(ship);

  for (const type of ELEMENTAL_TYPES) {
    const totalStacks = ship.statusEffects.filter((e) => e.type === type); // Récupère tous les effets actifs de ce type
    const damage = attrs.elementalDamage[type] ?? 0; // Dégâts élémentaires passifs pour ce type

    for (const effect of totalStacks) {
      if (damage > 0) {
        updatedShip = applyFlatDamageToShip(updatedShip, type, damage); // Applique les dégâts à chaque stack
        MessageBus.send({
          type: 'combat',
          text: `${ship.name} suffers ${damage} ${type} damage from ongoing effect.`, // Message combat
        });
      }
    }
  }

  const remainingEffects: ElementalEffect[] = updatedShip.statusEffects
    .map((e) => ({ ...e, remainingTurns: e.remainingTurns - 1 })) // Réduction de la durée de chaque effet
    .filter((e) => e.remainingTurns > 0); // On ne garde que les effets restants

  return {
    ...updatedShip,
    statusEffects: remainingEffects, // Remise à jour de la liste des effets actifs
  };
}

/**
 * Peut appliquer un effet élémentaire (brûlure, ionisation, etc.) au défenseur
 * selon la probabilité définie par l'arme. Ajoute un nouveau `statusEffect` de type correspondant.
 */
export function maybeApplyElementalEffect(
  defender: ShipState,
  weapon: WeaponState,
  attackerStats: ShipEffectiveAttributes
): ShipState {
  const chance = weapon.elementalEffectProbability;
  const damageType = weapon.type;

  // Pas d’effet possible pour les armes normales
  if (damageType === 'normal' || chance <= 0) return defender;
  

  const rolled = Math.random();
  if (rolled > chance) return defender;

  const duration = attackerStats.elementalEffectDuration[damageType];
  if (duration <= 0) return defender;

  const newEffect: ElementalEffect = {
    type: damageType,
    remainingTurns: duration,
  };

  MessageBus.send({
    type: 'combat',
    text: `${defender.name} is affected by ${damageType} effect for ${duration} turns!`,
  });

  return {
    ...defender,
    statusEffects: [...defender.statusEffects, newEffect],
  };
}