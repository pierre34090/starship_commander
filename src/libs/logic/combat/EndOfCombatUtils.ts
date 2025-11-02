// src/libs/logic/Combat/EndOfCombatManager.ts

import type { GameState } from '../../state/GameState';
import type { ShipState } from '../../state/Ships/ShipState';

import { computeEffectiveAttributes } from '../../state/Ships/ShipLogic';
import { MessageBus } from '../../../contexts/MessageContext';

/**
 * Apply end-of-combat effects to a ship:
 * - Full restore of shield and armor
 * - Passive ammo regeneration
 */
export function applyToShipEndOfCombat(ship: ShipState): ShipState {
  const effective = computeEffectiveAttributes(ship);

  const restoredShield = effective.maxShield;
  const restoredArmor = effective.maxArmor;
  const regenAmmo = effective.regenAmmo;

  const newAmmo = Math.min(ship.currentAmmo + regenAmmo, effective.maxAmmo);

  if (regenAmmo > 0) {
    MessageBus.send({
      type: 'info',
      text: `${ship.name}: +${regenAmmo} ammo regenerated.`,
    });
  }

  MessageBus.send({
    type: 'info',
    text: `${ship.name}: shield and armor fully restored.`,
  });

  return {
    ...ship,
    currentShield: restoredShield,
    currentArmor: restoredArmor,
    currentAmmo: newAmmo,
    statusEffects: [], // Clear all ongoing elemental effects
  };
}

/**
 * Applies combat rewards (XP and credits) and triggers post-combat regeneration.
 */
export function collectCombatReward(
  state: GameState,
  enemy: ShipState
): GameState {
  const moneyReward = enemy.creditsBounty ?? 0;
  const xpReward = enemy.xpBounty ?? 0;
  const incomeBonus = state.economy.income;
  const totalCredits = moneyReward + incomeBonus;

  MessageBus.send({
    type: 'success',
    text: `Defeated ${enemy.name}! +${xpReward} XP, +${totalCredits} credits.`,
  });

  return {
    ...state,
    economy: {
      ...state.economy,
      credits: state.economy.credits + totalCredits,
    },
    player_ship: applyToShipEndOfCombat({
      ...state.player_ship,
      xp: (state.player_ship.xp ?? 0) + xpReward,
    }),
  };
}
