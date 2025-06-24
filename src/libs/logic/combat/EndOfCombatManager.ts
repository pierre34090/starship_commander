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
function applyToShipEndOfCombat(ship: ShipState): ShipState {
  const effective = computeEffectiveAttributes(ship);

  const restoredShield = effective.maxShield;
  const restoredArmor = effective.maxArmor;
  const regenAmmo = effective.regenAmmo;

  const newAmmo = Math.min(
    ship.currentAmmo + regenAmmo,
    effective.maxAmmo
  );

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
  };
}

/**
 * Applies end-of-combat effects to the full game state (player, enemies, boss).
 */
export function applyEndOfCombatEffects(gameState: GameState): GameState {
  const updatedPlayer = {
    ...gameState.player_ship,
    ship: applyToShipEndOfCombat(gameState.player_ship.ship),
  };

  return {
    ...gameState,
    player_ship: updatedPlayer
  };
}
