// src/libs/logic/combat/CombatOrchestrator.ts

import { runCombatRound } from './RoundManager';
import { handleStageProgression } from './StageManager';
import { applyEndOfCombatEffects } from './EndOfCombatManager';
import { applyEndOfRoundEffects } from './EndOfRoundManager';
import { isShipDead } from '../../state/Ships/ShipLogic';

import { MessageBus } from '../../../contexts/MessageContext';

import type { GameState } from '../../state/GameState';
import type { GameMetaState } from '../../state/MetaGameState';
import type { EnemyStatus, EnemyShipState } from '../../state/Ships/EnemyShipState';



export function resolveCombatStep(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState] {
  const [afterCombatState, afterCombatMeta, targetEnemy] = runCombatRound(gameState, metaState);

  const afterEffects = applyEndOfRoundEffects(afterCombatState);

  // ICI FAUT GERER QUE L4NEMI EST BIEN MORT


  // Délègue au stage manager la gestion complète de la progression du stage
  const [finalGameState, finalMetaState] = handleStageProgression(afterEffects, afterCombatMeta);

  const withRewards = targetEnemy
    ? collectCombatReward(finalGameState, targetEnemy)
    : finalGameState;

  return [withRewards, finalMetaState];
}


export function collectCombatReward(
  state: GameState,
  enemy: EnemyShipState
): GameState {
  const moneyReward = enemy.bounty ?? 0;
  const xpReward = enemy.xp ?? 0;
  const incomeBonus = state.economy.income;
  const totalCredits = moneyReward + incomeBonus;

  MessageBus.send({
    type: 'success',
    text: `Defeated ${enemy.ship.name}! +${xpReward} XP, +${totalCredits} credits.`,
  });

  return applyEndOfCombatEffects({
    ...state,
    economy: {
      ...state.economy,
      credits: state.economy.credits + totalCredits,
    },
    player_ship: {
      ...state.player_ship,
      xp: state.player_ship.xp + xpReward,
    },
  });
}


/**
 * Applies a skip to the next non-boss enemy in the list.
 * Returns the updated GameState.
 */
export function resolveSkipEnemy(
  gameState: GameState,
  metaState: GameMetaState
): [GameState, GameMetaState] {
  const boss = gameState.stage_boss_ship;
  const nextEnemy =
    gameState.stage_enemy_ships.find((e) => e.status === 'alive') ??
    (boss?.status === 'alive' ? boss : null);

  if (!nextEnemy || nextEnemy === boss) {
    // Rien à skip, mais on s'assure que la progression de stage est appliquée
    return handleStageProgression(gameState, metaState);
  }

  const skippedEnemies = gameState.stage_enemy_ships.map((e) =>
    e === nextEnemy ? { ...e, status: 'skipped' as EnemyStatus } : e
  );

  const skippedState: GameState = {
    ...gameState,
    stage_enemy_ships: skippedEnemies,
  };

  // Applique les effets de fin de combat (ammo regen, etc.) avant progression
  const afterEffects = applyEndOfCombatEffects(skippedState);

  // Délègue tout à handleStageProgression (sync status, update meta, avancer stage)
  return handleStageProgression(afterEffects, metaState);
}


/**
 * Met à jour le statut d’un vaisseau ennemi selon ses HP :
 * - Si ses HP sont tombés à 0, il est marqué comme mort.
 * - Si déjà mort, on le maintient à 0 HP (même s’il a regagné de la vie).
 */
export function updateShipDeathStatus(ship: EnemyShipState): EnemyShipState {
  if (ship.status !== 'dead' && isShipDead(ship.ship)) {
    return { ...ship, status: 'dead' };
  }

  if (ship.status === 'dead' && ship.ship.currentHp > 0) {
    return { ...ship, ship: { ...ship.ship, currentHp: 0 } };
  }

  return ship;
}

export function enforceEnemyStatuses(
  enemies: EnemyShipState[],
  boss: EnemyShipState | null
): [EnemyShipState[], EnemyShipState | null] {
  return [
    enemies.map(updateShipDeathStatus),
    boss ? updateShipDeathStatus(boss) : null,
  ];
}