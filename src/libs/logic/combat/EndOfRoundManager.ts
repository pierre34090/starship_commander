// src/libs/logic/Combat/ApplyEndOfRoundEffects.ts


import { applyElementalStatusEffects } from './ElementalEffectUtils';
import { computeEffectiveAttributes } from '../../state/Ships/ShipLogic';
import { findNextEnemy } from './RoundManager';


import type { GameState } from '../../state/GameState';
import type { ShipState } from '../../state/Ships/ShipState';

import { MessageBus } from '../../../contexts/MessageContext';


/**
 * Applique les effets élémentaires, puis régénère les boucliers.
 */
function applyEffectsAndRegen(ship: ShipState): ShipState {
  // 1. Applique les dégâts ou effets persistants (feu, acide, etc.)
  const base = applyElementalStatusEffects(ship);

  // Si le vaisseau est mort, on ne régénère pas
  
  if (base.currentHp <= 0) {
    return base;
  }

  // 2. Recalcule les stats avec les modules actifs
  const stats = computeEffectiveAttributes(base);

  // 3. Régénère le bouclier selon la stat effective
  const regen = stats.regenShield ?? 0;
  const before = base.currentShield ?? 0;
  const after = Math.min(stats.maxShield, before + regen);
  const applied = after - before;

  MessageBus.send({
    type: 'info',
    text: `${ship.name} regenerates ${applied} shield.`,
  });

  return {
    ...base,
    currentShield: after,
  };
}

/**
 * Applique les effets de fin de round :
 * - effets élémentaires
 * - régénération des boucliers
 */

export function applyEndOfRoundEffects(gameState: GameState): GameState {
  const activeEnemy = findNextEnemy(gameState.stage_enemy_ships, gameState.stage_boss_ship);

  return {
    ...gameState,

    // Applique les effets sur le vaisseau joueur
    player_ship: {
      ...gameState.player_ship,
      ship: applyEffectsAndRegen(gameState.player_ship.ship),
    },

    // Applique les effets sur l’ennemi actif uniquement
    stage_enemy_ships: gameState.stage_enemy_ships.map(enemy => {
      if (enemy === activeEnemy) {
        return {
          ...enemy,
          ship: applyEffectsAndRegen(enemy.ship),
        };
      }
      return enemy;
    }),

    // Applique les effets sur le boss uniquement si c’est l’ennemi actif
    stage_boss_ship:
      gameState.stage_boss_ship && gameState.stage_boss_ship === activeEnemy
        ? {
            ...gameState.stage_boss_ship,
            ship: applyEffectsAndRegen(gameState.stage_boss_ship.ship),
          }
        : gameState.stage_boss_ship,
  };
}
