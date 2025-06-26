// src/libs/logic/Combat/AttackProcessor.ts

import { getHitChance, computeRawDamage } from './DamageModel';
import { applyFlatDamageToShip } from './DamageModel';
import { maybeApplyElementalEffect } from './ElementalEffectUtils';
import { applyFlatDamageToSubsystemIfShieldDown } from './DamageModel';

import type { ShipState } from '../../state/Ships/ShipState';
import type { WeaponState } from '../../state/Items/WeaponState';
import type { ShipEffectiveAttributes } from '../../state/Ships/ShipEffectiveAttributes';

import { MessageBus } from '../../../contexts/MessageContext';

/**
 * Applies a full weapon attack:
 * - checks for dodge,
 * - applies base damage using DamageModel,
 * - applies any elemental effect if applicable.
 */

export function takeAttack(
  defender: ShipState,
  attackerStats: ShipEffectiveAttributes,
  defenderStats: ShipEffectiveAttributes,
  weapon: WeaponState
): ShipState {
  const hitChance = getHitChance(attackerStats.precision, defenderStats.evasion);
  const hit = Math.random() < hitChance;

  if (!hit) {
    return defender;
  }

  const rawDamage = computeRawDamage(weapon, attackerStats);

  let damaged = applyFlatDamageToShip(defender, weapon.type, rawDamage);

  damaged = applyFlatDamageToSubsystemIfShieldDown(damaged, rawDamage, weapon);

  //  Applique un éventuel effet élémentaire
  return maybeApplyElementalEffect(damaged, weapon, attackerStats);
}


/**
 * Processes all active weapons of a ship for one round:
 * - skips inactive weapons or weapons still on cooldown,
 * - fires ready weapons, applies damage,
 * - updates cooldowns.
 */
export function processWeaponRound(
  attacker: ShipState,
  attackerStats: ShipEffectiveAttributes,
  defender: ShipState,
  defenderStats: ShipEffectiveAttributes
): [ShipState, ShipState] {
  const updatedWeapons: WeaponState[] = [];
  let updatedDefender = defender;
  let newAmmo = attacker.currentAmmo;
  

  for (const weapon of attacker.weapons) {
    if (!weapon.isActive) {
      updatedWeapons.push(weapon);
      continue;
    }

    if (weapon.cooldownRemaining > 0) {
      updatedWeapons.push({
        ...weapon,
        cooldownRemaining: weapon.cooldownRemaining - 1,
      });
      continue;
    }

    if (newAmmo < weapon.ammoConsumption) {
      updatedWeapons.push({
        ...weapon,
        cooldownRemaining: 0,
      });
      continue;
    }

    if (!weapon.target) {
      updatedWeapons.push(weapon);
      continue;
    }


    updatedDefender = takeAttack(updatedDefender, attackerStats, defenderStats, weapon);

    newAmmo -= weapon.ammoConsumption;

    updatedWeapons.push({
      ...weapon,
      cooldownRemaining: weapon.cooldown,
    });
  }

  const updatedAttacker = {
    ...attacker,
    currentAmmo: newAmmo,
    weapons: updatedWeapons,
  };


  return [updatedAttacker, updatedDefender];
}